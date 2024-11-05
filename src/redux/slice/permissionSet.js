import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_permissionSet = createAsyncThunk('get_permissionSet', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const { data } = await axios.get(`${apis.GET_PERMISSION_SET}`, { headers })
            return data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const permissionsSet = createSlice({
    name: "permissionSet",
    initialState: {
        permission: [],
        loading: false,
        status: false,
        error: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(get_permissionSet.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_permissionSet.fulfilled, (state, action) => {
            state.permission = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_permissionSet.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.permission = null;
        });
    }

})

export const permissionsSetAction = permissionsSet.actions
const permissionsSetSlice = permissionsSet.reducer
export default permissionsSetSlice