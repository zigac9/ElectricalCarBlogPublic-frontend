import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import CategoriesDropDown from "../Categories/CategoryDropDown/CategoriesDropDown";
import {
  fetchPostDetailsAction,
  updatePostAction,
} from "../../redux/slices/posts/postSlices";
import PreviewImage from "../ImageDropDown/PreviewImage";
import PreviewImageUpdate from "../ImageDropDown/PreviewImageUpdate";
import ImageDropDown from "../ImageDropDown/ImageDropDown";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@windmill/react-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Alert from "@mui/material/Alert";

const formSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Cannot contain special characters")
    .min(5, "Title must be at least 5 characters long")
    .max(40, "Title cannot be more than 40 characters"),
  description: Yup.string()
    .required("Description is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >")
    .min(100, "Description must be at least 100 characters long")
    .max(1000, "Description cannot be more than 1000 characters"),
  mainCategory: Yup.object().required("Main category is required"),
  startingLocation: Yup.object().required("Starting location is required"),
  endLocation: Yup.object().required("End location is required"),
  image: Yup.string().required("Image is required"),
  carName: Yup.string()
    .required("Car name is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >")
    .min(2, "Car name must be at least 2 characters long")
    .max(30, "Car name cannot be more than 30 characters"),
  usableBatterySize: Yup.number()
    .required("Usable battery is required")
    .min(15, "Usable battery must be at least 15 kWh")
    .max(140, "Usable battery cannot be more than 140 kWh"),
  efficiency: Yup.number()
    .required("Efficiency is required")
    .min(130, "Efficiency must be at least 130 Wh/km")
    .max(320, "Efficiency cannot be more than 320 Wh/km"),
  fastChargerPower: Yup.number()
    .required("Max charger power is required")
    .min(1, "Max charger power must be at least 1 kW")
    .max(500, "Max charger power cannot be more than 500 kW"),
});

