import {
  MapIcon,
  CheckCircleIcon,
  ArrowDownIcon,
  StarIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import MapRouteElectrical from "./ShowChargerMap/MapRouteElectrical";

const SelectedRouteDetails = ({ postDetails }) => {
  const [chargers, setChargers] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [status, setStatus] = useState("");
  const [showError, setShowError] = useState(false);
  const [calcRoute, setCalcRoute] = useState({});
  const [directionLegs, setDirectionLegs] = useState([]);

  useEffect(() => {
    const calculateDirections = async () => {
      if (postDetails?.chargers) {
        const sortedChargers = [...postDetails.chargers].sort((a, b) => {
          return a?.sequenceNumber - b?.sequenceNumber;
        });
        setChargers(sortedChargers);

        const markerArr = [];

        const startMarker = {
          chargerInfo: {
            AddressInfo: {
              Latitude: postDetails?.startingLocation?.lat,
              Longitude: postDetails?.startingLocation?.lng,
            },
          },
          title: postDetails?.startingLocation?.address,
        };
        const endMarker = {
          chargerInfo: {
            AddressInfo: {
              Latitude: postDetails?.endLocation?.lat,
              Longitude: postDetails?.endLocation?.lng,
            },
          },
          title: postDetails?.endLocation?.address,
        };
        markerArr.push(startMarker);
        markerArr.push(...sortedChargers);
        markerArr.push(endMarker);
        setMarkers(markerArr);

        const directions = await getDirections(
          postDetails?.startingLocation?.address,
          postDetails?.endLocation?.address,
          sortedChargers?.map((charger) => {
            return {
              location: charger?.chargerInfo?.AddressInfo?.AddressLine1,
              stopover: true,
            };
          })
        );
        setDirectionLegs(directions?.routes[0]?.legs);

        const calculateSelectedRoute = await calcSelectedRoute(
          directions?.routes[0]?.legs,
          sortedChargers
        );
        setCalcRoute(calculateSelectedRoute);
      }
    };

    calculateDirections().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    postDetails?.chargers,
    postDetails?.endLocation,
    postDetails?.startingLocation,
  ]);

  function formatDistance(meters) {
    if (meters < 1000) {
      return `${meters}m`;
    } else {
      const kilometers = Math.floor(meters / 1000);
      const remainingMeters = Math.round(meters % 1000);
      return `${kilometers}km ${remainingMeters}m`;
    }
  }

  function formatTime(minutes) {
    if (minutes < 60) {
      return `${Math.round(minutes)}min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours}h ${remainingMinutes}min`;
    }
  }

  function getMaxPower(charger) {
    if (charger) {
      let maxPower = 0;
      for (const connection of charger?.chargerInfo?.Connections) {
        if (connection?.PowerKW > maxPower) {
          maxPower = connection?.PowerKW;
        }
      }
      return maxPower;
    }
    return 0;
  }

  function calcTimeForCharging(charger) {
    const maxPower = getMaxPower(charger);
    return (
      ((postDetails?.usableBatterySize - charger?.batteryLevel) / maxPower) * 60
    );
  }

  function calcCostForCharging(charger) {
    return (postDetails?.usableBatterySize - charger?.batteryLevel) * 0.25;
  }

  const getDirections = async (origin, destination, waypoints) => {
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

  const calcSelectedRoute = async (legs, sortedCharges) => {
    let distance = 0;
    let timeSeconds = 0;
    let chargingTime = 0;
    let chargingCost = 0;
    let sumConsumption = 0;

    for (let i = 0; i < legs.length; i++) {
      distance += legs[i].distance.value;
      timeSeconds += legs[i].duration.value;

      if (i < legs.length - 1) {
        chargingTime += calcTimeForCharging(sortedCharges[i]);
        chargingCost += calcCostForCharging(sortedCharges[i]);
        sumConsumption += sortedCharges[i]?.avgConsumption;
      }
    }
    const avgConsumption =
      sumConsumption > 0 ? sumConsumption / (legs.length - 1) : 0;
    const time = timeSeconds / 60;
    const sumTime = time + chargingTime;
    const batteryLevelAtDestination =
      postDetails?.usableBatterySize -
      (legs[legs.length - 1].distance.value / 1000) * (avgConsumption / 100);
    return {
      distance,
      time,
      chargingTime,
      chargingCost,
      sumTime,
      avgConsumption,
      batteryLevelAtDestination,
    };
  };

  return (
    <section className="bg-gray-800 text-gray-100 mt-2">
      <div className="mx-auto">
        {!showError && (
          <div className="container p-4 py-8 mx-auto lg:px-8">
            <div>
              <h2 className="text-3xl font-bold tracki text-center text-gray-50 break-words">
                Described route from {postDetails?.user?.firstName}{" "}
                {postDetails?.user?.lastName}
              </h2>
              <p className="mx-auto mt-6 text-xl text-gray-400 break-words">
                {postDetails?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 row-gap-6 md:grid-cols-6 mt-8">
              <div className="text-center  md:border-r">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatDistance(calcRoute?.distance)}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Distance
                </p>
              </div>
              <div className="text-center md:border-r px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatTime(calcRoute?.sumTime)}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Total time
                </p>
              </div>
              <div className="text-center md:border-r pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatTime(calcRoute?.time)}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Driving time
                </p>
              </div>
              <div className="text-center md:border-r pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatTime(calcRoute?.chargingTime)}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Charging Time
                </p>
              </div>
              <div className="text-center md:border-r pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {calcRoute?.chargingCost?.toFixed(2)} €
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Cost for charging
                </p>
              </div>
              <div className="text-center pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {calcRoute?.avgConsumption?.toFixed(2)} kWh/100km
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Average consumption
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid gap-6 row-gap-10 lg:grid-cols-2">
          <div className="lg:py-6 lg:pr-16">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                    <MapIcon className="w-6 text-white" />
                  </div>
                </div>
                <div className="w-px h-full bg-gray-300" />
              </div>
              <div className="pt-1 pb-8">
                <p className="mb-1 text-lg font-bold">Start location </p>
                <p className="mb-2 text-md text-gray-400">
                  {postDetails?.startingLocation?.address}
                </p>
              </div>
            </div>
            {chargers?.map((charger, index) => (
              <div className="flex" key={charger?._id}>
                <div className="flex flex-col items-center mr-4">
                  <div>
                    <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                      <ArrowDownIcon className="w-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="w-px h-full bg-gray-300" />
                </div>
                <div className="pt-1 pb-8">
                  <p className="mb-1 text-lg font-bold">Stop {index + 1}</p>
                  <p className="mb-2 text-md text-gray-400 break-words">
                    {charger?.chargerInfo?.AddressInfo?.AddressLine1},{" "}
                    {charger?.chargerInfo?.AddressInfo?.Town} ({charger?.title})
                  </p>

                  <details className="w-full">
                    <summary className="focus:outline-none focus-visible:ri text-gray-200 hover:text-white hover:underline cursor-pointer ">
                      Press to see details
                    </summary>
                    <p className="text-gray-400 break-words mb-1">
                      <span className="text-gray-500 font-bold">
                        Description:{" "}
                      </span>
                      {charger?.description}
                    </p>
                    {!showError && (
                      <>
                        <p className="text-gray-400 break-words mb-1">
                          <span className="text-gray-500">
                            Average consumption:{" "}
                          </span>
                          {charger?.avgConsumption} kWh/100km
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className="text-gray-500">
                            Battery level at charging station:{" "}
                          </span>
                          {charger?.batteryLevel} kWh
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className="text-gray-500">
                            Distance from previous stop to this charger:{" "}
                          </span>
                          {formatDistance(
                            directionLegs[index]?.distance?.value
                          )}
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className="text-gray-500">
                            Time traveling:{" "}
                          </span>
                          {formatTime(
                            directionLegs[index]?.duration?.value / 60
                          )}
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Time spent charging:{" "}
                          </span>
                          {formatTime(calcTimeForCharging(charger))}
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Power of charger:{" "}
                          </span>
                          {getMaxPower(charger)} kW
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Cost for charging:{" "}
                          </span>
                          {calcCostForCharging(charger)} €
                        </p>
                      </>
                    )}
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-500">Rating: </span>
                      {[1, 2, 3, 4, 5]?.map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-6 w-6 ${
                            star <= charger?.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            ))}

            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                    <CheckCircleIcon className="w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="pt-1">
                <p className="mb-1 text-lg font-bold">End location</p>
                <p className="mb-2 text-md text-gray-400">
                  {postDetails?.endLocation?.address}{" "}
                </p>
                {!showError && (
                  <details className="w-full">
                    <summary className="focus:outline-none focus-visible:ri text-gray-200 hover:text-white hover:underline cursor-pointer ">
                      Press to see details
                    </summary>
                    <p className="text-gray-400 break-words mb-1">
                      <span className="text-gray-500">
                        Average consumption:{" "}
                      </span>
                      {calcRoute?.avgConsumption?.toFixed(2)} kWh/100km
                    </p>
                    <p className="text-gray-400 break-words mb-1">
                      <span className="text-gray-500">
                        Battery level at destination:{" "}
                      </span>
                      {calcRoute?.batteryLevelAtDestination >= 0
                        ? calcRoute?.batteryLevelAtDestination?.toFixed(4)
                        : "0.0"}{" "}
                      kWh
                    </p>
                    <p className="text-gray-400 break-words mb-1">
                      <span className="text-gray-500">
                        Distance from previous stop to this charger:{" "}
                      </span>
                      {formatDistance(
                        directionLegs[directionLegs.length - 1]?.distance?.value
                      )}
                    </p>
                    <p className="text-gray-400 break-words mb-1">
                      <span className="text-gray-500">Time traveling: </span>
                      {formatTime(
                        directionLegs[directionLegs.length - 1]?.duration
                          ?.value / 60
                      )}
                    </p>
                  </details>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            {showError ? (
              <>
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5"
                  role="alert"
                >
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">
                    Directions request failed due to {status}! <br /> Try not to
                    have locations where you need to use ferry.
                  </span>
                </div>
                <img
                  className="object-cover object-center rounded shadow-lg w-full sm:h-96"
                  src="https://images.unsplash.com/photo-1663575438786-98c9ac96640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80"
                  alt=""
                />
              </>
            ) : markers.length > 0 ? (
              <MapRouteElectrical
                markers={markers}
                setStatus={setStatus}
                setShowError={setShowError}
              />
            ) : (
              <img
                className="object-cover object-center rounded shadow-lg w-full sm:h-96"
                src="https://images.unsplash.com/photo-1663575438786-98c9ac96640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2066&q=80"
                alt=""
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedRouteDetails;
