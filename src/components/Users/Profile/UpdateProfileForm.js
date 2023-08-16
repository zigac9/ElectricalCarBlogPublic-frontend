import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfileAction,
  fetchUserDetailsAction,
} from "../../../redux/slices/users/userSlices";
import { Redirect } from "react-router-dom";

//Form schema
const formSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Cannot contain special characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Cannot contain special characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const UpdateProfileForm = (props) => {
  const id = props.match.params.id;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserDetailsAction(id));
  }, [dispatch, id]);

  const user = useSelector((state) => state.users);
  const { loading, appError, serverError, userDetails, isUpdated } = user;

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      email: userDetails?.email || "",
    },
    onSubmit: (values) => {
      dispatch(updateUserProfileAction(values));
    },
    validationSchema: formSchema,
  });

  if (isUpdated) {
    return <Redirect to={`/profile/${id}`} />;
  }
  return (
    <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 px-4 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h3 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Hey{" "}
          <span className={"text-green-600"}>
            {userDetails?.firstName} {userDetails?.lastName}
          </span>
          . Do you want to update your profile?
        </h3>
        {serverError || appError ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">
              {serverError}! {appError}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <div className="mt-1">
                {/* First name */}
                <input
                  value={formik.values.firstName}
                  onChange={formik.handleChange("firstName")}
                  onBlur={formik.handleBlur("firstName")}
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="firstName"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="text-red-400 text-sm">
                {formik.touched.firstName && formik.errors.firstName}
              </div>
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <div className="mt-1">
                {/* Last Name */}
                <input
                  value={formik.values.lastName}
                  onChange={formik.handleChange("lastName")}
                  onBlur={formik.handleBlur("lastName")}
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="lastName"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Err msg */}
              <div className="text-red-400 text-sm">
                {formik.touched.lastName && formik.errors.lastName}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                {/* Email */}
                <input
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* err msg */}
              <div className="text-red-400 text-sm">
                {formik.touched.email && formik.errors.email}
              </div>
            </div>
            <div>
              {/* submit btn */}
              {loading ? (
                <button
                  disabled
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600"
                >
                  Loading please wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              )}
            </div>
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
  );
};

export default UpdateProfileForm;
