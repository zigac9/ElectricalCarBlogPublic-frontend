import React from "react";
import RecommendedRouteShowMap from "./ShowChargerMap/RecommendedRouteShowMap";

const RecommendedRouteDetails = ({ postDetails }) => {
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
    <>
      <div className="border-t border-2 border-gray-700 mt-10"></div>
      <div>
        {postDetails?.startingLocation && postDetails?.endLocation && (
          <div className="container p-4 py-8 mx-auto lg:px-8">
            <div>
              <h2 className="text-3xl font-bold tracki text-center text-gray-50 break-words mb-7">
                Application recommended route
              </h2>
            </div>
            <div className="grid grid-cols-2 row-gap-6 md:grid-cols-6">
              <div className="text-center  md:border-r">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatDistance(
                    postDetails?.recommendedChargers?.routeDetails?.sumDistance
                  )}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Distance
                </p>
              </div>
              <div className="text-center md:border-r px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatTime(
                    postDetails?.recommendedChargers?.routeDetails?.sumTime
                  )}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Total time
                </p>
              </div>
              <div className="text-center md:border-r pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatTime(
                    postDetails?.recommendedChargers?.routeDetails
                      ?.sumTimeTraveling
                  )}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Driving time
                </p>
              </div>
              <div className="text-center md:border-r pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {formatTime(
                    postDetails?.recommendedChargers?.routeDetails
                      ?.sumTimeCharging
                  )}
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Charging Time
                </p>
              </div>
              <div className="text-center md:border-r pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {postDetails?.recommendedChargers?.routeDetails?.sumCost
                    ? postDetails.recommendedChargers.routeDetails.sumCost.toFixed(
                        2
                      )
                    : "0.00"}{" "}
                  €
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Cost for charging
                </p>
              </div>
              <div className="text-center pt-5 lg:pt-0 md:pt-0 px-2">
                <h6 className="text-2xl font-bold text-gray-300">
                  {postDetails?.recommendedChargers?.routeDetails
                    ?.avgConsumption
                    ? (
                        postDetails.recommendedChargers.routeDetails
                          .avgConsumption * 100
                      ).toFixed(2)
                    : "0.00"}{" "}
                  kWh/100km
                </h6>
                <p className="text-sm font-medium tracking-widest text-gray-500 uppercase lg:text-base">
                  Average consumption
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <RecommendedRouteShowMap postDetails={postDetails} />
    </>
  );
};

export default RecommendedRouteDetails;
