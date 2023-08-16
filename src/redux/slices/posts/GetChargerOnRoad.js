import {
  getDirections,
  getChargers,
  calculateDistance,
  getEnergyConsumption,
  getWeather,
  calculatePrecipitationImpact,
  calculateTemperatureImpact,
  calculateWindImpact,
} from "./RouteCalcFuncs";

export const getChargersOnRoad = async (
  route,
  elevation,
  deviation,
  efficiency,
  fullUsableBattery,
  fastChargerPower
) => {
  const path = route.overview_path;

  let usableBatterySize = fullUsableBattery; //kWh
  const efficiencyKwh = efficiency / 1000; //kwh

  let newFetch = 0;
  let sumConsumption = 0;
  let indexConsumption = 0;

  //20 km of range is needed to find charger, min is 8km
  let batteryToFindCharger = 20 * efficiencyKwh;
  let minBatteryToFindCharger = 8 * efficiencyKwh;

  let distancesAndTime = null;
  let weather = null;
  const fetchIncrements = [25, 15, 10, 5, 4, 3, 2, 1];
  let index = 0;

  let slicedPath = [];
  let slicedElevation = [];
  let batteryLevel = [];
  for (let i = 0; i < path.length; i += deviation) {
    if (i + deviation < path.length) {
      slicedPath.push(path[i]);
      slicedElevation.push(elevation[i]);
    } else {
      slicedPath.push(path[path.length - 1]);
      slicedElevation.push(elevation[elevation.length - 1]);
    }
  }

  for (let i = 0; i < slicedPath.length; i++) {
    if (i + 1 < slicedPath.length) {
      if (i === newFetch || i === 0) {
        for (let increment of fetchIncrements) {
          if (slicedPath.length - 1 - i >= increment) {
            const originFetch = slicedPath[i];
            const destinationFetch = slicedPath[i + increment];
            let waypoints = slicedPath.slice(i + 1, i + increment);
            waypoints = waypoints?.map((location) => ({
              location,
              stopover: true,
            }));
            index = 0;

            distancesAndTime = await getDirections(
              originFetch,
              destinationFetch,
              waypoints
            );

            weather = await getWeather(
              distancesAndTime?.request?.origin?.location?.lat().toString() +
                "," +
                distancesAndTime?.request?.origin?.location?.lng().toString()
            );

            newFetch += increment;
            break;
          }
        }
      } else {
        index++;
      }

      if (distancesAndTime === null) {
        return 2;
      }

      const precipitationImpact = await calculatePrecipitationImpact(
        weather?.forecast?.forecastday[0]?.day?.totalprecip_mm
      );
      const tempImpact = await calculateTemperatureImpact(
        weather?.forecast?.forecastday[0]?.day?.avgtemp_c
      );
      const windImpact = await calculateWindImpact(
        weather?.forecast?.forecastday[0]?.day?.maxwind_mph
      );

      const drivingDistanceKm =
        distancesAndTime.routes[0].legs[index].distance.value === 0
          ? 1 / 1000
          : distancesAndTime.routes[0].legs[index].distance.value / 1000;
      const elevationGain =
        slicedElevation[i + 1].elevation - slicedElevation[i].elevation === 0
          ? 0
          : (slicedElevation[i + 1].elevation - slicedElevation[i].elevation) /
            1000;
      const avgSpeed =
        distancesAndTime.routes[0].legs[index].duration.value === 0
          ? drivingDistanceKm / (1 / 3600)
          : drivingDistanceKm /
            (distancesAndTime.routes[0].legs[index].duration.value / 3600);

      let selectedCharger = null;
      const energyConsumption = await getEnergyConsumption(
        elevationGain,
        efficiencyKwh,
        drivingDistanceKm,
        avgSpeed,
        precipitationImpact,
        tempImpact,
        windImpact
      );
      usableBatterySize -= energyConsumption;
      sumConsumption += energyConsumption / drivingDistanceKm;
      indexConsumption++;

      batteryLevel.push(usableBatterySize);

      let checkNextConsumption = false;
      let batteryOnNext = usableBatterySize;
      if (i + 2 < slicedPath.length) {
        let indexNext = index + 1;
        if (index + 1 >= distancesAndTime.routes[0].legs.length) {
          indexNext = 0;
        }
        // next consumption to view if we need to find charger before
        checkNextConsumption = true;
        const nextDrivingDistanceKm =
          distancesAndTime.routes[0].legs[indexNext].distance.value === 0
            ? 1 / 1000
            : distancesAndTime.routes[0].legs[indexNext].distance.value / 1000;
        const nextElevationGain =
          slicedElevation[i + 2].elevation -
            slicedElevation[i + 1].elevation ===
          0
            ? 0
            : (slicedElevation[i + 2].elevation -
                slicedElevation[i + 1].elevation) /
              1000;
        const nextAvgSpeed =
          distancesAndTime.routes[0].legs[indexNext].duration.value === 0
            ? nextDrivingDistanceKm / (1 / 3600)
            : nextDrivingDistanceKm /
              (distancesAndTime.routes[0].legs[indexNext].duration.value /
                3600);

        const energyConsumption = await getEnergyConsumption(
          nextElevationGain,
          efficiencyKwh,
          nextDrivingDistanceKm,
          nextAvgSpeed,
          precipitationImpact,
          tempImpact,
          windImpact
        );
        batteryOnNext -= energyConsumption;
      }

      //based on average consumption start searching for charger
      batteryToFindCharger = 20 * (sumConsumption / indexConsumption);
      minBatteryToFindCharger = 10 * (sumConsumption / indexConsumption);

      let availableChargers = [];
      if (usableBatterySize <= 0) {
        return 1;
      }
      if (
        usableBatterySize <= batteryToFindCharger ||
        (checkNextConsumption && batteryOnNext <= minBatteryToFindCharger)
      ) {
        const kmtToCharger = usableBatterySize / efficiencyKwh;
        if (kmtToCharger < 5) {
          return 1;
        }

        let minus = 0;
        while (availableChargers.length === 0 && i - minus >= 0) {
          const kmtToCharger = batteryLevel[i - minus] / efficiencyKwh;
          const chargers = await getChargers(
            slicedPath[i - minus].lat(),
            slicedPath[i - minus].lng(),
            kmtToCharger - 5
          );
          const operationalChargers = chargers?.filter(
            (charger) => charger?.StatusType?.IsOperational
          );

          const hasHighPowerConnection = (charger) => {
            return charger?.Connections?.some(
              (connection) => connection?.PowerKW <= fastChargerPower
            );
          };

          availableChargers = operationalChargers?.filter(
            hasHighPowerConnection
          );
          minus++;
        }

        if (availableChargers.length === 0) {
          return 1;
        }

        let minDistanceAndMaxPower = Infinity;
        for (let chargerPoint of availableChargers) {
          const chargerDistance = await calculateDistance(
            slicedPath[0].lat(),
            slicedPath[0].lng(),
            chargerPoint.AddressInfo.Latitude,
            chargerPoint.AddressInfo.Longitude
          );
          const destinationDistance = await calculateDistance(
            chargerPoint.AddressInfo.Latitude,
            chargerPoint.AddressInfo.Longitude,
            slicedPath[slicedPath.length - 1].lat(),
            slicedPath[slicedPath.length - 1].lng()
          );

          const sumDistance = chargerDistance + destinationDistance;
          let maxPower = 0;

          for (const connection of chargerPoint?.Connections) {
            if (
              connection?.PowerKW > maxPower &&
              connection?.PowerKW <= fastChargerPower
            ) {
              maxPower = connection?.PowerKW;
            }
          }

          const calculateIndex = sumDistance / maxPower;
          if (calculateIndex < minDistanceAndMaxPower) {
            minDistanceAndMaxPower = calculateIndex;
            selectedCharger = {
              chargerPoint,
              maxPower,
            };
          }
        }
        if (selectedCharger !== null) {
          return {
            charger: selectedCharger?.chargerPoint,
            maxPower: selectedCharger?.maxPower,
            avgConsumption: sumConsumption / indexConsumption,
          };
        }
      }
    }
  }
  return {
    charger: null,
    batterySize: usableBatterySize,
    avgConsumption: sumConsumption / indexConsumption,
  };
};
