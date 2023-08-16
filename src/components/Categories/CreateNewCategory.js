import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  createCategoryAction,
  resetCreateCategoryAction,
} from "../../redux/slices/category/categorySlices";

const formSchema = Yup.object({
  title: Yup.string()
    .required("Category title is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Cannot contain special characters")
    .min(5, "Category title must be at least 5 characters long")
    .max(40, "Category title cannot be more than 40 characters"),
});

const CreateNewCategory = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      dispatch(createCategoryAction(values));
      formik.resetForm();
    },
    validationSchema: formSchema,
  });

  const state = useSelector((state) => state.category);
  const { loading, appErrCategory, serverErrCategory, isCreated } = state;

  const [redirect, setRedirect] = useState(false);
  const handleButtonClick = () => {
    setRedirect(true);
  };

  useEffect(() => {
    if (isCreated) {
      setTimeout(() => {
        dispatch(resetCreateCategoryAction());
        setRedirect(true);
      }, 3000);
    }
  }, [isCreated, dispatch]);

  if (redirect) {
    return <Redirect to="/category-list" />;
  }

  return (
    <>
      <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 px-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Add new category
          </h2>
          {serverErrCategory || appErrCategory ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-3"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">
                {serverErrCategory}! {appErrCategory}
              </span>
            </div>
          ) : null}
          {isCreated ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3"
              role="alert"
            >
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">
                You successfully created new category! You will be redirected to
                category list in 3 seconds.
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-lg">
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
                    value={formik.values.title}
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
                  Creating new category, please wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create new category
                </button>
              )}
            </form>
            {!loading && (
              <button
                onClick={handleButtonClick}
                className="w-full flex justify-center py-2 px-4 my-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to category list
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewCategory;
