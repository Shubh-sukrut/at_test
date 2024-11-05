import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_roles = createAsyncThunk('get_roles', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const { data } = await axios.get(`${apis.GET_ROLES}`, { headers })
            return data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const roles = createSlice({
    name: "role",
    initialState: {
        roles: [],
        loading: false,
        status: false,
        error: null
    },
    reducers: {
            
    },
    extraReducers: (builder) => {
        builder.addCase(get_roles.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_roles.fulfilled, (state, action) => {
            state.roles = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_roles.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.roles = null;
        });
    }

})

export const rolesAction = roles.actions
const rolesSlice = roles.reducer
export default rolesSlice