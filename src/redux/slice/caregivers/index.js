import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { apis } from "../../../apis";

// for dropdown filter with caregivers
export const get_all_caregivers = createAsyncThunk("get_all_caregivers", async ({ caregiver_id , token, position, startdate, enddate, agency_id, facility, search }, { rejectWithValue }) => {
    try {
        const headers = {
            token: token,
        };

        const response = await axios.get(`${apis.GET_ALL_CAREGIVERS}`, { headers });

        if (response.status !== 200) {
            return rejectWithValue(response.data);
        }

        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});



const caregiverslice = createSlice({
    name: "employee",
    initialState: {
        loading: false,
        error: null,
        data: null,
        status: null,
    },
    reducers: {
      
    },
    extraReducers: (builder) => {
        //get_all_caregivers
        builder.addCase(get_all_caregivers.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(get_all_caregivers.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.loading = false
            state.status = true
        })
        builder.addCase(get_all_caregivers.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.all_caregivers = null
        })

    }
})


export const caregiver_action = caregiverslice.actions
const caregiverSlice = caregiverslice.reducer

export default caregiverSlice;