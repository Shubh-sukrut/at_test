import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_twilio = createAsyncThunk('get_twilio', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const { data } = await axios.get(`${apis.GET_TWILIO}`, { headers })
            return data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const twilio = createSlice({
    name: 'twilio',
    initialState: {
        status: false,
        loading: false,
        error: '',
        twilio_data: [],
    },
    extraReducers: (builder) => {
        builder.addCase(get_twilio.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_twilio.fulfilled, (state, action) => {
            state.twilio_data = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_twilio.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.twilio_data = null;
        });
    }
})

export default twilio.reducer