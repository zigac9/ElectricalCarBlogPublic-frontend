import { UploadIcon } from "@heroicons/react/outline";
import ImageDropDown from "../../ImageDropDown/ImageDropDown";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import PreviewImage from "../../ImageDropDown/PreviewImage";
import { uploadProfileImageAction } from "../../../redux/slices/users/userSlices";

//Form schema
const formSchema = Yup.object({
  image: Yup.string().required("Image is required"),
});

const UploadProfilePhoto = () => {
  const dispatch = useDispatch();

  //formik
  const formik = useFormik({
    initialValues: {
      image: "",
    },
    onSubmit: (values) => {
      dispatch(uploadProfileImageAction(values));
    },
    validationSchema: formSchema,
  });

  const users = useSelector((state) => state.users);
  const {
    loading,
    appError,
    serverError,
    userProfile,
    profilePictureUploaded,
  } = users;

  if (profilePictureUploaded) {
    return <Redirect to={`/profile/${userProfile._id}`} />;
  }
  return (
    <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Upload profile photo
        </h2>
        {/* Displya err here */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Image container here thus Dropzone */}
            {appError || serverError ? (
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
            {formik?.values?.image?.name ? undefined : (
              <>
                <ImageDropDown formik={formik} maxSize={"5"} />
                {/*<div className="text-red-400 text-sm">*/}
                {/*  {formik.touched.image && formik.errors.image}*/}
                {/*</div>*/}
              </>
            )}

            {/* Preview image */}
            <PreviewImage formik={formik} />

            <div>
              {loading ? (
                <button
                  disabled
                  className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-500 bg-white"
                >
                  <UploadIcon
                    className="-ml-1 mr-2 h-5  text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Loading please wait...</span>
                </button>
              ) : (
                <>
                  {formik?.values?.image?.name !== undefined && (
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      <UploadIcon
                        className="-ml-1 mr-2 h-5  text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Upload Profile Photo</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePhoto;
