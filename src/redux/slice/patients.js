import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";

export const get_patient_with_contacts = createAsyncThunk("get_patient_with_contacts", async ({ user, token, search, page, limit, ...params }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        let relations = params?.selectedRelations?.map((itm) => {
            return itm?.value
        });
        const { data } = await axios.post(`${apis.GET_PATIENTS_WITH_CONTACTS}?search=${search ? search : ""}&page=${page}&limit=${limit}`, {
            startdate: params?.startdate ? params?.startdate : '',
            enddate: params?.enddate ? params?.enddate : '',
            disStartdate: params?.disStartdate ? params?.disStartdate : '',
            disEnddate: params?.disEnddate ? params?.disEnddate : '',
            facility: params?.facility?.length ? params?.facility : [],
            relationship: params?.selectedRelations.length ? relations : [],
            phone: params?.phone ? params?.phone : '',
            contact_name: params?.contact_name ? params?.contact_name : '',
            active: params?.active ? params?.active : false,
            user: user,
        }, { headers })
        return data

    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const get_patient = createAsyncThunk("get_patient", async ({ token, search, page, limit }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.GET_PATIENTS}?search=${search ? search : ""}&page=${page}&limit=${limit}`, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})


export const get_patient_contact = createAsyncThunk("get_patient_contact", async ({ token, page, limit, patient_id }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.GET_PATIENTS_CONTACT}${patient_id}?page=${page}&limit=${limit}`, { headers })
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})
export const get_group = createAsyncThunk("get_group", async ({ token, page, limit }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.GET_ALL_GROUPS}?page=${page}&limit=${limit}`, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const get_unknown_contact = createAsyncThunk("get_unknown_contact", async ({ token, page, limit }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.get(`${apis.GET_ALL_UNKNOWN_CONTACT}?page=${page}&limit=${limit}`, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const get_all_patient_contact = createAsyncThunk("get_all_patient_contact", async ({ token, limit, page }, { rejectWithValue }) => {
    try {
        let headers = {
            token: token
        }
        const { data } = await axios.post(`${apis.GET_ALL_PATIENTS_CONTACT}`, {
            limit: limit,
            page: page,
            search: "",
        }, { headers })

        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

const patient = createSlice({
    name: "patient",
    initialState: {
        loading: "",
        error: null,
        patient: null,
        patientsWithContacts: null,
        totalPatientsWithContacts: null,
        totalPatientCounts: null,
        status: null,
        patient_contact: null,
        patient_contact_count: 0,
        chatgroup: null,
        all_patients_contact: null,
        total_patients_contact_count: null,
        unknown_contact: null
    },
    reducers: {
        patient_state_blank: (state, action) => {
            state.patient = null
        },
        patient_contact_state_blank: (state, action) => {
            state.patient_contact = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(get_patient_with_contacts.pending, (state, action) => {
            state.loading = "patientsWithContacts";
        });
        builder.addCase(get_patient_with_contacts.fulfilled, (state, action) => {
            state.patientsWithContacts = action.payload.data;
            state.totalPatientsWithContacts = action.payload.total_records;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_patient_with_contacts.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = "";
            state.patientsWithContacts = null;
        });
        // patient
        builder.addCase(get_patient.pending, (state, action) => {
            state.loading = "patient";
        });
        builder.addCase(get_patient.fulfilled, (state, action) => {
            state.patient = action.payload.data;
            state.totalPatientCounts = action.payload.total_records;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_patient.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = "";
            state.patient = null;
        });


        builder.addCase(get_patient_contact.pending, (state, action) => {
            state.loading = "patient_contact";
        });
        builder.addCase(get_patient_contact.fulfilled, (state, action) => {
            state.patient_contact = action.payload.data;
            state.patient_contact_count = action.payload.count;
            state.status = true
            state.loading = false
        });
        builder.addCase(get_patient_contact.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = "";
            state.patient_contact = null;
        });

        builder.addCase(get_group.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(get_group.fulfilled, (state, action) => {

            state.status = true
            state.chatgroup = action.payload.data;
            state.loading = false
        });
        builder.addCase(get_group.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.patient_contact = null;
        });



        builder.addCase(get_all_patient_contact.pending, (state, action) => {
            state.loading = "all_patients_contact";
        });
        builder.addCase(get_all_patient_contact.fulfilled, (state, action) => {
            state.status = true
            state.all_patients_contact = action.payload.data;
            state.total_patients_contact_count = action.payload.total_records;
            state.loading = false;
        });
        builder.addCase(get_all_patient_contact.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.patient_contact = null;
        });

        builder.addCase(get_unknown_contact.pending, (state, action) => {
            state.loading = "unknown";
        });
        builder.addCase(get_unknown_contact.fulfilled, (state, action) => {
            state.status = true
            state.unknown_contact = action.payload.data;
            state.loading = false
        });
        builder.addCase(get_unknown_contact.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.unknown_contact = null;
        });
    }
})

export const patientAction = patient.actions
const patientSlice = patient.reducer
export default patientSlice