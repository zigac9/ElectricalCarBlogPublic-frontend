import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  resetSendAdminAction,
  sendEMailToAdminZigaAction,
} from "../../redux/slices/email/emailSlices";

const formSchema = Yup.object({
  category: Yup.string()
    .required("Category is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Cannot contain special characters"),
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
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >"),
});

const ContactUs = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: "",
      subject: "",
      message: "",
      email: "",
    },
    onSubmit: (values) => {
      dispatch(sendEMailToAdminZigaAction(values));
      formik.resetForm();
    },
    validationSchema: formSchema,
  });

  const mail = useSelector((state) => state.mail);
  const { loading, appErrMail, serverErrMail, isSendToAdmin } = mail;

  useEffect(() => {
    if (isSendToAdmin) {
      setTimeout(() => {
        dispatch(resetSendAdminAction());
      }, 5000);
    }
  }, [isSendToAdmin, dispatch]);

  return (
    <div className={"bg-sky-950"}>
      <article className="max-w-7xl px-6 py-12 mx-auto space-y-12 bg-sky-950 text-gray-50">
        <div className="w-full mx-auto space-y-4 text-center">
          <h1 className="text-4xl font-bold leadi md:text-5xl">Contact us</h1>
          <p className="text-sm text-gray-400">Feel free to contact us</p>
        </div>

        <div className="pt-12 border-t border-gray-200">
          <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-800 text-gray-100">
            <div className="flex flex-col justify-between">
              <img
                draggable={false}
                src={
                  "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                }
                alt=""
                className="h-85 md:h-85"
              />
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="text-sm">
                  Recipient
                </label>
                <input
                  value={"Electrical car blog"}
                  disabled
                  id="name"
                  type="text"
                  placeholder=""
                  className="w-full p-3 bg-gray-600 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  id="email"
                  type="email"
                  className="w-full p-3 bg-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {/* err msg */}
                <div className="text-red-400 text-sm">
                  {formik.touched.email && formik.errors.email}
                </div>
              </div>
              <div>
                <label htmlFor="dropdown" className="text-sm">
                  Category
                </label>
                <Select
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      padding: "4px",
                      backgroundColor: "gray.100",
                    }),
                    option: (baseStyles) => ({
                      ...baseStyles,
                      color: "black",
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "white",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "white",
                    }),
                  }}
                  options={[
                    { value: "question", label: "Question" },
                    { value: "feedback", label: "Feedback" },
                    { value: "blocked", label: "Blocked" },
                    { value: "other", label: "Other" },
                  ]}
                  onChange={(e) => {
                    formik.setFieldValue("category", e.value);
                  }}
                />
                {/* err msg */}
                <div className="text-red-400 text-sm">
                  {formik.touched.category && formik.errors.category}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="text-sm">
                  Subject
                </label>
                <input
                  value={formik.values.subject}
                  onChange={formik.handleChange("subject")}
                  onBlur={formik.handleBlur("subject")}
                  id="name"
                  type="text"
                  placeholder=""
                  className="w-full p-3 bg-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {/* err msg */}
                <div className="text-red-400 text-sm">
                  {formik.touched.subject && formik.errors.subject}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="text-sm">
                  Message
                </label>
                <textarea
                  value={formik.values.message}
                  onChange={formik.handleChange("message")}
                  onBlur={formik.handleBlur("message")}
                  rows="5"
                  cols="10"
                  className="w-full p-3 bg-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  maxLength={500}
                ></textarea>
                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">
                    {formik.values.message.length}/500
                  </span>
                </div>
                <div className="text-red-400 text-sm">
                  {formik.touched.message && formik.errors.message}
                </div>
              </div>
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
                  className="w-full p-3 text-sm font-bold tracking uppercase rounded bg-blue-700 text-white focus:outline-none focus:ring focus:border-blue-900 hover:bg-blue-800 "
                >
                  Send Message
                </button>
              )}
              {appErrMail || serverErrMail ? (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">
                    {serverErrMail}! {appErrMail}
                  </span>
                </div>
              ) : null}
              {isSendToAdmin ? (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Success! </strong>
                  <span className="block sm:inline">
                    Your message has been sent!
                  </span>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ContactUs;
