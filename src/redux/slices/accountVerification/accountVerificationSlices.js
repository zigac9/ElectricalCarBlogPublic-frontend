import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";

const resetVerifyAction = createAction("account/verify-reset");

// send account verification token
export const sendAccountVerificationTokenAction = createAsyncThunk(
  "account/accountVerificationSent",
  async (verification, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/users/generate-verify-email-token`,
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

// verify account
export const verifyAccountAction = createAsyncThunk(
  "account/verify",
  async (verificationToken, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/users/verify-account`,
        { verificationToken },
        config
      );
      dispatch(resetVerifyAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// Slices
const accountVerificationSlices = createSlice({
  name: "accountVerification",
  initialState: {},
  extraReducers: (builder) => {
    // send email
    builder
      .addCase(sendAccountVerificationTokenAction.pending, (state, action) => {
        state.loading = true;
        state.appErrAccVeri = undefined;
        state.serverErrAccVeri = undefined;
      })
      .addCase(
        sendAccountVerificationTokenAction.fulfilled,
        (state, action) => {
          state.sendAccountVerification = action?.payload;
          state.loading = false;
          state.appErrAccVeri = undefined;
          state.serverErrAccVeri = undefined;
        }
      )
      .addCase(sendAccountVerificationTokenAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrAccVeri = action?.payload?.message;
        state.serverErrAccVeri = action?.error?.message;
      });
    builder
      .addCase(verifyAccountAction.pending, (state, action) => {
        state.loading = true;
        state.appErrAccVeri = undefined;
        state.serverErrAccVeri = undefined;
      })
      .addCase(resetVerifyAction, (state, action) => {
        state.isVerified = true;
      })
      .addCase(verifyAccountAction.fulfilled, (state, action) => {
        state.verifyAccount = action?.payload;
        state.isVerified = false;
        state.loading = false;
        state.appErrAccVeri = undefined;
        state.serverErrAccVeri = undefined;
      })
      .addCase(verifyAccountAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrAccVeri = action?.payload?.message;
        state.serverErrAccVeri = action?.error?.message;
      });
  },
});

// Export Actions
export default accountVerificationSlices.reducer;
