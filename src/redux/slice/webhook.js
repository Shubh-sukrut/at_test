import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_agencywebhook = createAsyncThunk('get_agencywebhook', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const res = await axios.get(`${apis.GET_AGENCYWEBHOOK}`, { headers })
            return res.data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const agencywebhook = createSlice({
    name: "agencywebhook",
    initialState: {
        agencywebhook: [],
        loading: false,
        status: false,
        error: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(get_agencywebhook.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_agencywebhook.fulfilled, (state, action) => {
            state.agencywebhook = action.payload;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_agencywebhook.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.agencywebhook = null;
        });
    }

})




export const agencywebhookAction = agencywebhook.actions
const agencywebhookSlice = agencywebhook.reducer
export default agencywebhookSlice