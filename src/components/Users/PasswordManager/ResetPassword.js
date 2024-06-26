import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { passwordResetAction } from "../../../redux/slices/users/userSlices";

const formSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/\W/, "Password requires a symbol")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .matches(/^[^<>]*$/, "Cannot contain characters < or >"),
});

const ResetPassword = (props) => {
  const token = props.match.params.token;

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      const data = {
        password: values?.password,
        confirmPassword: values?.confirmPassword,
        token,
      };
      dispatch(passwordResetAction(data));
    },
    validationSchema: formSchema,
  });

  const users = useSelector((state) => state?.users);
  const { passwordReset, loading, appError, serverError } = users;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (passwordReset) props.history.push("/login");
    }, 3000);
  }, [passwordReset, props.history]);

  return (
    <>
      <div className="min-h-screen bg-sky-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Reset your password
          </h2>
          {serverError || appError ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2"
              role="alert"
            >
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">
                {serverError}! {appError}
              </span>
            </div>
          ) : null}
          {passwordReset ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3 mb-2"
              role="alert"
            >
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">
                Password reset successfully. You will be redirected in 3
                seconds.
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Enter new password
                </label>
                <div className="flex items-center pl-6 mb-1 border border-gray-300 bg-white rounded-2xl">
                  <span className="inline-block pr-3 border-r border-gray-300">
                    <svg
                      className="w-5 h-5"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.6243 13.5625C15.3939 13.5625 15.2077 13.7581 15.2077 14V16.4517C15.2077 18.2573 14.0443 20.125 12.0973 20.125H5.42975C3.56848 20.125 1.87435 18.3741 1.87435 16.4517V10.5H15.6243C15.8547 10.5 16.041 10.3044 16.041 10.0625C16.041 9.82058 15.8547 9.625 15.6243 9.625H15.2077V5.95175C15.2077 2.39183 12.8635 0 9.37435 0H7.70768C4.21855 0 1.87435 2.39183 1.87435 5.95175V9.625H1.45768C1.22728 9.625 1.04102 9.82058 1.04102 10.0625V16.4517C1.04102 18.8322 3.13268 21 5.42975 21H12.0972C14.3089 21 16.0409 19.0023 16.0409 16.4517V14C16.041 13.7581 15.8547 13.5625 15.6243 13.5625ZM2.70768 5.95175C2.70768 2.86783 4.67022 0.875 7.70768 0.875H9.37435C12.4119 0.875 14.3743 2.86783 14.3743 5.95175V9.625H2.70768V5.95175Z"
                        fill="black"
                      ></path>
                      <path
                        d="M18.8815 9.3711C18.7482 9.17377 18.4878 9.12827 18.3003 9.26701L8.58655 16.4919L6.75235 14.5655C6.58942 14.3944 6.32608 14.3944 6.16322 14.5655C6.00028 14.7366 6.00028 15.0131 6.16322 15.1842L8.24655 17.3717C8.32695 17.4561 8.43362 17.4999 8.54115 17.4999C8.62488 17.4999 8.70868 17.4732 8.78282 17.4194L18.7828 9.98185C18.9703 9.84143 19.0141 9.56843 18.8815 9.3711Z"
                        fill="black"
                      ></path>
                    </svg>
                  </span>
                  {/* password */}
                  <input
                    value={formik.values.password || ""}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    className="w-full pr-6 pl-4 py-4 text-gray-500 font-bold placeholder-gray-500 rounded-r-full bg-white focus:outline-none placeholder-opacity-50 focus:placeholder-opacity-70 focus:ring-0 focus:border-gray-700"
                    type={showPassword ? "text" : "password"}
                    autoComplete="text"
                    placeholder="......"
                  />
                  {/* Show password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    {showPassword ? (
                      <EyeOffIcon
                        className="h-5 w-5 mr-2 ml-2 text-gray-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <EyeIcon
                        className="h-5 w-5 mr-2 ml-2 text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.password && formik.errors.password}
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Confirm new password
                </label>
                <div className="flex items-center pl-6 mb-1 border border-gray-300 bg-white rounded-2xl">
                  <span className="inline-block pr-3 border-r border-gray-300">
                    <svg
                      className="w-5 h-5"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.6243 13.5625C15.3939 13.5625 15.2077 13.7581 15.2077 14V16.4517C15.2077 18.2573 14.0443 20.125 12.0973 20.125H5.42975C3.56848 20.125 1.87435 18.3741 1.87435 16.4517V10.5H15.6243C15.8547 10.5 16.041 10.3044 16.041 10.0625C16.041 9.82058 15.8547 9.625 15.6243 9.625H15.2077V5.95175C15.2077 2.39183 12.8635 0 9.37435 0H7.70768C4.21855 0 1.87435 2.39183 1.87435 5.95175V9.625H1.45768C1.22728 9.625 1.04102 9.82058 1.04102 10.0625V16.4517C1.04102 18.8322 3.13268 21 5.42975 21H12.0972C14.3089 21 16.0409 19.0023 16.0409 16.4517V14C16.041 13.7581 15.8547 13.5625 15.6243 13.5625ZM2.70768 5.95175C2.70768 2.86783 4.67022 0.875 7.70768 0.875H9.37435C12.4119 0.875 14.3743 2.86783 14.3743 5.95175V9.625H2.70768V5.95175Z"
                        fill="black"
                      ></path>
                      <path
                        d="M18.8815 9.3711C18.7482 9.17377 18.4878 9.12827 18.3003 9.26701L8.58655 16.4919L6.75235 14.5655C6.58942 14.3944 6.32608 14.3944 6.16322 14.5655C6.00028 14.7366 6.00028 15.0131 6.16322 15.1842L8.24655 17.3717C8.32695 17.4561 8.43362 17.4999 8.54115 17.4999C8.62488 17.4999 8.70868 17.4732 8.78282 17.4194L18.7828 9.98185C18.9703 9.84143 19.0141 9.56843 18.8815 9.3711Z"
                        fill="black"
                      ></path>
                    </svg>
                  </span>
                  {/* confirm password */}
                  <input
                    value={formik.values.confirmPassword || ""}
                    onChange={formik.handleChange("confirmPassword")}
                    onBlur={formik.handleBlur("confirmPassword")}
                    className="w-full pr-6 pl-4 py-4 text-gray-500 font-bold placeholder-gray-500 rounded-r-full bg-white focus:outline-none placeholder-opacity-50 focus:placeholder-opacity-70 focus:ring-0 focus:border-gray-700"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="text"
                    onPaste={(e) => e.preventDefault()}
                    placeholder="......"
                  />
                  {/* Show confirm password */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-2"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon
                        className="h-5 w-5 mr-2 ml-2 text-gray-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <EyeIcon
                        className="h-5 w-5 mr-2 ml-2 text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
                {/* Err message */}
                <div className="text-red-400 text-sm">
                  {formik.touched.password && formik.errors.confirmPassword}
                </div>
              </div>

              {/* Login btn */}
              {loading ? (
                <button
                  disabled
                  className="py-4 w-full bg-gray-700 text-white font-bold rounded-full transition duration-200"
                >
                  Loading please wait..
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
