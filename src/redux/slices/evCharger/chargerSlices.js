import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";

export const resetCreateAction = createAction("charger/create-reset");
const resetDeleteAction = createAction("charger/delete-reset");

//create charger
export const createChargerAction = createAsyncThunk(
  "chargers/createCharger",
  async (chargerInfo, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.post(
        `${baseURL}/api/charger`,
        {
          description: chargerInfo?.description,
          rating: chargerInfo?.rating,
          chargerInfo: chargerInfo?.chargerInfo,
          batteryLevel: chargerInfo?.batteryLevel,
          avgConsumption: chargerInfo?.avgConsumption,
        },
        config
      );
      dispatch(resetCreateAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//create charger update
export const createChargerUpdateAction = createAsyncThunk(
  "chargers/createChargerUpdate",
  async (chargerInfo, { rejectWithValue, getState, dispatch }) => {
    // get token from state
    const { loginUserAuth } = getState()?.users;
    const token = loginUserAuth?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.post(
        `${baseURL}/api/charger/create`,
        {
          description: chargerInfo?.description,
          rating: chargerInfo?.rating,
          chargerInfo: chargerInfo?.chargerInfo,
          batteryLevel: chargerInfo?.batteryLevel,
          avgConsumption: chargerInfo?.avgConsumption,
          postId: chargerInfo?.postId,
          number: chargerInfo?.number,
        },
        config
      );
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete charger
export const deleteChargerAction = createAsyncThunk(
  "post/delete",
  async (chargerId, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/charger/${chargerId}`,
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

// fetch charger details
export const fetchChargerDetailsAction = createAsyncThunk(
  "charger/fetchChargerDetails",
  async (chargerId, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/api/charger/${chargerId}`);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update charger
export const updateChargerAction = createAsyncThunk(
  "charger/update",
  async (charger, { rejectWithValue, getState, dispatch }) => {
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
        `${baseURL}/api/charger/${charger?.id}`,
        charger,
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

const chargerSlices = createSlice({
  name: "charger",
  initialState: {},
  extraReducers: (builder) => {
    // Create charger
    builder
      .addCase(createChargerAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(resetCreateAction, (state, action) => {
        state.chargerCreated = undefined;
        state.loading = false;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(createChargerAction.fulfilled, (state, action) => {
        state.chargerCreated = action?.payload;
        state.chargerDeleted = undefined;
        state.loading = false;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(createChargerAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCharger = action?.payload?.message;
        state.serverErrCharger = action?.error?.message;
      });

    // Create charger update
    builder
      .addCase(createChargerUpdateAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(createChargerUpdateAction.fulfilled, (state, action) => {
        state.chargerCreatedUpdated = action?.payload;
        state.loading = false;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(createChargerUpdateAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCharger = action?.payload?.message;
        state.serverErrCharger = action?.error?.message;
      });

    // Delete charger
    builder
      .addCase(deleteChargerAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(resetDeleteAction, (state, action) => {
        state.isChargerDeleted = true;
      })
      .addCase(deleteChargerAction.fulfilled, (state, action) => {
        state.chargerDeleted = action?.payload;
        state.isChargerDeleted = false;
        state.loading = false;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(deleteChargerAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCharger = action?.payload?.message;
        state.serverErrCharger = action?.error?.message;
      });

    // Fetch charger details
    builder
      .addCase(fetchChargerDetailsAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(fetchChargerDetailsAction.fulfilled, (state, action) => {
        state.chargerDetails = action?.payload;
        state.loading = false;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(fetchChargerDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCharger = action?.payload?.message;
        state.serverErrCharger = action?.error?.message;
      });

    // Update charger
    builder
      .addCase(updateChargerAction.pending, (state, action) => {
        state.loading = true;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(updateChargerAction.fulfilled, (state, action) => {
        state.chargerUpdated = action?.payload;
        state.chargerCreated = undefined;
        state.loading = false;
        state.appErrCharger = undefined;
        state.serverErrCharger = undefined;
      })
      .addCase(updateChargerAction.rejected, (state, action) => {
        state.loading = false;
        state.appErrCharger = action?.payload?.message;
        state.serverErrCharger = action?.error?.message;
      });
  },
});

export default chargerSlices.reducer;
