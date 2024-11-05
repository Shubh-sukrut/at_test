import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_facility = createAsyncThunk('get_facility', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const { data } = await axios.get(`${apis.GET_FACILITY}`, { headers })
            return data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const facilities = createSlice({
    name: 'facility',
    initialState: {
        status: false,
        loading: false,
        error: '',
        facility_data: [],
    },
    extraReducers: (builder) => {
        builder.addCase(get_facility.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_facility.fulfilled, (state, action) => {
            state.facility_data = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_facility.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.facility_data = null;
        });
    }
})

export default facilities.reducer