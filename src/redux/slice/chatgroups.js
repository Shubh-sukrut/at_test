import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";

export const create_groups = createAsyncThunk("create_groups", async ({ token, members, group_type, patient_id }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        let payload = {
            members, group_type, patient_id
        }
        const { data } = await axios.post(`${apis.CREATE_GROUPS}`, payload, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const get_all_chats = createAsyncThunk("get_all_chats", async ({ token, type, limit, page }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        let payload = {
            type, limit, page
        }
        const { data } = await axios.post(`${apis.GET_ALL_CHATS}`, payload, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const groups = createSlice({
    name: "groups",
    initialState: {
        loading: false,
        error: null,
        create_groups: null,
        status: null,
        all_chats: null,
        data_length: 0
    },
    reducers: {
        state_blank: (state, action) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(create_groups.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(create_groups.fulfilled, (state, action) => {
            state.create_groups = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(create_groups.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.create_groups = null;
        });


        builder.addCase(get_all_chats.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_all_chats.fulfilled, (state, action) => {
            state.all_chats = action.payload.data;
            state.status = action.payload
            state.loading = false
            state.data_length = action.payload.count
        });
        builder.addCase(get_all_chats.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.all_chats = null;
        });
    }
})


export const chat_actions = groups.actions

const groupsSlice = groups.reducer
export default groupsSlice
