import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_user = createAsyncThunk('get_user', async ({ token }, { rejectWithValue }) => {
    try {
        try {
            let headers = {
                token: token
            }
            const { data } = await axios.get(`${apis.GET_USER}`, { headers })
            return data.data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const user = createSlice({
    name: 'user',
    initialState: {
        status: false,
        loading: false,
        error: null,
        user_data: [],
    },

    reducers: {
        updateUserState(state, action) {
            const { field, _id } = action.payload
            const newList = state.user_data?.map((it) => {
                if (it?._id == _id) {
                    return {
                        ...it,
                        [field]: !it[field]
                    }
                }
                return it
            })
            state.user_data = newList
            return state
        }
    },
    extraReducers: (builder) => {
        builder.addCase(get_user.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_user.fulfilled, (state, action) => {
            state.user_data = action.payload;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_user.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.user_data = null;
        });
    }
})

export default user.reducer

export const { updateUserState } = user.actions