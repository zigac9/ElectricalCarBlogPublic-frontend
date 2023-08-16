import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";

const resetUserUpdateAction = createAction("user/profile/reset");
const resetUpdatePasswordAction = createAction("user/passwordUpdate/reset");
export const resetRegisterAction = createAction("user/register-reset");

// Register Action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (user, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call to backend
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${baseURL}/api/users/register`,
        user,
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// Login Action
export const loginUserAction = createAsyncThunk(
  "users/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call to backend
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${baseURL}/api/users/login`,
        userData,
        config
      );
      // save user to local storage
      localStorage.setItem("userAuth", JSON.stringify(res.data));

      if (userData?.rememberMe) {
        localStorage.setItem(
          "rememberMe",
          JSON.stringify(userData?.rememberMe)
        );
      } else {
        localStorage.removeItem("rememberMe");
      }

      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// Logout Action
export const logoutUserAction = createAsyncThunk(
  "users/logout",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      // remove user from local storage
      localStorage.removeItem("userAuth");
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// Fetch User Profile Action
export const fetchUserProfileAction = createAsyncThunk(
  "users/fetchUserProfile",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // http call to backend
      const res = await axios.get(
        `${baseURL}/api/users/profile/${userId}`,
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// upload profile image
export const uploadProfileImageAction = createAsyncThunk(
  "users/uploadProfileImage",
  async (userImage, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const formData = new FormData();
      formData.append("image", userImage?.image);

      const { data } = await axios.put(
        `${baseURL}/api/users/upload-profile-photo`,
        formData,
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// upload cover photo image
export const uploadCoverPhotoAction = createAsyncThunk(
  "users/uploadCoverPhoto",
  async (userImage, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const formData = new FormData();
      formData.append("image", userImage?.image);

      const { data } = await axios.put(
        `${baseURL}/api/users/upload-cover-photo`,
        formData,
        config
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update profile Action
export const updateUserProfileAction = createAsyncThunk(
  "users/update-profile",
  async (user, { rejectWithValue, getState, dispatch }) => {
    try {
      // get token from state
      const { loginUserAuth } = getState()?.users;
      const token = loginUserAuth?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(
        `${baseURL}/api/users`,
        {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
        },
        config
      );
      dispatch(resetUserUpdateAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

//Fetch user details
export const fetchUserDetailsAction = createAsyncThunk(
  "users/fetchUserDetails",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call to backend
      const res = await axios.get(`${baseURL}/api/users/${userId}`);
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Fetch all users
export const fetchAllUsersAction = createAsyncThunk(
  "users/fetchAllUsers",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // http call to backend
      const res = await axios.get(`${baseURL}/api/users`, config);
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Follow user
export const followUserAction = createAsyncThunk(
  "users/followUser",
  async (userToFollowId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // http call to backend
      const res = await axios.put(
        `${baseURL}/api/users/follow`,
        { followId: userToFollowId },
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// UnFollow user
export const unfollowUserAction = createAsyncThunk(
  "users/unfollowUser",
  async (userToUnFollowId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // http call to backend
      const res = await axios.put(
        `${baseURL}/api/users/unfollow`,
        { unFollowId: userToUnFollowId },
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// block user
export const blockUserAction = createAsyncThunk(
  "users/blockUser",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // http call to backend
      const res = await axios.post(
        `${baseURL}/api/users/block-user/${userId}`,
        {},
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// unblock user
export const unBlockUserAction = createAsyncThunk(
  "users/unblockUser",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // http call to backend
      const res = await axios.post(
        `${baseURL}/api/users/unblock-user/${userId}`,
        {},
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// update user password
export const updateUserPasswordAction = createAsyncThunk(
  "users/updatePassword",
  async (password, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // http call to backend
      const res = await axios.put(
        `${baseURL}/api/users/password`,
        password,
        config
      );
      dispatch(resetUpdatePasswordAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// Password reset token
export const passwordResetTokenAction = createAsyncThunk(
  "users/passwordResetToken",
  async (email, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call to backend
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        `${baseURL}/api/users/forget-password-token`,
        { email },
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

//Password reset
export const passwordResetAction = createAsyncThunk(
  "password/reset",
  async (user, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //http call
    try {
      const { data } = await axios.put(
        `${baseURL}/api/users/reset-password`,
        {
          password: user?.password,
          confirmPassword: user?.confirmPassword,
          token: user?.token,
        },
        config
      );
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete user
export const deleteUserAction = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // http call to backend
      const res = await axios.delete(`${baseURL}/api/users/${userId}`, config);
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

//get user from local storage and save it to redux store
const userAuth = localStorage.getItem("userAuth");
const loginUserAuth = userAuth ? JSON.parse(userAuth) : null;

// Slices
const usersSlices = createSlice({
  name: "users",
  initialState: { loginUserAuth },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUserAction.pending, (state, action) => {
        state.loading = true;
        state.appErrorReg = undefined;
        state.serverErrorReg = undefined;
      })
      .addCase(resetRegisterAction, (state, action) => {
        state.isRegistered = false;
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.registered = action?.payload;
        state.isRegistered = true;
        state.loading = false;
        state.appErrorReg = undefined;
        state.serverErrorReg = undefined;
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrorReg = action?.payload?.message;
        state.serverErrorReg = action?.error?.message;
      });

    // Login
    builder
      .addCase(loginUserAction.pending, (state, action) => {
        state.loading = true;
        state.appErrorLog = undefined;
        state.serverErrorLog = undefined;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.loginUserAuth = action?.payload;
        state.loading = false;
        state.appErrorLog = undefined;
        state.serverErrorLog = undefined;
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrorLog = action?.payload?.message;
        state.serverErrorLog = action?.error?.message;
      });

    // Logout
    builder
      .addCase(logoutUserAction.pending, (state, action) => {
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(logoutUserAction.fulfilled, (state, action) => {
        state.loginUserAuth = undefined;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(logoutUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfileAction.pending, (state, action) => {
        state.profileLoading = true;
        state.profileAppError = undefined;
        state.profileServerError = undefined;
      })
      .addCase(fetchUserProfileAction.fulfilled, (state, action) => {
        state.userProfile = action?.payload;
        state.profileLoading = false;
        state.profileAppError = undefined;
        state.profileServerError = undefined;
      })
      .addCase(fetchUserProfileAction.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileAppError = action?.payload?.message;
        state.profileServerError = action?.error?.message;
      });

    // Upload Profile Image
    builder
      .addCase(uploadProfileImageAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(uploadProfileImageAction.fulfilled, (state, action) => {
        state.profilePictureUploaded = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(uploadProfileImageAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // Upload cover Image
    builder
      .addCase(uploadCoverPhotoAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(uploadCoverPhotoAction.fulfilled, (state, action) => {
        state.coverPhotoUploaded = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(uploadCoverPhotoAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // Update Profile
    builder
      .addCase(updateUserProfileAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(resetUserUpdateAction, (state, action) => {
        state.isUpdated = true;
      })
      .addCase(updateUserProfileAction.fulfilled, (state, action) => {
        state.updatedProfile = action?.payload;
        state.isUpdated = false;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateUserProfileAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // Fetch User Details
    builder
      .addCase(fetchUserDetailsAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(fetchUserDetailsAction.fulfilled, (state, action) => {
        state.userDetails = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(fetchUserDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    //Fetch All Users
    builder
      .addCase(fetchAllUsersAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(fetchAllUsersAction.fulfilled, (state, action) => {
        state.allUsers = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(fetchAllUsersAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // Follow User
    builder
      .addCase(followUserAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(followUserAction.fulfilled, (state, action) => {
        state.followedUser = action?.payload;
        state.unfollowedUser = undefined;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(followUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    // UnFollow User
    builder
      .addCase(unfollowUserAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(unfollowUserAction.fulfilled, (state, action) => {
        state.unfollowedUser = action?.payload;
        state.followedUser = undefined;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(unfollowUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // block user
    builder
      .addCase(blockUserAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(blockUserAction.fulfilled, (state, action) => {
        state.blockedUser = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(blockUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // unblock user
    builder
      .addCase(unBlockUserAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(unBlockUserAction.fulfilled, (state, action) => {
        state.unblockedUser = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(unBlockUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    //update user password
    builder
      .addCase(updateUserPasswordAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(resetUpdatePasswordAction, (state, action) => {
        state.isPasswordUpdated = true;
      })
      .addCase(updateUserPasswordAction.fulfilled, (state, action) => {
        state.updatePassword = action?.payload;
        state.isPasswordUpdated = false;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateUserPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    //password reset token
    builder
      .addCase(passwordResetTokenAction.pending, (state, action) => {
        state.resetPasswordToken = undefined;
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(passwordResetTokenAction.fulfilled, (state, action) => {
        state.resetPasswordToken = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(passwordResetTokenAction.rejected, (state, action) => {
        state.resetPasswordToken = undefined;
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    //password reset
    builder
      .addCase(passwordResetAction.pending, (state, action) => {
        state.passwordReset = undefined;
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(passwordResetAction.fulfilled, (state, action) => {
        state.passwordReset = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(passwordResetAction.rejected, (state, action) => {
        state.passwordReset = undefined;
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    // delete user
    builder
      .addCase(deleteUserAction.pending, (state, action) => {
        state.deleteUser = undefined;
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(deleteUserAction.fulfilled, (state, action) => {
        state.deleteUser = action?.payload;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(deleteUserAction.rejected, (state, action) => {
        state.deleteUser = undefined;
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
  },
});

export default usersSlices.reducer;
