import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { StarIcon } from "@heroicons/react/solid";
import { XCircleIcon } from "@heroicons/react/outline";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useOpenChargeMap } from "../../hooks/useOpenChargeMap";
import ImgSelected from "../../img/charger/selected.svg";
import ImgNotSelected from "../../img/charger/not-selected.svg";
import Modal from "react-modal";
import Alert from "@mui/material/Alert";
import { updateChargerAction } from "../../redux/slices/evCharger/chargerSlices";

//Form schema
const formSchema = Yup.object({
  description: Yup.string()
    .required("Description is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >")
    .min(50, "Description must be long at least 50 characters.")
    .max(500, "Description must be short at most 500 characters."),
  rating: Yup.number().required("Rating is required"),
  chargerInfo: Yup.object().required("You must select charger"),
  batteryLevel: Yup.number()
    .required("Usable battery level is required")
    .min(0, "Usable battery level must be between 0 and 140")
    .max(140, "Usable battery level must be between 0 and 140"),
  avgConsumption: Yup.number()
    .required("Average consumption is required")
    .min(1, "Average consumption must be at least 1 kWh/100km")
    .max(50, "Average consumption cannot be more than 50 kWh/100km"),
});

const UpdateCharger = ({
  setUpdateModalIsOpen,
  updateModalIsOpen,
  chargerToUpdate,
}) => {
  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
  };

  const dispatch = useDispatch();
  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: chargerToUpdate?.description,
      rating: chargerToUpdate?.rating,
      chargerInfo: chargerToUpdate?.chargerInfo,
      batteryLevel: chargerToUpdate?.batteryLevel,
      avgConsumption: chargerToUpdate?.avgConsumption,
    },
    onSubmit: (values) => {
      const charger = {
        ...values,
        id: chargerToUpdate?._id,
      };
      dispatch(updateChargerAction(charger));
      closeUpdateModal();
    },
    validationSchema: formSchema,
  });

  const [buttonText, setButtonText] = useState("Update charger");

  const handleHover = () => {
    setButtonText("If you confirm, the charger will be updated");
  };

  const handleMouseLeave = () => {
    setButtonText("Update charger");
  };

  const mapRef = useRef();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [displayMarkers, setDisplayMarkers] = useState(false);
  const autoCompleteRef = useRef(null);
  const infoWindow = useRef(null);
  const ref = useRef(null);
  const [rating, setRating] = useState(chargerToUpdate?.rating);

  const handleRatingChange = (newRating) => {
    formik.values.rating = newRating;
    setRating(newRating);
  };

  const [center, setCenter] = useState({
    lat: chargerToUpdate?.chargerInfo?.AddressInfo?.Latitude,
    lng: chargerToUpdate?.chargerInfo?.AddressInfo?.Longitude,
  });
  const [searchLocation, setSearchLocation] = useState({
    lat: chargerToUpdate?.chargerInfo?.AddressInfo?.Latitude,
    lng: chargerToUpdate?.chargerInfo?.AddressInfo?.Longitude,
    distance: 30,
  });

  const chargers = useOpenChargeMap(searchLocation);
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            distance: 30,
          });
          mapRef.current.panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const __selectLocation = useCallback(
    (charger, searchLocation = null) => {
      if (searchLocation) {
        setSearchLocation({ ...searchLocation, distance: 30 });
      } else {
        const selectedLocationCharger = {
          lat: charger.AddressInfo.Latitude,
          lng: charger.AddressInfo.Longitude,
        };
        formik.setFieldValue("chargerInfo", charger);
        setSelectedLocation(selectedLocationCharger);
        let maxPower = 0;
        for (const connection of charger?.Connections) {
          if (connection?.PowerKW > maxPower) {
            maxPower = connection?.PowerKW;
          }
        }
        const newInfoWindow = new window.google.maps.InfoWindow({
          content: `
        <div style="max-width: 200px;">
          <h2 style="margin-bottom: 5px;"><span style="font-weight: bold">Charger Provider: </span>${
            charger?.OperatorInfo?.Title ?? charger?.AddressInfo?.Title
          }</h2>
          <p><span style="font-weight: 500">Number of connections: </span>${
            charger?.Connections?.length ?? "0"
          } </p>
          <p><span style="font-weight: 500">Connections types: </span>${
            charger?.Connections?.map(
              (connection) => connection?.ConnectionType?.FormalName ?? ""
            ).join(", ") ?? ""
          } </p>
          <p><span style="font-weight: 500">Max connection power: </span>${maxPower}kW </p>
          <p><span style="font-weight: 500">Address: </span>${
            charger?.AddressInfo?.AddressLine1 ?? ""
          }, ${charger?.AddressInfo?.Postcode ?? ""} ${
            charger?.AddressInfo?.Town ?? ""
          }
            <p><span style="font-weight: 500">Country: </span>${
              charger?.AddressInfo?.Country?.ContinentCode ?? ""
            }, ${charger?.AddressInfo?.Country?.Title ?? ""} </p>
        </div>`,
          position: {
            lat: charger.AddressInfo.Latitude,
            lng: charger.AddressInfo.Longitude,
          },
          pixelOffset: new window.google.maps.Size(0, -30),
        });

        infoWindow?.current?.close();
        newInfoWindow.open(mapRef.current);
        infoWindow.current = newInfoWindow;
      }
      setCenter(
        searchLocation
          ? {
              lat: searchLocation.lat,
              lng: searchLocation.lng,
            }
          : {
              lat: charger.AddressInfo.Latitude,
              lng: charger.AddressInfo.Longitude,
            }
      );
    },
    [formik, setSelectedLocation, setSearchLocation, setCenter]
  );

  const markers = useMemo(() => {
    return displayMarkers
      ? chargers?.map((charger) => ({
          position: {
            lat: charger.AddressInfo.Latitude,
            lng: charger.AddressInfo.Longitude,
          },
          onClick: () => __selectLocation(charger),
        }))
      : window.google
      ? chargers?.map((charger) => ({
          position: {
            lat: charger.AddressInfo.Latitude,
            lng: charger.AddressInfo.Longitude,
          },
          onClick: () => __selectLocation(charger),
        }))
      : [];
  }, [__selectLocation, chargers, displayMarkers]);

  useEffect(() => {
    const selectedLocationCharger = {
      lat: chargerToUpdate?.chargerInfo?.AddressInfo?.Latitude,
      lng: chargerToUpdate?.chargerInfo?.AddressInfo?.Longitude,
    };
    setSelectedLocation(selectedLocationCharger);
  }, [chargerToUpdate]);

  const handleMapDragEnd = () => {
    const newCenter = mapRef?.current?.getCenter();

    const newLatitude = newCenter?.lat();
    const newLongitude = newCenter?.lng();

    const distance = getDistance(
      { latitude: searchLocation?.lat, longitude: searchLocation?.lng },
      { latitude: newLatitude, longitude: newLongitude }
    );

    if (distance > 20) {
      setSearchLocation({
        lat: newLatitude,
        lng: newLongitude,
        distance: 100,
      });
    }
  };

  const getDistance = (p1, p2) => {
    const R = 6371e3; // Earth’s mean radius in meters
    const rad = (value) => {
      return value * (Math.PI / 180);
    };
    const dLat = rad(p2?.latitude - p1?.latitude);
    const dLong = rad(p2?.longitude - p1?.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1?.latitude)) *
        Math.cos(rad(p2?.latitude)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // returns the distance in kilometers
    return (R * c) / 1000;
  };

  const charger = useSelector((state) => state?.charger);
  const { loading } = charger;

  return (
    <Modal
      ariaHideApp={false}
      isOpen={updateModalIsOpen}
      onRequestClose={closeUpdateModal}
      className="modal"
      contentLabel="Add Place"
    >
      <div className="relative">
        <button className="absolute top-6 right-6 p-2 text-red-800 hover:text-sky-950">
          <XCircleIcon className="h-12 w-12" onClick={closeUpdateModal} />
        </button>
      </div>
      <div className="min-h-screen bg-sky-950 bg-opacity-80 flex flex-col px-4 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl h-[90vh] overflow-y-auto">
          <div className="bg-white py-6 px-4 shadow sm:px-10 ">
            <div className={"mb-2"}>
              <h2 className="text-center text-3xl font-extrabold text-sky-950">
                Update your charger
              </h2>

              <div className="mt-2 text-center text-sm text-gray-600">
                <p className="font-medium text-green-600">
                  Write about your charger
                </p>
              </div>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className={"bg-sky-300 p-3 rounded"}>
                <label
                  htmlFor="charger"
                  className="block text-sm font-medium text-gray-700"
                >
                  Choose charger
                </label>
                <div className={`flex items-center justify-between mb-3`}>
                  <fieldset className="w-full flex-1 text-gray-100">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <button
                          type="button"
                          title="search"
                          className="p-1 focus:outline-none focus:ring"
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 512 512"
                            className="w-4 h-4 text-gray-500"
                          >
                            <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                          </svg>
                        </button>
                      </span>
                      <input
                        ref={ref}
                        type="text"
                        name="Search"
                        id="search"
                        placeholder="Search location to show chargers in this searched town..."
                        className="py-2 pl-10 w-full text-gray-800 bg-white focus:outline-none focus:shadow-outline focus:border-gray-500 focus:placeholder:text-gray-300 border border-gray-400 rounded px-4 block appearance-none leading-normal"
                      />
                    </div>
                  </fieldset>
                  <button
                    type="button"
                    className="bg-transparent border-none outline-none cursor-pointer p-1"
                    onClick={getLocation}
                  >
                    <img
                      draggable={false}
                      src={require("../../img/charger/current-location-icon.png")}
                      alt="Get Location"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
                <GoogleMap
                  onLoad={(map) => {
                    mapRef.current = map;
                    setDisplayMarkers(true);
                    autoCompleteRef.current =
                      new window.google.maps.places.Autocomplete(ref.current, {
                        types: ["geocode"],
                      });
                    autoCompleteRef.current.addListener("place_changed", () => {
                      const place = autoCompleteRef.current.getPlace();
                      __selectLocation(null, {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      });
                    });
                  }}
                  onDragEnd={handleMapDragEnd}
                  center={center}
                  zoom={12}
                  mapContainerClassName="w-full h-96"
                >
                  {markers?.map((props, index) => (
                    <Marker
                      key={`${props.position.lat}-${props.position.lng}-${index}`}
                      {...props}
                      icon={{
                        url:
                          selectedLocation?.lat === props.position.lat &&
                          selectedLocation?.lng === props.position.lng
                            ? ImgSelected
                            : ImgNotSelected,
                        scaledSize: new window.google.maps.Size(30, 30),
                      }}
                    />
                  ))}
                </GoogleMap>
                <Alert severity="info" className={"mt-2"}>
                  If your charger is not on the map select the closest one.
                </Alert>

                <div className="text-red-400 text-sm">
                  {formik?.errors?.chargerInfo}
                </div>
              </div>
              <div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">Rate this charger:</span>
                  {[1, 2, 3, 4, 5]?.map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-6 w-6 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="batteryLevel"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Please input the remaining usable battery capacity in kWh at
                  this charging station.
                </label>

                {/* usableBatterySize */}
                <input
                  id="batteryLevel"
                  name="batteryLevel"
                  type="number"
                  autoComplete="batteryLevel"
                  onBlur={formik.handleBlur("batteryLevel")}
                  value={formik.values.batteryLevel || ""}
                  onChange={formik.handleChange("batteryLevel")}
                  placeholder="Example: 11.2"
                  min={0}
                  max={140}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.batteryLevel && formik.errors.batteryLevel}
                </div>
              </div>
              <div>
                <label
                  htmlFor="avgConsumption"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Insert average consumption in kWh/100km
                </label>
                {/* avgConsumption */}
                <input
                  id="avgConsumption"
                  name="avgConsumption"
                  type="number"
                  autoComplete="avgConsumption"
                  onBlur={formik.handleBlur("avgConsumption")}
                  value={formik.values.avgConsumption || ""}
                  onChange={formik.handleChange("avgConsumption")}
                  placeholder="Example: 18.2"
                  min={1}
                  max={50}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.avgConsumption &&
                    formik.errors.avgConsumption}
                </div>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Write about your experience
                </label>
                {/* Description */}
                <textarea
                  value={formik.values.description}
                  onChange={formik.handleChange("description")}
                  onBlur={formik.handleBlur("description")}
                  rows="5"
                  cols="10"
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  maxLength={500}
                ></textarea>
                {/* Err msg */}
                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">
                    {formik.values.description.length}/500
                  </span>
                </div>
                <div className="text-red-400 text-sm">
                  {formik?.touched?.description && formik?.errors?.description}
                </div>
              </div>

              <div>
                {/* Submit button */}
                {loading ? (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Updating, please wait...
                  </button>
                ) : (
                  <button
                    type="submit"
                    onMouseEnter={handleHover}
                    onMouseLeave={handleMouseLeave}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {buttonText}
                  </button>
                )}
              </div>
            </form>
            {!loading && (
              <button
                onClick={closeUpdateModal}
                className="w-full flex justify-center py-2 px-4 my-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateCharger;
