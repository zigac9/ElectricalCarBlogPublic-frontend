import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSendAction,
  sendEMailAction,
} from "../../../redux/slices/email/emailSlices";
import { Redirect } from "react-router-dom";

//Form schema
const formSchema = Yup.object({
  recipientEmail: Yup.string()
    .email("Invalid email format")
    .required("Recipient Email is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >"),
  subject: Yup.string()
    .required("Subject is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Cannot contain special characters")
    .min(5, "Subject cannot be less than 5 characters")
    .max(30, "Subject cannot be more than 30 characters"),
  message: Yup.string()
    .required("Message is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >")
    .min(10, "Message cannot be less than 10 characters")
    .max(500, "Message cannot be more than 500 characters"),
});

const SendEmailToUser = (props) => {
  const dispatch = useDispatch();

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      recipientEmail: props?.location?.state?.email || "",
      subject: "",
      message: "",
    },
    onSubmit: (values) => {
      dispatch(sendEMailAction(values));
      formik.resetForm();
    },
    validationSchema: formSchema,
  });

  const mail = useSelector((state) => state.mail);
  const { isSend, loading, appErrMail, serverErrMail } = mail;
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (isSend) {
      setTimeout(() => {
        dispatch(resetSendAction());
        setRedirect(true);
      }, 3000);
    }
  }, [isSend, dispatch]);

  if (redirect) {
    return <Redirect to="/authors" />;
  }
  return (
    <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 px-4 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
          Send Message to {/* Email title */}
          <span className="text-green-300">
            {props?.location?.state?.firstName}{" "}
            {props?.location?.state?.lastName}
          </span>
        </h2>

        {/* Display err here */}
        {appErrMail || serverErrMail ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">
              {serverErrMail}! {appErrMail}
            </span>
          </div>
        ) : null}
        {isSend ? (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3"
            role="alert"
          >
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">
              Your message has been sent! You will be redirected in 3 seconds.
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
                Recipient Email
              </label>
              {/* Email message */}
              <div className="mt-1">
                <input
                  value={formik.values.recipientEmail}
                  onChange={formik.handleChange("recipientEmail")}
                  onBlur={formik.handleBlur("recipientEmail")}
                  disabled
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Err msg */}
              <div className="text-red-400 text-sm">
                {formik.touched.email && formik.errors.email}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <div className="mt-1">
                {/* Subject */}
                <input
                  value={formik.values.subject}
                  onChange={formik.handleChange("subject")}
                  onBlur={formik.handleBlur("subject")}
                  id="subject"
                  name="subject"
                  type="text"
                  autoComplete="subject"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* err msg */}
              <div className="text-red-400 text-sm">
                {formik.touched.subject && formik.errors.subject}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              {/* email message */}
              <textarea
                value={formik.values.message}
                onChange={formik.handleChange("message")}
                onBlur={formik.handleBlur("message")}
                rows="5"
                cols="10"
                className="rounded-lg appearance-none block w-full py-3 px-3 text-base leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                type="text"
                maxLength={500}
              ></textarea>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">
                  {formik.values.message.length}/500
                </span>
              </div>
              {/* err here */}
              <div className="text-red-400 text-sm">
                {formik.touched.message && formik.errors.message}
              </div>
            </div>
            {/* Submit btn */}
            <div>
              {loading ? (
                <button
                  disabled
                  className="w-full p-3 text-sm font-bold tracki uppercase rounded bg-violet-400 text-gray-900"
                >
                  Sending please wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full p-3 text-sm font-bold tracking rounded bg-blue-700 text-white focus:outline-none focus:ring focus:border-blue-900 hover:bg-blue-800 "
                >
                  Send message
                </button>
              )}
            </div>
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
  );
};

export default SendEmailToUser;
