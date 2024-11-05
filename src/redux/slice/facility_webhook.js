import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_facilitywebhook = createAsyncThunk('get_facilitywebhook', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const res = await axios.get(`${apis.GET_FACILITYWEBHOOK}`, { headers })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const facilitywebhook = createSlice({
    name: "facilitywebhook",
    initialState: {
        facilitywebhook: [],
        loading: false,
        status: false,
        error: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(get_facilitywebhook.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_facilitywebhook.fulfilled, (state, action) => {
            state.facilitywebhook = action.payload;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_facilitywebhook.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.facilitywebhook = null;
        });
    }

})




export const facilitywebhookAction = facilitywebhook.actions
const facilitywebhookSlice = facilitywebhook.reducer
export default facilitywebhookSlice