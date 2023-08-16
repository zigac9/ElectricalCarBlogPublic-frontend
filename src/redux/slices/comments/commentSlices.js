import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";

// Reset Action
const resetUpdateAction = createAction("comment/update-reset");

// Create Comment Action
export const createCommentAction = createAsyncThunk(
  "comment/create",
  async (comment, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/comments`,
        {
          description: comment?.description,
          postId: comment?.postId,
        },
        config
      );

      // dispatch reset action
      // dispatch(resetCreateAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

//delete comment action
export const deleteCommentAction = createAsyncThunk(
  "comment/delete",
  async (commentId, { rejectWithValue, getState, dispatch }) => {
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
      const res = await axios.delete(
        `${baseURL}/api/comments/${commentId}`,
        config
      );

      // dispatch reset action
      // dispatch(resetCreateAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

//update comment action
export const updateCommentAction = createAsyncThunk(
  "comment/update",
  async (comment, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/comments/${comment?.id}`,
        {
          description: comment?.description,
        },
        config
      );

      // dispatch reset action
      dispatch(resetUpdateAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

//fetch comment details
export const fetchCommentDetailsAction = createAsyncThunk(
  "comment/fetch-details",
  async (commentId, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/comments/${commentId}`,
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

//add likes to post
export const addLikeCommentAction = createAsyncThunk(
  "comment/addLike",
  async (commentId, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/comments/like`,
        { commentId },
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
export const addDislikeCommentAction = createAsyncThunk(
  "comment/addDislike",
  async (commentId, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/comments/dislike`,
        { commentId },
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

const commentSlices = createSlice({
  name: "comment",
  initialState: {},
  extraReducers: (builder) => {
    //create comment
    builder.addCase(createCommentAction.pending, (state, action) => {
      state.loading = true;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.commentCreated = action?.payload;
      state.loading = false;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErrComment = action?.payload?.message;
      state.serverErrComment = action?.error?.message;
    });
    //delete comment
    builder.addCase(deleteCommentAction.pending, (state, action) => {
      state.loading = true;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
      state.commentDeleted = action?.payload;
      state.loading = false;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(deleteCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErrComment = action?.payload?.message;
      state.serverErrComment = action?.error?.message;
    });
    //update comment
    builder.addCase(updateCommentAction.pending, (state, action) => {
      state.loading = true;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(updateCommentAction.fulfilled, (state, action) => {
      state.commentUpdated = action?.payload;
      state.loading = false;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(updateCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErrComment = action?.payload?.message;
      state.serverErrComment = action?.error?.message;
    });
    //fetch comment details
    builder.addCase(fetchCommentDetailsAction.pending, (state, action) => {
      state.loading = true;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(resetUpdateAction, (state, action) => {
      state.isUpdated = true;
    });
    builder.addCase(fetchCommentDetailsAction.fulfilled, (state, action) => {
      state.commentDetails = action?.payload;
      state.isUpdated = false;
      state.loading = false;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(fetchCommentDetailsAction.rejected, (state, action) => {
      state.loading = false;
      state.appErrComment = action?.payload?.message;
      state.serverErrComment = action?.error?.message;
    });

    //add like to comment
    builder.addCase(addLikeCommentAction.pending, (state, action) => {
      state.loadingLikes = true;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(addLikeCommentAction.fulfilled, (state, action) => {
      state.commentLiked = action?.payload;
      state.loadingLikes = false;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(addLikeCommentAction.rejected, (state, action) => {
      state.loadingLikes = false;
      state.appErrComment = action?.payload?.message;
      state.serverErrComment = action?.error?.message;
    });

    //add dislike to comment
    builder.addCase(addDislikeCommentAction.pending, (state, action) => {
      state.loadingLikes = true;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(addDislikeCommentAction.fulfilled, (state, action) => {
      state.commentDisliked = action?.payload;
      state.loadingLikes = false;
      state.appErrComment = undefined;
      state.serverErrComment = undefined;
    });
    builder.addCase(addDislikeCommentAction.rejected, (state, action) => {
      state.loadingLikes = false;
      state.appErrComment = action?.payload?.message;
      state.serverErrComment = action?.error?.message;
    });
  },
});

export default commentSlices.reducer;
