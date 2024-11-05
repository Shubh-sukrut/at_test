import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../../apis";
import axios from 'axios'
export const get_profile = createAsyncThunk("get_profile", async ({ token }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(apis.GET_SINGLE_USER, { headers })
        return data.findUser
    } catch (error) {
        console.log('error : ', error)
        return rejectWithValue(error.response)
    }
})

const profile = createSlice({
    name: "profile",
    initialState: {
        loading: false,
        error: null,
        data: null,
        status: false,
        authError: false
    },
    extraReducers: (builder) => {
        builder.addCase(get_profile.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_profile.fulfilled, (state, action) => {
            state.data = action.payload;
            state.status = true
            state.loading = false
            state.authError = false
        });
        builder.addCase(get_profile.rejected, (state, action) => {
            state.authError = true
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        });
    },
    reducers: {
        update(state, action) {
            return action.payload
        }
    }
})

const profileSlice = profile.reducer
export default profileSlice

export const { update } = profile.actions