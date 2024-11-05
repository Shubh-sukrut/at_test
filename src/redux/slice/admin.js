import { createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";

export const get_employee = createAsyncThunk("get_employee", async ({ token, position, startdate, enddate }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.GET_EMPLOYEE}?position=${position}&agency=&startdate=${startdate}&enddate=${enddate}`, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})


const admin = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        error: null,
        data: null,
        status: null
    },
    extraReducers: (builder) => {
        builder.addCase(get_employee.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_employee.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_employee.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        });
    }
})