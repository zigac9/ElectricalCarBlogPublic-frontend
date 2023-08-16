import {
  ArrowDownIcon,
  CheckCircleIcon,
  MapIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import MapRouteElectrical from "./MapRouteElectrical";

const RecommendedRouteShowMap = ({ postDetails }) => {
  const [markers, setMarkers] = useState([]);
  //eslint-disable-next-line
  const [status, setStatus] = useState("");
  //eslint-disable-next-line
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (postDetails?.recommendedChargers?.chargersAuto) {
      const sortedChargers = postDetails?.recommendedChargers?.chargersAuto
        ?.slice(0, postDetails?.recommendedChargers?.chargersAuto?.length - 1)
        ?.map((charger) => {
          return { chargerInfo: charger?.charger };
        });

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
    }
  }, [
    postDetails?.endLocation,
    postDetails?.recommendedChargers?.chargersAuto,
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

  return (
    <section className="bg-gray-800 text-gray-100 mt-2 mb-10">
      <div className="mx-auto">
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
            {postDetails?.recommendedChargers?.chargersAuto?.length > 1 &&
              postDetails?.recommendedChargers?.chargersAuto
                ?.slice(
                  0,
                  postDetails?.recommendedChargers?.chargersAuto.length - 1
                )
                ?.map((charger, index) => (
                  <div className="flex" key={charger?.charger?.ID}>
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
                        {charger?.charger?.AddressInfo?.AddressLine1},{" "}
                        {charger?.charger?.AddressInfo?.Town} (
                        {charger?.charger?.AddressInfo?.Country?.Title})
                      </p>
                      <details className="w-full ">
                        <summary className="focus:outline-none focus-visible:ri text-gray-200 hover:text-white hover:underline cursor-pointer">
                          Press to see details
                        </summary>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Average consumption:{" "}
                          </span>
                          {charger?.avgConsumption
                            ? (charger?.avgConsumption * 100).toFixed(2)
                            : "0.00"}{" "}
                          kWh/100km
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Battery level at charging station:{" "}
                          </span>
                          {charger?.currentBatteryLevel
                            ? charger?.currentBatteryLevel.toFixed(4)
                            : "0.00"}{" "}
                          kWh
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Distance from previous stop to this charger:{" "}
                          </span>
                          {formatDistance(charger?.distance)}
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Time traveling:{" "}
                          </span>
                          {formatTime(charger?.time)}
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Time spent charging:{" "}
                          </span>
                          {formatTime(charger?.timeForCharging)}
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Power of charger:{" "}
                          </span>
                          {charger?.chargerPower} kW
                        </p>
                        <p className="text-gray-400 break-words mb-1">
                          <span className={"text-gray-500"}>
                            Cost for charging:{" "}
                          </span>
                          {charger?.costForCharging
                            ? charger?.costForCharging.toFixed(2)
                            : "0.00"}{" "}
                          €
                        </p>
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
                <details className="w-full">
                  <summary className="focus:outline-none focus-visible:ri text-gray-200 hover:text-white hover:underline cursor-pointer ">
                    Press to see details
                  </summary>
                  <p className="text-gray-400 break-words mb-1">
                    <span className={"text-gray-500"}>
                      Average consumption:{" "}
                    </span>
                    {postDetails?.recommendedChargers?.chargersAuto[
                      postDetails?.recommendedChargers?.chargersAuto.length - 1
                    ].avgConsumption
                      ? (
                          postDetails?.recommendedChargers?.chargersAuto[
                            postDetails?.recommendedChargers?.chargersAuto
                              .length - 1
                          ].avgConsumption * 100
                        ).toFixed(2)
                      : "0.00"}{" "}
                    kWh/100km
                  </p>
                  <p className="text-gray-400 break-words mb-1">
                    <span className={"text-gray-500"}>
                      Battery level at destination:{" "}
                    </span>
                    {postDetails?.recommendedChargers?.chargersAuto[
                      postDetails?.recommendedChargers?.chargersAuto.length - 1
                    ].currentBatteryLevel
                      ? postDetails?.recommendedChargers?.chargersAuto[
                          postDetails?.recommendedChargers?.chargersAuto
                            .length - 1
                        ].currentBatteryLevel.toFixed(4)
                      : "0.00"}{" "}
                    kWh
                  </p>
                  <p className="text-gray-400 break-words mb-1">
                    <span className={"text-gray-500"}>
                      Distance from previous stop to destination:{" "}
                    </span>
                    {formatDistance(
                      postDetails?.recommendedChargers?.chargersAuto[
                        postDetails?.recommendedChargers?.chargersAuto.length -
                          1
                      ].distance
                    )}
                  </p>
                  <p className="text-gray-400 break-words mb-1">
                    <span className={"text-gray-500"}>Time traveling: </span>
                    {formatTime(
                      postDetails?.recommendedChargers?.chargersAuto[
                        postDetails?.recommendedChargers?.chargersAuto.length -
                          1
                      ].time
                    )}
                  </p>
                </details>
              </div>
            </div>
          </div>
          <div className="relative">
            {markers.length > 0 ? (
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

export default RecommendedRouteShowMap;
