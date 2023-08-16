import { useState, useEffect } from "react";
import axios from "axios";

export const useOpenChargeMap = ({ lat, lng, distance }) => {
  const [places, setPlaces] = useState([]);

  const fetchData = async (_lat, _lng, _distance) => {
    const result = await axios(
      "https://api.openchargemap.io/v3/poi?key=OPEN_CHARGE_MAP_API_KEY",
      {
        params: {
          output: "json",
          distance: _distance,
          distanceunit: "km",
          latitude: _lat,
          longitude: _lng,
          maxresults: 5000,
          verbose: false,
        },
      }
    );
    setPlaces(result.data);
  };

  useEffect(() => {
    fetchData(lat, lng, distance).then(() => {});
  }, [lat, lng, distance]);

  return places;
};
