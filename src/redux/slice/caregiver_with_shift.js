import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";

export const get_shift = createAsyncThunk("get_shift", async ({ token, position, startdate, enddate, agency_id, facility, search, user, emp_search, page, limit }, { rejectWithValue }) => {
    // console.log(search, emp_search)
    try {
        let headers = {
            token: token
        }
        // const { data } = await axios.get(`${apis.GET_SHIFT}?position=${position}&agency=${agency_id}&startdate=${startdate}&enddate=${enddate}&facility_id=${facility}&emp_search=${search}`, { headers })
        const { data } = await axios.post(`${apis.GET_SHIFTS}`, {
            user: user,
            position: position,
            agency: agency_id,
            startdate: startdate,
            enddate: enddate,
            facility_id: facility,
            emp_search: search,
            page: page + 1,
            limit: limit || 20
        }, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})


export const get_single_shift = createAsyncThunk("get_single_shift", async ({ token, id }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.GET_SINGLE_SHIFT}/${id}`, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const employeeslice = createSlice({
    name: "employee_shift",
    initialState: {
        loading: false,
        error: null,
        shift: [],
        status: false,
        pagination: {
            limit: 20,
            page: 1,
            pages: 1,
            total: 0
        }
    },
    reducers: {
        punch_stateblank: (state, action) => {
            state.data = null
            state.error = null
        },
    },
    extraReducers: (builder) => {
        //get all punchs
        builder.addCase(get_shift.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_shift.fulfilled, (state, action) => {
            state.shift = action.payload.data;
            state.pagination = action.payload.pagination;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_shift.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        });
    }
})


export const shift_action = employeeslice.actions
const shiftSlice = employeeslice.reducer

export default shiftSlice