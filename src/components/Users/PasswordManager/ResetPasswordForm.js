import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { passwordResetTokenAction } from "../../../redux/slices/users/userSlices";

const formSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
});

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      dispatch(passwordResetTokenAction(values?.email));
    },
    validationSchema: formSchema,
  });

  const user = useSelector((state) => state.users);
  const { loading, appError, serverError, resetPasswordToken } = user;

  return (
    <>
      <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 px-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Password Reset Form
          </h2>
          <p className="mt-2 text-center text-sm text-indigo-600 font-medium">
            Reset your password if you have forgotten your current password.
          </p>
          {serverError || appError ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">
                {serverError}! {appError}
              </span>
            </div>
          ) : null}
          {resetPasswordToken && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3 mb-2"
              role="alert"
            >
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">
                Reset password token is successfully sent to your email. Verify
                it within 10 minutes.
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter your email address
                </label>
                <div className="flex items-center pl-6 mb-1 border border-gray-300 bg-white rounded-2xl">
                  <span className="inline-block pr-3 border-r border-gray-300">
                    <svg
                      className="w-5 h-5"
                      width="17"
                      height="21"
                      viewBox="0 0 17 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.184 8.48899H15.2011V6.25596C15.2011 2.6897 12.3193 0 8.49924 0C4.67919 0 1.7974 2.6897 1.7974 6.25596V8.48899H1.81568C0.958023 9.76774 0.457031 11.3049 0.457031 12.9569C0.457031 17.3921 4.06482 21 8.49924 21C12.9341 21 16.5424 17.3922 16.5428 12.9569C16.5428 11.3049 16.0417 9.76774 15.184 8.48899ZM2.69098 6.25596C2.69098 3.14895 5.13312 0.893578 8.49924 0.893578C11.8654 0.893578 14.3075 3.14895 14.3075 6.25596V7.39905C12.8423 5.86897 10.7804 4.91468 8.49966 4.91468C6.21837 4.91468 4.15607 5.86946 2.69098 7.40017V6.25596ZM8.49966 20.1064C4.55762 20.1064 1.35061 16.8989 1.35061 12.9569C1.35061 9.01534 4.5572 5.80826 8.49924 5.80826C12.4422 5.80826 15.6488 9.01534 15.6492 12.9569C15.6492 16.8989 12.4426 20.1064 8.49966 20.1064Z"
                        fill="black"
                      ></path>
                      <path
                        d="M8.49957 8.93567C7.26775 8.93567 6.26562 9.93779 6.26562 11.1696C6.26562 11.8679 6.60247 12.5283 7.1592 12.9474V14.7439C7.1592 15.4829 7.76062 16.0843 8.49957 16.0843C9.2381 16.0843 9.83994 15.4829 9.83994 14.7439V12.9474C10.3966 12.5278 10.7335 11.8679 10.7335 11.1696C10.7335 9.93779 9.7309 8.93567 8.49957 8.93567ZM9.16793 12.3228C9.03032 12.4023 8.94636 12.5502 8.94636 12.7088V14.7439C8.94636 14.9906 8.74572 15.1907 8.49957 15.1907C8.25342 15.1907 8.05278 14.9906 8.05278 14.7439V12.7088C8.05278 12.5502 7.96833 12.4032 7.83072 12.3228C7.41026 12.078 7.1592 11.6468 7.1592 11.1696C7.1592 10.4307 7.76062 9.82925 8.49957 9.82925C9.2381 9.82925 9.83994 10.4307 9.83994 11.1696C9.83994 11.6468 9.58881 12.078 9.16793 12.3228Z"
                        fill="black"
                      ></path>
                    </svg>
                  </span>
                  {/* title */}
                  <input
                    value={formik.values.email || ""}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    className="w-full pr-6 pl-4 py-4 text-gray-500 font-bold placeholder-gray-500 rounded-r-full bg-white focus:outline-none placeholder-opacity-50 focus:placeholder-opacity-70 focus:ring-0 focus:border-gray-700"
                    type="text"
                    autoComplete="text"
                    placeholder="example@gmail.com"
                  />
                </div>
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.email && formik.errors.email}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to={"/update-password"}
                    className="font-medium text-indigo-600 hover:text-indigo-400"
                  >
                    Or update your password here !
                  </Link>
                </div>
              </div>
              {/* Login btn */}
              {loading ? (
                <button
                  disabled
                  className="py-4 w-full bg-gray-700 text-white font-bold rounded-full transition duration-200"
                >
                  Loading please wait...
                </button>
              ) : (
                <div>
                  <button
                    type="submit"
                    className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                  >
                    Reset Password
                  </button>
                </div>
              )}
            </form>
            {!loading && (
              <button
                onClick={() => window.history.back()}
                className="py-4 my-2 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-full transition duration-200"
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

export default ResetPasswordForm;
