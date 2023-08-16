import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";
import RouteCalculator from "./RouteCalculator";

const resetCreateAction = createAction("post/create-reset");
const resetUpdateAction = createAction("post/update-reset");
const resetDeleteAction = createAction("post/delete-reset");

//create post
export const createPostAction = createAsyncThunk(
  "post/create",
  async (post, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const routeCalculator = new RouteCalculator(
      post?.startingLocation,
      post?.endLocation,
      post?.usableBatterySize,
      post?.efficiency,
      post?.fastChargerPower
    );

    try {
      const chargersAuto = await routeCalculator.calculateRoute();
      const routeDetails = await routeCalculator.routeDetails(chargersAuto);

      const chargerId = post?.chargers?.map((charger) =>
        charger?.id.toString()
      );

      const formData = new FormData();
      formData.append("title", post?.title);
      formData.append("description", post?.description);
      formData.append("image", post?.image);
      formData.append("mainCategory", post?.mainCategory);
      formData.append("chargers", chargerId);
      formData.append(
        "startingLocation",
        JSON.stringify(post?.startingLocation)
      );
      formData.append("endLocation", JSON.stringify(post?.endLocation));
      formData.append("carName", post?.carName);
      formData.append("usableBatterySize", post?.usableBatterySize);
      formData.append("efficiency", post?.efficiency);
      formData.append("fastChargerPower", post?.fastChargerPower);
      formData.append("public", post?.public);
      formData.append(
        "recommendedChargers",
        JSON.stringify({
          chargersAuto,
          routeDetails,
        })
      );

      const { data } = await axios.post(
        `${baseURL}/api/posts`,
        formData,
        config
      );
      dispatch(resetCreateAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update post
export const updatePostAction = createAsyncThunk(
  "post/update",
  async (post, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let chargersAuto = null;
      let routeDetails = null;
      if (
        post?.startingLocation?.address !==
          post?.previousStartingLocation?.address ||
        post?.endLocation?.address !== post?.previousEndLocation?.address ||
        post?.usableBatterySize !== post?.previousUsableBatterySize ||
        post?.efficiency !== post?.previousEfficiency ||
        post?.fastChargerPower !== post?.previousFastChargerPower
      ) {
        const routeCalculator = new RouteCalculator(
          post?.startingLocation,
          post?.endLocation,
          post?.usableBatterySize,
          post?.efficiency,
          post?.fastChargerPower
        );

        chargersAuto = await routeCalculator.calculateRoute();
        routeDetails = await routeCalculator.routeDetails(chargersAuto);
      }

      const chargerId = post?.chargers?.map((charger) =>
        charger?.id.toString()
      );

      const formData = new FormData();
      formData.append("title", post?.title);
      formData.append("description", post?.description);
      formData.append("image", post?.image);
      formData.append("mainCategory", post?.mainCategory);
      formData.append("chargers", chargerId);
      formData.append(
        "startingLocation",
        JSON.stringify(post?.startingLocation)
      );
      formData.append("endLocation", JSON.stringify(post?.endLocation));
      formData.append("carName", post?.carName);
      formData.append("usableBatterySize", post?.usableBatterySize);
      formData.append("efficiency", post?.efficiency);
      formData.append("fastChargerPower", post?.fastChargerPower);
      formData.append("public", post?.public);
      formData.append(
        "recommendedChargers",
        JSON.stringify({
          chargersAuto,
          routeDetails,
        })
      );

      const { data } = await axios.put(
        `${baseURL}/api/posts/${post?.id}`,
        formData,
        config
      );
      dispatch(resetUpdateAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete post
export const deletePostAction = createAsyncThunk(
  "post/delete",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.delete(
        `${baseURL}/api/posts/${postId}`,
        config
      );
      dispatch(resetDeleteAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch all posts
export const fetchAllPostsAction = createAsyncThunk(
  "post/fetchAll",
  async (post, { rejectWithValue, getState, dispatch }) => {
    const { postTitle, mainCategory } = post || {};
    try {
      const { data } = await axios.get(
        `${baseURL}/api/posts?mainCategory=${mainCategory}&postTitle=${postTitle}`
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

//fetch post details
export const fetchPostDetailsAction = createAsyncThunk(
  "post/fetchPostDetails",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/api/posts/${postId}`);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//add likes to post
export const addLikeAction = createAsyncThunk(
  "post/addLike",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/posts/like`,
        { postId },
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

//add dislike to post
export const addDislikeAction = createAsyncThunk(
  "post/addDislike",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${baseURL}/api/posts/dislike`,
        { postId },
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

//post slices
const postSlices = createSlice({
  name: "post",
  initialState: {},
  extraReducers: (builder) => {
    //create post
    builder
      .addCase(createPostAction.pending, (state, action) => {
        state.loading = true;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(resetCreateAction, (state, action) => {
        state.isCreated = true;
      })
      .addCase(createPostAction.fulfilled, (state, action) => {
        state.postCreated = action?.payload;
        state.isCreated = false;
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(createPostAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrPost = action?.payload?.message;
        state.serverErrPost = action?.error?.message;
      })
      //update post
      .addCase(updatePostAction.pending, (state, action) => {
        state.loading = true;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(resetUpdateAction, (state, action) => {
        state.isUpdated = true;
      })
      .addCase(updatePostAction.fulfilled, (state, action) => {
        state.postUpdated = action?.payload;
        state.isUpdated = false;
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(updatePostAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrPost = action?.payload?.message;
        state.serverErrPost = action?.error?.message;
      })
      //delete post
      .addCase(deletePostAction.pending, (state, action) => {
        state.loading = true;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(resetDeleteAction, (state, action) => {
        state.isDeleted = true;
      })
      .addCase(deletePostAction.fulfilled, (state, action) => {
        state.isDeleted = action?.payload;
        state.isDeleted = false;
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(deletePostAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrPost = action?.payload?.message;
        state.serverErrPost = action?.error?.message;
      })
      //fetch all posts
      .addCase(fetchAllPostsAction.pending, (state, action) => {
        state.loading = true;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(fetchAllPostsAction.fulfilled, (state, action) => {
        state.fetchAllPosts = action?.payload;
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(fetchAllPostsAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrPost = action?.payload?.message;
        state.serverErrPost = action?.error?.message;
      })
      //fetch post details
      .addCase(fetchPostDetailsAction.pending, (state, action) => {
        state.loading = true;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(fetchPostDetailsAction.fulfilled, (state, action) => {
        state.fetchPostDetails = action?.payload;
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(fetchPostDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrPost = action?.payload?.message;
        state.serverErrPost = action?.error?.message;
      })
      //add like to post
      .addCase(addLikeAction.pending, (state, action) => {
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(addLikeAction.fulfilled, (state, action) => {
        state.addLike = action?.payload;
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(addLikeAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrPost = action?.payload?.message;
        state.serverErrPost = action?.error?.message;
      })
      //add dislike to post
      .addCase(addDislikeAction.pending, (state, action) => {
        state.loading = true;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(addDislikeAction.fulfilled, (state, action) => {
        state.addDislike = action?.payload;
        state.loading = false;
        state.appErrPost = undefined;
        state.serverErrPost = undefined;
      })
      .addCase(addDislikeAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrPost = action?.payload?.message;
        state.serverErrPost = action?.error?.message;
      });
  },
});

export default postSlices.reducer;
