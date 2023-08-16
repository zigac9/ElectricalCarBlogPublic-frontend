import { getChargersOnRoad } from "./GetChargerOnRoad";
import { getElevation } from "./RouteCalcFuncs";

class RouteCalculator {
  constructor(
    startLocation,
    endLocation,
    usableBatterySize,
    efficiency,
    fastChargerPower
  ) {
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.isRouteEnded = false;
    this.chargers = [];
    this.fullUsableBattery = usableBatterySize;
    this.resetFullUsableBattery = usableBatterySize;
    this.efficiency = efficiency;
    this.chargingPrice = 0.25;
    this.fastChargerPower = fastChargerPower;
  }

  setIsRouteEnded(value) {
    this.isRouteEnded = value;
  }

  setStartPosition(value) {
    this.startLocation = value;
  }

  setFullUsableBattery(value) {
    this.fullUsableBattery = value;
  }

  async calculateDirections() {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: new window.google.maps.LatLng(
        parseFloat(this.startLocation?.lat),
        parseFloat(this.startLocation?.lng)
      ),
      destination: new window.google.maps.LatLng(
        parseFloat(this.endLocation?.lat),
        parseFloat(this.endLocation?.lng)
      ),
      travelMode: "DRIVING",
      provideRouteAlternatives: true,
    };

    return new Promise((resolve, reject) => {
      directionsService.route(request, function (result, status) {
        if (status === "OK") {
          resolve(result);
        } else {
          reject(status);
          throw new Error("Directions request failed due to " + status);
        }
      });
    });
  }

  async calculateCharger(route, elevation) {
    const pathLength = route.overview_path.length;
    let level = 1;

    if (pathLength > 800) {
      throw new Error("Path is too long");
    } else if (pathLength > 600) {
      level = 4;
    } else if (pathLength > 300) {
      level = 3;
    } else if (pathLength > 100) {
      level = 2;
    }

    return await getChargersOnRoad(
      route,
      elevation,
      level,
      this.efficiency,
      this.fullUsableBattery,
      this.fastChargerPower
    );
  }

  async calculateTimeBatteryLevelPrice(charger) {
    const direction = await this.getDirection(charger);
    const distance = direction.routes[0].legs[0].distance.value;
    const time = direction.routes[0].legs[0].duration.value / 60;
    const consumption = charger?.avgConsumption * (distance / 1000);
    let currentBatteryLevel = this.fullUsableBattery - consumption;
    if (currentBatteryLevel <= 0 && currentBatteryLevel >= -0.1) {
      currentBatteryLevel = 0.1;
    }

    const timeForCharging =
      ((this.fullUsableBattery - currentBatteryLevel) / charger?.maxPower) * 60; // na minuto
    const costForCharging =
      (this.fullUsableBattery - currentBatteryLevel) * this.chargingPrice;
    return {
      timeForCharging,
      costForCharging,
      distance,
      time,
      currentBatteryLevel,
    };
  }

  async calculateTimeBatteryLevelPriceForDestination() {
    const direction = await this.calculateDirections();
    const distance = direction.routes[0].legs[0].distance.value;
    const time = direction.routes[0].legs[0].duration.value / 60;
    return { distance, time };
  }

  async getDirection(charger) {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: new window.google.maps.LatLng(
        parseFloat(this.startLocation?.lat),
        parseFloat(this.startLocation?.lng)
      ),
      destination: new window.google.maps.LatLng(
        parseFloat(charger?.charger?.AddressInfo.Latitude),
        parseFloat(charger?.charger?.AddressInfo.Longitude)
      ),
      travelMode: "DRIVING",
    };

    return new Promise((resolve, reject) => {
      directionsService.route(request, function (result, status) {
        if (status === "OK") {
          resolve(result);
        } else {
          reject(status);
          throw new Error("Directions request failed due to " + status);
        }
      });
    });
  }

  async calculateRoute() {
    while (!this.isRouteEnded) {
      const directions = await this.calculateDirections();
      let errorArray;

      for (let route of directions?.routes) {
        errorArray = [];
        const elevation = await getElevation(route);
        const charger = await this.calculateCharger(route, elevation);

        if (charger?.charger === null) {
          const calcRouteDetails =
            await this.calculateTimeBatteryLevelPriceForDestination();
          this.chargers.push({
            charger: null,
            timeForCharging: 0,
            costForCharging: 0,
            distance: calcRouteDetails.distance,
            time: calcRouteDetails.time,
            currentBatteryLevel: charger.batterySize,
            avgConsumption: charger.avgConsumption,
          });
          this.setIsRouteEnded(true);
          break;
        } else if (charger === 1) {
          errorArray.push(charger);
        } else if (charger === 2) {
          errorArray.push(charger);
        } else {
          const calcRouteDetails = await this.calculateTimeBatteryLevelPrice(
            charger
          );
          this.setStartPosition({
            lat: charger?.charger?.AddressInfo.Latitude,
            lng: charger?.charger?.AddressInfo.Longitude,
          });
          this.setFullUsableBattery(this.resetFullUsableBattery);
          if (this.chargers.length > 0) {
            const lastCharger = this.chargers[this.chargers.length - 1];
            if (
              lastCharger?.charger?.AddressInfo.Latitude ===
                charger?.charger?.AddressInfo.Latitude &&
              lastCharger?.charger?.AddressInfo.Longitude ===
                charger?.charger?.AddressInfo.Longitude
            ) {
              errorArray.push(1);
            }
          }
          if (errorArray.length === 0) {
            this.chargers.push({
              charger: charger?.charger,
              timeForCharging: calcRouteDetails.timeForCharging,
              costForCharging: calcRouteDetails.costForCharging,
              distance: calcRouteDetails.distance,
              time: calcRouteDetails.time,
              currentBatteryLevel: calcRouteDetails.currentBatteryLevel,
              avgConsumption: charger?.avgConsumption,
              chargerPower: charger?.maxPower,
            });
            break;
          }
        }
      }
      if (errorArray.length > 0) {
        throw new Error(
          "No chargers found, battery is dead before reaching charger! This battery is not suitable for this route!"
        );
      }
    }
    return this.chargers;
  }

  async routeDetails(chargers) {
    let sumDistance = 0;
    let sumTimeTraveling = 0;
    let sumTimeCharging = 0;
    let sumCost = 0;
    let sumAvgConsumption = 0;
    for (let charger of chargers) {
      sumDistance += charger.distance;
      sumTimeTraveling += charger.time;
      sumTimeCharging += charger.timeForCharging;
      sumCost += charger.costForCharging;
      sumAvgConsumption += charger.avgConsumption;
    }
    const avgConsumption = sumAvgConsumption / chargers.length;
    const sumTime = sumTimeTraveling + sumTimeCharging;
    return {
      sumDistance,
      sumTime,
      sumTimeTraveling,
      sumTimeCharging,
      sumCost,
      avgConsumption,
    };
  }
}

export default RouteCalculator;
