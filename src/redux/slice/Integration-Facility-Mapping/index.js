import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../../apis";
import axios from "axios";

export const get_Integration_Facility_Mapping = createAsyncThunk("Integration_Facility_Mapping", async ({ token }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.INTEGRATION_FACILITY_MAPPING}`, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const IntegrationFacilityMapping = createSlice({
    name: "IntegrationFacilityMapping",
    initialState: {
        loading: false,
        error: null,
        data: null,
        status: false
    },
    extraReducers: (builder) => {
        builder.addCase(get_Integration_Facility_Mapping.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_Integration_Facility_Mapping.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_Integration_Facility_Mapping.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        });
    }
})

const Integration_Facility_Mapping_Slice = IntegrationFacilityMapping.reducer
export default Integration_Facility_Mapping_Slice
