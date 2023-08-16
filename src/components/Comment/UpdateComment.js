import React, { useEffect } from "react";
import { useFormik } from "formik";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  updateCommentAction,
  fetchCommentDetailsAction,
} from "../../redux/slices/comments/commentSlices";

const formSchema = Yup.object({
  description: Yup.string()
    .required("Description is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >")
    .min(10, "Comment must be at least 10 characters long"),
});

const UpdateComment = (props) => {
  const id = props.match.params.id;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCommentDetailsAction(id));
  }, [dispatch, id]);

  const comment = useSelector((state) => state.comment);
  const {
    commentDetails,
    isUpdated,
    appErrComment,
    serverErrComment,
    loading,
  } = comment;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: commentDetails?.description,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const data = {
        id,
        description: values.description,
      };
      dispatch(updateCommentAction(data));
    },
  });

  if (isUpdated) {
    return <Redirect to={`/posts/${commentDetails?.post}`} />;
  }
  return (
    <>
      <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 px-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Update Comment
          </h2>
          {serverErrComment || appErrComment ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">
                {serverErrComment}! {appErrComment}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-medium text-gray-900 text-black"
                >
                  Enter Description
                </label>
                {/* title */}
                <input
                  onBlur={formik.handleBlur("description")}
                  onChange={formik.handleChange("description")}
                  value={formik.values.description || ""}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="text"
                />
              </div>
              {/* Err message */}
              <div className="text-red-400 text-sm mb-3">
                {formik.touched.description && formik.errors.description}
              </div>
              {loading ? (
                <button
                  disabled
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Loading please wait...
                </button>
              ) : (
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update comment
                  </button>
                </div>
              )}
            </form>
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center py-2 px-4 my-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateComment;
