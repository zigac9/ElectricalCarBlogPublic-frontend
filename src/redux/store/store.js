import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/userSlices";
import categoriesReducer from "../slices/category/categorySlices";
import postReducer from "../slices/posts/postSlices";
import commentReducer from "../slices/comments/commentSlices";
import emailReducer from "../slices/email/emailSlices";
import chargerReducer from "../slices/evCharger/chargerSlices";
import accountVerificationReducer from "../slices/accountVerification/accountVerificationSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    accountVerification: accountVerificationReducer,
    mail: emailReducer,
    category: categoriesReducer,
    post: postReducer,
    comment: commentReducer,
    charger: chargerReducer,
  },
});

export default store;
