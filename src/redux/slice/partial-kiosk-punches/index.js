import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../../apis";
import axios from "axios";

export const get_partial_kiosk_punches = createAsyncThunk("partial_kiosk_punches", async ({ token }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.PARTIAL_KIOSK_PUNCHES}`, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const partial_kiosk_punches = createSlice({
    name: "partial_kiosk_punches",
    initialState: {
        loading: false,
        error: null,
        data: null,
        status: false
    },
    extraReducers: (builder) => {
        builder.addCase(get_partial_kiosk_punches.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_partial_kiosk_punches.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_partial_kiosk_punches.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        });
    }
})

const partial_kiosk_punches_slice = partial_kiosk_punches.reducer
export default partial_kiosk_punches_slice
