import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch data from a remote API
export const fetchData = createAsyncThunk(
  "example/fetchData",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("https://api.example.com/data");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.errors);
    }
  }
);

// Async thunk to post data to a remote API
export const postData = createAsyncThunk(
  "example/postData",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post("https://api.example.com/post", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.errors);
    }
  }
);

export const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(postData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(postData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearData } = exampleSlice.actions;

export default exampleSlice.reducer;
