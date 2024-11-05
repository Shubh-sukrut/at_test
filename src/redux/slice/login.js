import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import { apis } from '../../apis';

export const login = createAsyncThunk("login", async ({ userdata }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(apis.LOGIN_API, userdata)
        return data
    } catch (error) {
        return rejectWithValue(error)

    }
})


export const get_single_user = createAsyncThunk("get_single_user", async ({ token }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(apis.GET_SINGLE_USER, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const get_facility = createAsyncThunk("get_facility", async ({ token }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(apis.GET_FACILITY, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const loginslice = createSlice({
    name: "login",
    initialState: {
        loading: false,
        error: null,
        data: null,
        user: null,
        jwt_error: null,
        user_facility: null
    },
    reducers: {
        stateblank: (state, action) => {
            state.data = null
            state.error = null
            state.jwt_error = null
        },

    },

    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.data = action?.payload;
            state.loading = false
            state.user = action?.payload?.findUser
        });
        builder.addCase(login.rejected, (state, action) => {
            state.error = action?.payload;
            state.loading = false;
        });

        builder.addCase(get_single_user.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_single_user.fulfilled, (state, action) => {
            state.loading = false
            state.user = action?.payload?.findUser
        });
        builder.addCase(get_single_user.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.jwt_error = action?.payload?.data?.error_code;
        });

        builder.addCase(get_facility.pending, (state, action) => {
            // state.loading = true;
        });
        builder.addCase(get_facility.fulfilled, (state, action) => {
            state.loading = false
            state.user_facility = action?.payload?.data
        });
        builder.addCase(get_facility.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.jwt_error = action?.payload?.data?.error_code;
        });


    }
})
export const login_action = loginslice.actions
const loginreducer = loginslice.reducer
export default loginreducer