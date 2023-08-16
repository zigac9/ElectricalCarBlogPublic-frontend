import React from "react";
import { useSelector } from "react-redux";
import PublicNavbar from "./Public/PublicNavbar";
import PrivateNavbar from "./Private/PrivateNavbar";
import AdminNavbar from "./Admin/AdminNavbar";
import AccountVerificationAlertWarning from "./Alert/AccountVerificationAlertWarning";
import AccountVerificationSuccessAlert from "./Alert/AccountVerificationSuccessAlert";

const NavBar = () => {
  //get user from redux store
  const state = useSelector((state) => state.users);
  const { loginUserAuth } = state;
  const isAdmin = loginUserAuth?.isAdmin;

  const account = useSelector((state) => state.accountVerification);
  const { loading, appError, serverError, sendAccountVerification } = account;

  return (
    <>
      {isAdmin ? (
        <AdminNavbar isLogin={loginUserAuth} />
      ) : loginUserAuth ? (
        <PrivateNavbar isLogin={loginUserAuth} />
      ) : (
        <PublicNavbar />
      )}
      {loginUserAuth?.isAccountVerified === false && (
        <AccountVerificationAlertWarning />
      )}
      {loading && <h2 className={"text-center"}>Loading please wait...</h2>}
      {sendAccountVerification && <AccountVerificationSuccessAlert />}
      {(appError || serverError) && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">
            {serverError}! {appError}
          </span>
        </div>
      )}
    </>
  );
};

export default NavBar;
