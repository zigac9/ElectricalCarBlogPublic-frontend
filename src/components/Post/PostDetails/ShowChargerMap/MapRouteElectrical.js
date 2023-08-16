import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ImgNotSelected from "../../../../img/charger/not-selected.svg";

const MapRouteElectrical = ({ markers, setStatus, setShowError }) => {
  const googleMapRef = useRef(null);
  const [map, setMap] = useState(null);
  const bounds = useMemo(() => new window.google.maps.LatLngBounds(), []);
  const infoWindow = useMemo(() => new window.google.maps.InfoWindow(), []);
  const [error, setError] = useState(false);

  const createMarker = useCallback(
    (position, charger, point) => {
      let marker = null;
      if (charger) {
        marker = new window.google.maps.Marker({
          position: position,
          map: map,
          draggable: false,
          icon: {
            url: ImgNotSelected,
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });
      } else {
        marker = new window.google.maps.Marker({
          position: position,
          map: map,
          draggable: false,
        });
        bounds.extend(marker.getPosition());
      }
      window.google.maps.event.addListener(marker, "click", function () {
        if (charger) {
          let maxPower = 0;
          for (const connection of point?.chargerInfo?.Connections) {
            if (connection?.PowerKW > maxPower) {
              maxPower = connection?.PowerKW;
            }
          }
          infoWindow.setContent(`
           <div style="max-width: 200px; color: black">
          <h2 style="margin-bottom: 5px;"><span style="font-weight: bold">Charger Provider: </span>${
            point?.chargerInfo?.OperatorInfo?.Title ??
            point?.chargerInfo?.AddressInfo?.Title
          }</h2>
          <p><span style="font-weight: 500">Number of connections: </span>${
            point?.chargerInfo?.Connections?.length ?? "0"
          } </p>
          <p><span style="font-weight: 500">Connections types: </span>${
            point?.chargerInfo?.Connections?.map(
              (connection) => connection?.ConnectionType?.FormalName ?? ""
            ).join(", ") ?? ""
          } </p>
          <p><span style="font-weight: 500">Max connection power: </span>${maxPower}kW </p>
          <p><span style="font-weight: 500">Address: </span>${
            point?.chargerInfo?.AddressInfo?.AddressLine1 ?? ""
          }, ${point?.chargerInfo?.AddressInfo?.Postcode ?? ""} ${
            point?.chargerInfo?.AddressInfo?.Town ?? ""
          }
            <p><span style="font-weight: 500">Country: </span>${
              point?.chargerInfo?.AddressInfo?.Country?.ContinentCode ?? ""
            }, ${point?.chargerInfo?.AddressInfo?.Country?.Title ?? ""} </p>
        </div>`);
        } else {
          infoWindow.setContent(`
           <div style="max-width: 200px; color: black">
          <h2 style="margin-bottom: 5px;"><span style="font-weight: bold">Address: </span>${point?.title}</h2>
        </div>`);
        }
        infoWindow.open(map, marker);
      });
    },
    [bounds, infoWindow, map]
  );

  useEffect(() => {
    if (!map) return;

    const directionsService = new window.google.maps.DirectionsService();
    ShowRouteAndMarkers().then(() => {});

    async function ShowRouteAndMarkers() {
      for (let i = 0; i < markers.length; i++) {
        if (i + 1 < markers.length) {
          let src = new window.google.maps.LatLng(
            parseFloat(markers[i]?.chargerInfo?.AddressInfo?.Latitude),
            parseFloat(markers[i]?.chargerInfo?.AddressInfo?.Longitude)
          );
          if (i === 0) {
            createMarker(src, false, markers[i]);
          } else {
            createMarker(src, true, markers[i]);
          }

          let des = new window.google.maps.LatLng(
            parseFloat(markers[i + 1]?.chargerInfo?.AddressInfo?.Latitude),
            parseFloat(markers[i + 1]?.chargerInfo?.AddressInfo?.Longitude)
          );
          if (i + 1 === markers.length - 1) {
            createMarker(des, false, markers[i + 1]);
          } else {
            createMarker(des, true, markers[i + 1]);
          }

          const request = {
            origin: src,
            destination: des,
            travelMode: "DRIVING",
          };

          await directionsService.route(request, function (response, status) {
            if (status === "OK") {
              setStatus("OK");
              setShowError(false);
              setError(false);
              const directionsRenderer =
                new window.google.maps.DirectionsRenderer({
                  map: map,
                  suppressMarkers: true, // Set to true to hide default Google markers
                  preserveViewport: true, // prevent auto zoom to result
                });
              directionsRenderer.setDirections(response);
              // Fit the map to the bounds
              map.fitBounds(bounds);
            } else {
              setStatus(status);
              setShowError(true);
              setError(true);
            }
          });
        }
        if (error) {
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, createMarker, map, markers]);

  const initGoogleMap = useCallback(() => {
    return new window.google.maps.Map(googleMapRef.current, {
      center: new window.google.maps.LatLng(
        markers[0]?.chargerInfo?.AddressInfo?.Latitude,
        markers[0]?.chargerInfo?.AddressInfo?.Longitude
      ),
      zoom: 8,
    });
  }, [markers]);

  useEffect(() => {
    const googleMap = initGoogleMap();
    setMap(googleMap);
  }, [initGoogleMap, markers]);

  return (
    <div
      ref={googleMapRef}
      className={"w-full lg:h-full max-h-[50rem] min-h-[30rem] sm:h-96"}
    />
  );
};

export default MapRouteElectrical;