const UpdatePost = (props) => {
  const [chargers, addCharger] = useState([]);
  const { id } = props.match.params;
  const startingInputRef = useRef(null);
  const endInputRef = useRef(null);

  const setChargers = (updatedChargers) => {
    addCharger(updatedChargers);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const updatedChargers = [...chargers];
      const temp = updatedChargers[index];
      updatedChargers[index] = updatedChargers[index - 1];
      updatedChargers[index - 1] = temp;
      setChargers(updatedChargers);
    }
  };

  const handleMoveDown = (index) => {
    if (index < chargers?.length - 1) {
      const updatedChargers = [...chargers];
      const temp = updatedChargers[index];
      updatedChargers[index] = updatedChargers[index + 1];
      updatedChargers[index + 1] = temp;
      setChargers(updatedChargers);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPostDetailsAction(id));
  }, [dispatch, id]);

  const post = useSelector((state) => state.post);
  const {
    fetchPostDetails: postDetails,
    loading,
    appErrPost,
    serverErrPost,
    isUpdated,
  } = post;

  useEffect(() => {
    addCharger(postDetails?.chargers);
  }, [postDetails?.chargers]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: postDetails?.title,
      description: postDetails?.description,
      mainCategory: {
        label: postDetails?.mainCategory,
        value: postDetails?.mainCategory,
      },
      image: postDetails?.image,
      chargers: postDetails?.chargers,
      startingLocation: postDetails?.startingLocation,
      endLocation: postDetails?.endLocation,
      carName: postDetails?.carName,
      usableBatterySize: postDetails?.usableBatterySize,
      efficiency: postDetails?.efficiency,
      public: postDetails?.isPublic,
      fastChargerPower: postDetails?.fastChargerPower,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const data = {
        title: values.title,
        description: values.description,
        mainCategory: values.mainCategory?.label,
        image: values?.image,
        chargers: chargers,
        startingLocation: values?.startingLocation,
        endLocation: values?.endLocation,
        previousStartingLocation: postDetails?.startingLocation,
        previousEndLocation: postDetails?.endLocation,
        carName: values?.carName,
        usableBatterySize: values?.usableBatterySize,
        efficiency: values?.efficiency,
        previousUsableBatterySize: postDetails?.usableBatterySize,
        previousEfficiency: postDetails?.efficiency,
        public: values?.public,
        fastChargerPower: values?.fastChargerPower,
        previousFastChargerPower: postDetails?.fastChargerPower,
        id,
      };
      dispatch(updatePostAction(data));
    },
  });

  const handleStartingPlaceSelect = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      startingInputRef.current
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      formik.setFieldValue("startingLocation", {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  };

  const handleEndPlaceSelect = () => {
    const autocompleteEnd = new window.google.maps.places.Autocomplete(
      endInputRef.current
    );
    autocompleteEnd.addListener("place_changed", () => {
      const place = autocompleteEnd.getPlace();
      formik.setFieldValue("endLocation", {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  };

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      formik.setFieldValue("public", true);
    } else {
      formik.setFieldValue("public", false);
    }
  };

  useEffect(() => {
    if (serverErrPost || appErrPost) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [serverErrPost, appErrPost]);

  if (isUpdated) {
    return <Redirect to={`/posts/${id}`} />;
  }
  return (
    <>
      <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 px-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Are you sure you want to edit{" "}
            <span className="text-green-300">{postDetails?.title}</span>
          </h2>
          <div className="mt-3 text-center text-md text-gray-600">
            <p className="font-medium text-green-600">
              Do you want that your post is public or private?
            </p>
          </div>
          <div className="text-center mt-1 text-gray-600">
            <label
              htmlFor="Toggle3"
              className="inline-flex items-center p-2 rounded-md cursor-pointer text-gray-800"
            >
              <input
                id="Toggle3"
                type="checkbox"
                className="hidden peer"
                defaultChecked={postDetails?.isPublic}
                onChange={handleChange}
              />
              <span className="px-4 py-2 rounded-l-md bg-violet-400 peer-checked:bg-gray-300">
                Private
              </span>
              <span className="px-4 py-2 rounded-r-md bg-gray-300 peer-checked:bg-violet-400">
                Public
              </span>
            </label>
          </div>
          {serverErrPost || appErrPost ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">
                {serverErrPost}! {appErrPost}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter post title
                </label>

                {/* title */}
                <input
                  id="title"
                  name="title"
                  type="title"
                  autoComplete="title"
                  onBlur={formik.handleBlur("title")}
                  value={formik.values.title || ""}
                  onChange={formik.handleChange("title")}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Err message */}
                <div className="text-red-400 mb-2 text-sm">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Choose Category
                </label>
                <CategoriesDropDown
                  isMulti={false}
                  value={formik.values.mainCategory?.label || ""}
                  onChange={formik.setFieldValue}
                  onBlur={formik.setFieldTouched}
                  error={formik.errors.mainCategory}
                  touched={formik.touched.mainCategory}
                  defaultValue={formik.values.mainCategory}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter description
                </label>
                {/* description */}
                <textarea
                  rows="5"
                  cols="10"
                  onBlur={formik.handleBlur("description")}
                  value={formik.values.description}
                  onChange={formik.handleChange("description")}
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-300 focus:border-gray-700  focus:outline-none"
                  maxLength={1000}
                ></textarea>
                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">
                    {formik.values.description?.length}/1000
                  </span>
                </div>
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.description && formik.errors.description}
                </div>
              </div>
              <div className="route-info">
                <hr className="border-t border-gray-700 my-1" />
                <h2 className="text-md font-bold text-gray-600">Route info</h2>
                <hr className="border-t border-gray-700 my-1" />
              </div>
              <div>
                <h1>Route information:</h1>
                <Alert severity="info" className="mt-1">
                  If you don't know info about your car, you can find it on{" "}
                  <a
                    href="https://ev-database.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={"text-blue-500 underline hover:text-blue-700"}
                  >
                    ev-database.org
                  </a>
                </Alert>
              </div>
              <div>
                <label
                  htmlFor="carName"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter your car name and model
                </label>

                {/* car name */}
                <input
                  id="carName"
                  name="carName"
                  type="carName"
                  autoComplete="carName"
                  onBlur={formik.handleBlur("carName")}
                  value={formik.values.carName || ""}
                  onChange={formik.handleChange("carName")}
                  placeholder="Example: Tesla Model 3"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.carName && formik.errors.carName}
                </div>
              </div>
              <div>
                <label
                  htmlFor="usableBatterySize"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter usable battery capacity in kWh
                </label>

                {/* usableBatterySize */}
                <input
                  id="usableBatterySize"
                  name="usableBatterySize"
                  type="number"
                  autoComplete="usableBatterySize"
                  onBlur={formik.handleBlur("usableBatterySize")}
                  value={formik.values.usableBatterySize || ""}
                  onChange={formik.handleChange("usableBatterySize")}
                  placeholder="Example: 57.5"
                  min={15}
                  max={140}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.usableBatterySize &&
                    formik.errors.usableBatterySize}
                </div>
              </div>
              <div>
                <label
                  htmlFor="fastChargerPower"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter max charger power in kW
                </label>

                {/* fastChargerPower */}
                <input
                  id="fastChargerPower"
                  name="fastChargerPower"
                  type="number"
                  autoComplete="fastChargerPower"
                  onBlur={formik.handleBlur("fastChargerPower")}
                  value={formik.values.fastChargerPower || ""}
                  onChange={formik.handleChange("fastChargerPower")}
                  placeholder="Example: 250"
                  min={1}
                  max={500}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.fastChargerPower &&
                    formik.errors.fastChargerPower}
                </div>
              </div>
              <div>
                <label
                  htmlFor="efficiency"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter efficiency in Wh/km
                </label>

                {/* efficiency */}
                <input
                  id="efficiency"
                  name="efficiency"
                  type="number"
                  autoComplete="efficiency"
                  onBlur={formik.handleBlur("efficiency")}
                  value={formik.values.efficiency || ""}
                  onChange={formik.handleChange("efficiency")}
                  placeholder={"Example: 142"}
                  min={130}
                  max={320}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.efficiency && formik.errors.efficiency}
                </div>
              </div>
              <div>
                <fieldset className="w-full space-y-1 text-gray-100">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select starting location
                  </label>
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
                      ref={startingInputRef}
                      type="search"
                      name="Search"
                      id="search"
                      onBlur={formik.handleBlur("startingLocation")}
                      onChange={handleStartingPlaceSelect}
                      placeholder="Search and select starting location..."
                      className="py-2 pl-10 w-full text-gray-600 bg-white focus:outline-none focus:shadow-outline focus:placeholder:text-gray-400 border border-gray-200 rounded px-4 block appearance-none leading-normal"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 border-l-8 sm:py-3 border-violet-400 bg-gray-200 text-gray-800">
                    <span>
                      Current selected location:{" "}
                      {formik?.values?.startingLocation?.address}
                    </span>
                  </div>
                </fieldset>
                <div className="text-red-400 text-sm">
                  {formik?.touched?.startingLocation &&
                    formik?.errors?.startingLocation}
                </div>
              </div>
              <div>
                <fieldset className="w-full space-y-1 text-gray-100">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select destination location
                  </label>
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
                      ref={endInputRef}
                      type="search"
                      name="Search"
                      id="search"
                      onBlur={formik.handleBlur("endLocation")}
                      onChange={handleEndPlaceSelect}
                      placeholder="Search and select destination location..."
                      className="py-2 pl-10 w-full text-gray-600 bg-white focus:outline-none focus:shadow-outline focus:placeholder:text-gray-400 border border-gray-200 rounded px-4 block appearance-none leading-normal"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 border-l-8 sm:py-3 border-violet-400 bg-gray-200 text-gray-800">
                    <span>
                      Current selected location:{" "}
                      {formik?.values?.endLocation?.address}
                    </span>
                  </div>
                </fieldset>
                <div className="text-red-400 text-sm">
                  {formik?.touched?.endLocation && formik?.errors?.endLocation}
                </div>
              </div>
              <div>
                <label
                  htmlFor="charger"
                  className="block text-sm font-medium text-gray-700"
                >
                  Describe your charging experience (You can only add up to 23
                  chargers!)
                </label>
                <div>
                  {chargers?.length > 0 ? (
                    <TableContainer className="mb-2 mt-2 overflow-scroll md:overflow-auto lg:overflow-auto">
                      <Table>
                        <thead className="text-xs font-semibold tracking-wide text-left uppercase border-b border-gray-700 text-gray-400 bg-gray-800">
                          <tr>
                            <TableCell>Order number</TableCell>
                            <TableCell>Charger Provider</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Order</TableCell>
                          </tr>
                        </thead>
                        <TableBody>
                          {chargers?.map((charger, i) => (
                            <TableRow key={i} className="border-b">
                              <TableCell>
                                <span className="text-sm">{i + 1}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  {charger?.title}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  {
                                    charger?.chargerInfo?.AddressInfo
                                      ?.AddressLine1
                                  }
                                  {", "}
                                  {
                                    charger?.chargerInfo?.AddressInfo.Postcode
                                  }{" "}
                                  {charger?.chargerInfo?.AddressInfo.Town}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  {
                                    charger?.chargerInfo?.AddressInfo?.Country
                                      .ContinentCode
                                  }
                                  {", "}
                                  {
                                    charger?.chargerInfo?.AddressInfo.Country
                                      .Title
                                  }
                                </span>
                              </TableCell>
                              <TableCell>
                                <ChevronUpIcon
                                  className={`h-8 w-8 ${
                                    i === 0 ? "hidden" : ""
                                  } hover:text-blue-500 cursor-pointer`}
                                  onClick={() => handleMoveUp(i)}
                                />
                                <ChevronDownIcon
                                  onClick={() => handleMoveDown(i)}
                                  className={`h-8 w-8 ${
                                    i === chargers?.length - 1 ? "hidden" : ""
                                  } hover:text-blue-500 cursor-pointer`}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No charger points selected
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-700"></div>
              <div>
                {formik?.values?.image === "" && (
                  <>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload cover image
                    </label>
                    <div className="mb-3">
                      {/* Image dropdown */}
                      <ImageDropDown formik={formik} maxSize={"30"} />

                      {/* Err msg */}
                      <div className="text-red-400 text-sm">
                        {formik?.errors?.image}
                      </div>
                    </div>
                  </>
                )}
                {formik?.values?.image?.name ? (
                  <PreviewImage formik={formik} />
                ) : (
                  <PreviewImageUpdate formik={formik} />
                )}
              </div>
              {/* Login btn */}
              {loading ? (
                <>
                  <Alert severity="info" className={"my-2"}>
                    We are in the process of creating your post and calculating
                    the recommended route. Please bear with us while we complete
                    these tasks. Thank you for your patience.
                  </Alert>
                  <button
                    disabled
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Loading, please wait...
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update post
                </button>
              )}
            </form>
            {!loading && (
              <button
                onClick={() => window.history.back()}
                className="w-full flex justify-center py-2 px-4 my-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePost;
