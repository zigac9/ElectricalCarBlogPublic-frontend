import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";

export const resetSendAction = createAction("mail/send-reset");
export const resetSendAdminAction = createAction("mail/sendAdmin-reset");

// send mail to user
export const sendEMailAction = createAsyncThunk(
  "mail/sent",
  async (email, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/email`,
        {
          to: email?.recipientEmail,
          subject: email?.subject,
          message: email?.message,
        },
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

// send mail to electrical blog
export const sendEMailToAdminZigaAction = createAsyncThunk(
  "mail/sentToAdmin",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      // http call to backend
      const res = await axios.post(
        `${baseURL}/api/email/toAdmin`,
        {
          to: "ziga.crv24@gmail.com",
          from: email?.email,
          subject: email?.subject,
          category: email?.category,
          message: email?.message,
        },
        config
      );
      // dispatch(resetSendAdminAction());
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
const mailSlices = createSlice({
  name: "mail",
  initialState: {},
  extraReducers: (builder) => {
    // send email
    builder
      .addCase(sendEMailAction.pending, (state, action) => {
        state.loading = true;
        state.appErrMail = undefined;
        state.serverErrMail = undefined;
      })
      .addCase(resetSendAction, (state, action) => {
        state.isSend = false;
      })
      .addCase(sendEMailAction.fulfilled, (state, action) => {
        state.sendEmail = action?.payload;
        state.isSend = true;
        state.loading = false;
        state.appErrMail = undefined;
        state.serverErrMail = undefined;
      })
      .addCase(sendEMailAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrMail = action?.payload?.message;
        state.serverErrMail = action?.error?.message;
      });

    //send email admin
    builder
      .addCase(sendEMailToAdminZigaAction.pending, (state, action) => {
        state.loading = true;
        state.appErrMail = undefined;
        state.serverErrMail = undefined;
      })
      .addCase(resetSendAdminAction, (state, action) => {
        state.isSendToAdmin = false;
      })
      .addCase(sendEMailToAdminZigaAction.fulfilled, (state, action) => {
        state.sendEmailToAdmin = action?.payload;
        state.isSendToAdmin = true;
        state.loading = false;
        state.appErrMail = undefined;
        state.serverErrMail = undefined;
      })
      .addCase(sendEMailToAdminZigaAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrMail = action?.payload?.message;
        state.serverErrMail = action?.error?.message;
      });
  },
});

// Export Actions
export default mailSlices.reducer;
