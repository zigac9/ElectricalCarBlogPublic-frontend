import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  fetchCategoryDetailsAction,
  updateCategory,
} from "../../redux/slices/category/categorySlices";

const formSchema = Yup.object({
  title: Yup.string()
    .required("Category title is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Cannot contain special characters")
    .min(5, "Title must be at least 5 characters long")
    .max(40, "Title cannot be more than 40 characters"),
});

const UpdateCategory = (props) => {
  const dispatch = useDispatch();

  //get the id from the url
  const id = props.match.params.id;

  useEffect(() => {
    dispatch(fetchCategoryDetailsAction(id));
  }, [dispatch, id]);

  const state = useSelector((state) => state.category);
  const {
    loading,
    appErrCategory,
    serverErrCategory,
    categoryDetails,
    isUpdated,
    isDeleted,
  } = state;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryDetails?.title,
    },
    onSubmit: (values) => {
      values = {
        title: values?.title,
        id: id,
      };
      dispatch(updateCategory(values));
    },
    validationSchema: formSchema,
  });

  if (isUpdated || isDeleted) {
    return <Redirect to="/category-list" />;
  }
  return (
    <>
      <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 px-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Update Category
          </h2>
          {serverErrCategory || appErrCategory ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">
                {serverErrCategory}! {appErrCategory}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter title
                </label>
                <div className="mt-1">
                  <input
                    value={formik.values.title || ""}
                    onChange={formik.handleChange("title")}
                    onBlur={formik.handleBlur("title")}
                    id="title"
                    name="title"
                    autoComplete="title"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {/* err msg */}
                <div className="text-red-400 text-sm">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>
              {/* Login btn */}
              {loading ? (
                <button
                  disabled
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600"
                >
                  Updating category title, please wait...
                </button>
              ) : (
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Category
                  </button>
                </div>
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

export default UpdateCategory;
