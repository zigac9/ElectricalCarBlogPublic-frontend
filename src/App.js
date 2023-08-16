import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage/HomePage";
import Register from "./components/Users/Register/Register";
import Login from "./components/Users/Login/Login";
import NavBar from "./components/Navigation/NavBar";
import CreateNewCategory from "./components/Categories/CreateNewCategory";
import CategoriesList from "./components/Categories/CategoryList/CategoriesList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import { PrivateRoute } from "./components/Navigation/ProtectedRoute/PrivateRoute";
import CreatePost from "./components/Post/CreatePost";
import PostsList from "./components/Post/PostList/PostsList";
import PostDetails from "./components/Post/PostDetails/PostDetails";
import UpdatePost from "./components/Post/UpdatePost";
import UpdateComment from "./components/Comment/UpdateComment";
import UserProfile from "./components/Users/Profile/UserProfile";
import UploadProfilePhoto from "./components/Users/Profile/UploadProfilePhoto";
import UpdateProfileForm from "./components/Users/Profile/UpdateProfileForm";
import SendEmailToUser from "./components/Users/Message/SendEmailToUser";
import AccountVerified from "./components/Users/AccountVerification/AccountVerified";
import UsersList from "./components/Users/UsersList/UsersList";
import UpdatePassword from "./components/Users/PasswordManager/UpdatePassword";
import ResetPasswordForm from "./components/Users/PasswordManager/ResetPasswordForm";
import ResetPassword from "./components/Users/PasswordManager/ResetPassword";
import PageNotFound from "./components/PageNotFoundErr/PageNotFound";
import { useSelector } from "react-redux";
import ContactUs from "./components/About/ContactUs";
import UploadCoverPhoto from "./components/Users/Profile/UploadCoverPhoto";

function App() {
  const { loginUserAuth } = useSelector((state) => state.users);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberMeValue = localStorage.getItem("rememberMe");
    setRememberMe(rememberMeValue === "true");

    const clearLocalStorage = () => {
      localStorage.removeItem("rememberMe");
    };

    if (!rememberMe) {
      window.addEventListener("beforeunload", clearLocalStorage);
    }

    return () => {
      window.removeEventListener("beforeunload", clearLocalStorage);
    };
  }, [rememberMe, loginUserAuth]);

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <PrivateRoute
          exact
          path="/add-category"
          component={CreateNewCategory}
        />
        <PrivateRoute exact path="/category-list" component={CategoriesList} />
        <PrivateRoute
          exact
          path="/update-category/:id"
          component={UpdateCategory}
        />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/create-post" component={CreatePost} />
        <Route exact path="/posts" component={PostsList} />
        <Route exact path="/posts/:id" component={PostDetails} />
        <PrivateRoute exact path="/update-post/:id" component={UpdatePost} />
        <PrivateRoute
          exact
          path="/update-comment/:id"
          component={UpdateComment}
        />
        <PrivateRoute exact path="/profile/:id" component={UserProfile} />
        <PrivateRoute
          exact
          path="/upload-profile-photo"
          component={UploadProfilePhoto}
        />
        <PrivateRoute
          exact
          path="/upload-cover-photo"
          component={UploadCoverPhoto}
        />
        <PrivateRoute
          exact
          path="/update-profile/:id"
          component={UpdateProfileForm}
        />
        <PrivateRoute exact path="/send-email" component={SendEmailToUser} />
        <PrivateRoute
          exact
          path="/verify-account/:token"
          component={AccountVerified}
        />
        <PrivateRoute exact path="/authors" component={UsersList} />
        <PrivateRoute
          exact
          path="/update-password"
          component={UpdatePassword}
        />
        <Route
          exact
          path="/password-reset-token"
          component={ResetPasswordForm}
        />
        <Route exact path="/reset-password/:token" component={ResetPassword} />
        <Route exact path="/page-not-found" component={PageNotFound} />
        <Route exact path="/contact-us" component={ContactUs} />
        <Redirect to="/page-not-found" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
