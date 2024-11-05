import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_noAuthInfo = createAsyncThunk('get_noAuthInfo', async ({ phone, facilityId }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${apis.GET_NON_KIOSK}`, {
            phone: phone,
            facility_id: facilityId,
        })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const noAuthInfo = createSlice({
    name: 'facility',
    initialState: {
        status: false,
        loading: false,
        error: '',
        isPhone: false,
        data: [],
    },
    extraReducers: (builder) => {
        builder.addCase(get_noAuthInfo.pending, (state, action) => {
            state.loading = true;
            state.isPhone = false
        });
        builder.addCase(get_noAuthInfo.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = true
            state.loading = false
            state.isPhone = false
        });
        builder.addCase(get_noAuthInfo.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
            state.isPhone = true
        });
    }
})

const noAuthInfoSlice = noAuthInfo.reducer
export default noAuthInfoSlice