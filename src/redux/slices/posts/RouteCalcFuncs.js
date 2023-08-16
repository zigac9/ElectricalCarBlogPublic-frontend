import axios from "axios";

export const getDirections = async (origin, destination, waypoints) => {
  return await new Promise((resolve, reject) => {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin,
      destination,
      waypoints,
      travelMode: "DRIVING",
    };
    directionsService.route(request, function (result, status) {
      if (status === "OK") {
        resolve(result);
      } else {
        console.log("Directions request failed due to " + status);
        reject(status);
      }
    });
  });
};

export const getChargers = async (_lat, _lng, _radius) => {
  const result = await axios(
    "https://api.openchargemap.io/v3/poi?key=OPEN-CHARGE-MAP-API-KEY",
    {
      params: {
        output: "json",
        distance: _radius,
        distanceunit: "km",
        latitude: _lat,
        longitude: _lng,
        maxresults: 5000,
        verbose: false,
      },
    }
  );
  return result.data;
};

export const getElevation = async (route) => {
  const elevationService = new window.google.maps.ElevationService();

  let elevationReturn = null;
  await elevationService.getElevationAlongPath(
    {
      path: route.overview_path,
      samples: route.overview_path.length,
    },
    function (elevations, status) {
      if (status === "OK") {
        elevationReturn = [...elevations];
      } else {
        console.log("Elevation service failed due to: " + status);
      }
    }
  );
  return elevationReturn;
};

export const getWeather = async (town) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const result = await axios(
    `http://api.weatherapi.com/v1/history.json?key=WEATHER-API-KEY&q=${town}&dt=${todayDate}`
  );
  return result.data;
};

export const calculatePrecipitationImpact = async (totalprecip_mm) => {
  const thresholds = [5, 10, 20, 30];
  let percentageImpact = 0;

  for (let i = 0; i < thresholds.length; i++) {
    if (totalprecip_mm >= thresholds[i]) {
      percentageImpact = thresholds[i];
    }
  }

  return 1 + percentageImpact / 100;
};

export const calculateTemperatureImpact = async (averageTemperature) => {
  let percentageImpact = 0;

  if (averageTemperature < -10) {
    percentageImpact = 30;
  } else if (
    (averageTemperature >= -10 && averageTemperature < 0) ||
    averageTemperature > 40
  ) {
    percentageImpact = 20;
  } else if (
    (averageTemperature >= 0 && averageTemperature < 10) ||
    averageTemperature >= 30
  ) {
    percentageImpact = 10;
  }

  return 1 + percentageImpact / 100;
};

export const calculateWindImpact = async (windSpeed) => {
  const windImpactFactor = 0.13;
  return 1 + (windSpeed / 10) * windImpactFactor;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371;

  const toRadians = (angle) => (angle * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

export const getEnergyConsumption = (
  elevationGain,
  efficiencyKwh,
  drivingDistanceKm,
  avgSpeed,
  precipitationImpact,
  tempImpact,
  windImpact
) => {
  if (elevationGain > 0) {
    return (
      drivingDistanceKm *
      efficiencyKwh *
      (1 + 0.005 * (avgSpeed - 60)) *
      (1 + 0.05 * elevationGain) *
      precipitationImpact *
      tempImpact *
      windImpact
    );
  } else if (elevationGain <= 0) {
    return (
      efficiencyKwh *
      drivingDistanceKm *
      (1 - 0.03 * Math.abs(elevationGain)) *
      (1 + 0.005 * (avgSpeed - 60)) *
      precipitationImpact *
      tempImpact *
      windImpact
    );
  }
};
