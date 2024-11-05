import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";
import Cookies from "js-cookie";

export const get_caregiver = createAsyncThunk("get_caregiver", async ({ token, position, startdate, enddate, agency_id, facility, search }, { rejectWithValue }) => {
    try {
        const headers = {
            token: token,
        };

        const response = await axios.get(`${apis.GET_PUNCHS}?position=${position}&agency=${agency_id}&startdate=${startdate}&enddate=${enddate}&facility_id=${facility}&emp_search=${search}`, { headers });

        if (response.status !== 200) {
            return rejectWithValue(response.data);
        }

        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const create_punch = createAsyncThunk("create_punch", async ({ token, punch, scanResult, locationId, kioskId, timestamp, facility_id }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.post(`${apis.CREATE_PUNCHS}`, { punch, scanResult, locationId, kioskId, timestamp, facility_id }, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})


export const get_single_punch = createAsyncThunk("get_single_punch", async ({ token, id }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.GET_SINGLE_PUNCHS}/${id}`, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
    
})


export const update_punch = createAsyncThunk("update_punch", async ({ token, id, caregiver, agency, position, type, utcTime }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.put(`${apis.UPDATE_PUNCHS}`, { id, caregiver, agency, position, type, utcTime }, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const facility_create = createAsyncThunk("facility_create", async ({ facility, company, token }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.post(`${apis.FACILITY_CREATE}`, { ...facility, company }, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})
const employeeslice = createSlice({
    name: "employee",
    initialState: {
        loading: false,
        error: null,
        data: null,
        status: null,
        punch: null,
        create_loading: false,
        create_error: null,
        single_punch: null,
        single_punch_loading: false,
        facility_create_state: null,
        all_caregivers : null
    },
    reducers: {
        punch_stateblank: (state, action) => {
            state.data = null
            state.error = null
            state.punch = null
            state.create_loading = null
            state.create_error = null
            state.single_punch = null
            state.single_punch_loading = null

        },
        facility_state_blank: (state, action) => {
            state.create_loading = null
            state.create_error = null
            state.facility_create_state = null
        }
    },
    extraReducers: (builder) => {
        //get all punchs
        builder.addCase(get_caregiver.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_caregiver.fulfilled, (state, action) => {
            state.data = action.payload.data;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_caregiver.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.data = null;
        });


        //create punchs

        builder.addCase(create_punch.pending, (state, action) => {
            state.create_loading = true
        })
        builder.addCase(create_punch.fulfilled, (state, action) => {
            state.punch = action.payload
            state.create_loading = false
        })
        builder.addCase(create_punch.rejected, (state, action) => {
            state.create_loading = false
            state.create_error = action.payload
            state.punch = null

        })

        //get single punchs

        builder.addCase(get_single_punch.pending, (state, action) => {
            state.single_punch_loading = true
        })
        builder.addCase(get_single_punch.fulfilled, (state, action) => {
            state.single_punch = action.payload
            state.single_punch_loading = false
        })
        builder.addCase(get_single_punch.rejected, (state, action) => {
            state.single_punch_loading = false
            state.create_error = action.payload
            state.single_punch = null

        })

        builder.addCase(update_punch.pending, (state, action) => {
            state.create_loading = true
        })
        builder.addCase(update_punch.fulfilled, (state, action) => {
            state.punch = action.payload
            state.create_loading = false
        })
        builder.addCase(update_punch.rejected, (state, action) => {
            state.create_loading = false
            state.create_error = action.payload
            state.punch = null

        })

        //create facility


        builder.addCase(facility_create.pending, (state, action) => {
            state.create_loading = "facilty-create-load"
        })
        builder.addCase(facility_create.fulfilled, (state, action) => {
            state.facility_create_state = action.payload
            state.create_loading = false
        })
        builder.addCase(facility_create.rejected, (state, action) => {
            state.create_loading = false
            state.create_error = action.payload
            state.facility_create_state = null

        })



        


    }
})


export const punch_action = employeeslice.actions
const employeesSlice = employeeslice.reducer

export default employeesSlice