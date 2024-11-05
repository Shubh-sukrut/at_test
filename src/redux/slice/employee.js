import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
export const get_employee = createAsyncThunk('get_employee', async (props, { rejectWithValue }) => {
    const { token, user, facility } = props
    try {
        try {
            let headers = {
                token: token,
            }
            const { data } = await axios.get(`${apis.GET_EMPLOYEE}/${user}`, { headers })
            return data
        } catch (error) {
            return rejectWithValue(error.response)
        }
    } catch (error) {

    }
})

const employee = createSlice({
    name: 'employees',
    initialState: {
        status: false,
        loading: false,
        error: '',
        employee_data: [],
    },
    extraReducers: (builder) => {
        builder.addCase(get_employee.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_employee.fulfilled, (state, action) => {
            state.employee_data = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_employee.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.employee_data = null;
        });
    }
})

export default employee.reducer