import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";

// Reset Action
const resetUpdateAction = createAction("category/update-reset");
const resetDeleteAction = createAction("category/delete-reset");
export const resetCreateCategoryAction = createAction("category/create-reset");

// Create Category Action
export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (category, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/category`,
        {
          title: category?.title,
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

// Fetch All Categories Action
export const fetchAllCategoriesAction = createAsyncThunk(
  "category/fetchAll",
  async (category, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call to backend
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.get(`${baseURL}/api/category`, config);
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// update Category Action
export const updateCategory = createAsyncThunk(
  "category/update",
  async (category, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/category/${category?.id}`,
        {
          title: category?.title,
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

// delete Category Action
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
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
      const res = await axios.delete(`${baseURL}/api/category/${id}`, config);

      // dispatch reset action
      dispatch(resetDeleteAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

// fetch single Category Action
export const fetchCategoryDetailsAction = createAsyncThunk(
  "category/details",
  async (id, { rejectWithValue, getState, dispatch }) => {
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
      const res = await axios.get(`${baseURL}/api/category/${id}`, config);

      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data); //return error message from backend
    }
  }
);

const categorySlices = createSlice({
  name: "category",
  initialState: {},
  extraReducers: (builder) => {
    // Create Category
    builder
      .addCase(createCategoryAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(resetCreateCategoryAction, (state, action) => {
        state.isCreated = false;
      })
      .addCase(createCategoryAction.fulfilled, (state, action) => {
        state.categoryCreated = action?.payload;
        state.isCreated = true;
        state.loading = false;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(createCategoryAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCategory = action?.payload?.message;
        state.serverErrCategory = action?.error?.message;
      });

    // Fetch All Categories
    builder
      .addCase(fetchAllCategoriesAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(fetchAllCategoriesAction.fulfilled, (state, action) => {
        state.categoryList = action?.payload;
        state.loading = false;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(fetchAllCategoriesAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCategory = action?.payload?.message;
        state.serverErrCategory = action?.error?.message;
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state, action) => {
        state.loading = true;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(resetUpdateAction, (state, action) => {
        state.isUpdated = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updatedCategory = action?.payload;
        state.isUpdated = false;
        state.loading = false;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.appErrCategory = action?.payload?.message;
        state.serverErrCategory = action?.error?.message;
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state, action) => {
        state.loading = true;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(resetDeleteAction, (state, action) => {
        state.isDeleted = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deletedCategory = action?.payload;
        state.isDeleted = false;
        state.loading = false;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.appErrCategory = action?.payload?.message;
        state.serverErrCategory = action?.error?.message;
      });

    // Fetch Single Category
    builder
      .addCase(fetchCategoryDetailsAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(fetchCategoryDetailsAction.fulfilled, (state, action) => {
        state.categoryDetails = action?.payload;
        state.loading = false;
        state.appErrCategory = undefined;
        state.serverErrCategory = undefined;
      })
      .addCase(fetchCategoryDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCategory = action?.payload?.message;
        state.serverErrCategory = action?.error?.message;
      });
  },
});

export default categorySlices.reducer;
