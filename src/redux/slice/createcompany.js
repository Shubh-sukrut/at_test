import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_company = createAsyncThunk('get_company', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const { data } = await axios.get(`${apis.GET_COMPANY}`, { headers })
            return data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const company = createSlice({
    name: 'company',
    initialState: {
        status: false,
        loading: false,
        error: '',
        company_data: [],
    },
    extraReducers: (builder) => {
        builder.addCase(get_company.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_company.fulfilled, (state, action) => {
            state.company_data = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_company.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.company_data = null;
        });
    }
})

export default company.reducer