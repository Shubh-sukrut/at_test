import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { apis } from "../../../apis";

// for exporting all shifts
export const get_all_csv_shifts = createAsyncThunk("get_all_csv_shifts", async ({token, position, startdate, enddate, agency_id, facility, search, user, emp_search, }, { rejectWithValue }) => {
    try {
        const headers = {
            token: token,
        };

        const response = await axios.post(`${apis.GET_CSV_SHIFTS}`,  {
            user: user,
            position: position,
            agency: agency_id,
            startdate: startdate,
            enddate: enddate,
            facility_id: facility,
            emp_search: search,
        }, { headers });

        if (response.status !== 200) {
            return rejectWithValue(response.data);
        }
       
        return  response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});



const csvshifts = createSlice({
    name: "employee",
    initialState: {
        loading: false,
        error: null,
        csvdata: null,
        status: null,
    },
    reducers: {
      
    },
    extraReducers: (builder) => {
        //get_all_csv_shifts
        builder.addCase(get_all_csv_shifts.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(get_all_csv_shifts.fulfilled, (state, action) => {
            state.csvdata = action.payload.data
            state.loading = false
            state.status = true
        })
        builder.addCase(get_all_csv_shifts.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.csvdata = null
        })

    }
})


export const caregiver_action = csvshifts.actions
const csvSlice = csvshifts.reducer

export default csvSlice;