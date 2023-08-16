import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { createCommentAction } from "../../redux/slices/comments/commentSlices";

const formSchema = Yup.object({
  description: Yup.string()
    .required("Comment is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >")
    .min(10, "Comment must be at least 10 characters long")
    .max(300, "Comment must be at most 300 characters long"),
});

const AddComment = (props) => {
  const { postId } = props;
  const dispatch = useDispatch();

  const comment = useSelector((state) => state?.comment);
  const { loading, appErrComment, serverErrComment } = comment;

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const data = {
        postId,
        description: values.description,
      };
      dispatch(createCommentAction(data));
    },
  });

  return (
    <>
      {/* Form start here */}
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="py-2 px-4 mb-1 rounded-lg rounded-t-lg border bg-gray-800 border-gray-700">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            onChange={formik.handleChange("description")}
            onBlur={formik.handleBlur("description")}
            value={formik.values.description}
            id="comment"
            rows="6"
            className="px-0 w-full text-sm border-0 focus:ring-0 focus:outline-none text-white placeholder-gray-400 bg-gray-800"
            placeholder="Write a comment..."
            maxLength={300}
          ></textarea>
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">
              {formik.values.description.length}/300
            </span>
          </div>
        </div>
        <div className="text-red-400 mb-4">{formik.errors.description}</div>

        {/* submit btn */}
        {loading ? (
          <button
            disabled
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-gray-700 rounded-lg"
          >
            Loading please wait...
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800"
          >
            Post comment
          </button>
        )}
      </form>

      {appErrComment || serverErrComment ? (
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
    </>
  );
};

export default AddComment;
