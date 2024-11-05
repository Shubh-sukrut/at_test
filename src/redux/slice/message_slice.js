import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import axios from "axios";

export const create_brodcast_message=createAsyncThunk("create_brodcast_message",async({token,Type,Method,patient_contacts,message},{rejectWithValue})=>{
    try {
        let headers={
            token:token
        }
        let payload={
            Type,Method,patient_contacts,message
        }
        const {data}=await axios.post(`${apis.CREATE_BROADCAST}`,payload,{headers})
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const create_message=createAsyncThunk("create_messages",async({token,Type,Method,Patient_contact,messages,group_id,chatType,patient_id},{rejectWithValue})=>{
    try {
        let headers={
            token:token
        }
        let payload={
            Type,Method,Patient_contact,messages,group_id,chatType,patient_id
        }
        const {data}=await axios.post(`${apis.CREATE_MESSAGES}`,payload,{headers})
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const fetch_new_message=createAsyncThunk("fetch_new_message",async({token},{rejectWithValue})=>{
    try {
        let headers={
            token:token
        }
        
        const {data}=await axios.get(`${apis.FETCH_NEW_MESSAGES}`,{headers})
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const get_messages=createAsyncThunk("get_messages",async({token,Patient_contact,group_id,chatType,page,limit},{rejectWithValue})=>{
    try {
        let headers={
            token:token
        }
        let payload={
            Patient_contact,group_id,chatType,page,limit
        }
        const {data}=await axios.post(`${apis.GET_MESSAGES}`,payload,{headers})
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})
export const get_broadcasts =createAsyncThunk("get_broadcasts",async({token,userId,page,limit},{rejectWithValue})=>{
    try {
        let headers={
            token:token
        }
        let payload={
            userId,page,limit
        }
        const {data}=await axios.post(`${apis.GET_BROADCASTS}`,payload,{headers})
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})

export const read_messages=createAsyncThunk("read_messages",async({token,contact_id},{rejectWithValue})=>{
    try {
        let headers={
            token:token
        }
        let payload={
            contact_id
        }
        const {data}=await axios.post(`${apis.READ_MSG}`,payload,{headers})
        return data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})


const messsage = createSlice({
    name: "messsage",
    initialState: {
        msg_loading: false,
        error: null,
        message: null,
        status: null,
        get_msg_status: null,
        create_message:null,
        msg_length:0,
        new_msg_count:null,
        unknownmsg_count:null,
        create_brodcast_message:null,
        broadcasts : null,
        total_broadcasts : null
    },
    reducers:{
        status_blank:(state,action)=>{
            state.status=null
            state.get_msg_status=null
            
        }
    },
    extraReducers: (builder) => {
        builder.addCase(create_message.pending, (state, action) => {
            state.msg_loading = "create_msg";
        });
        builder.addCase(create_message.fulfilled, (state, action) => {
            state.create_message = action.payload.data;
            state.status = true
            state.msg_loading = false
        });
        builder.addCase(create_message.rejected, (state, action) => {
            state.error = action.payload;
            state.msg_loading = false;
        });


        // BROADCASTS --------
        builder.addCase(get_broadcasts.pending, (state, action) => {
            state.msg_loading = "broadcast";
        });
        builder.addCase(get_broadcasts.fulfilled, (state, action) => {
            state.broadcasts = action.payload.data;
            state.total_broadcasts = action.payload.totalBroadcasts;
            state.status = true
            state.msg_loading = false
        });
        builder.addCase(get_broadcasts.rejected, (state, action) => {
            state.error = action.payload;
            state.msg_loading = false;
        });


        // broadcasting messages
        builder.addCase(create_brodcast_message.pending, (state, action) => {
            state.msg_loading = "create_brodcast_message";
        });
        builder.addCase(create_brodcast_message.fulfilled, (state, action) => {
            state.create_brodcast_message = action.payload.data;
            state.status = true
            state.msg_loading = false
        });
        builder.addCase(create_brodcast_message.rejected, (state, action) => {
            state.error = action.payload;
            state.msg_loading = false;
        });

        builder.addCase(get_messages.pending, (state, action) => {
            state.msg_loading = "get_msg";
        });
        builder.addCase(get_messages.fulfilled, (state, action) => {
            state.message = action.payload.data;
            state.msg_length=action.payload.count
            state.get_msg_status=action.payload.status
            state.msg_loading = false
        });
        builder.addCase(get_messages.rejected, (state, action) => {
            state.error = action.payload;
            state.msg_loading = false;
            state.message = null;
        });

        builder.addCase(fetch_new_message.pending, (state, action) => {
            
        });
        builder.addCase(fetch_new_message.fulfilled, (state, action) => {
            state.new_msg_count = action.payload.msg_count;
            state.unknownmsg_count = action.payload.unknown_msg_count;
            
        });
        builder.addCase(fetch_new_message.rejected, (state, action) => {
            state.error = action.payload;
        });

        builder.addCase(read_messages.pending, (state, action) => {
            
        });
        builder.addCase(read_messages.fulfilled, (state, action) => {
            state.status=true
            
        });
        builder.addCase(read_messages.rejected, (state, action) => {
            state.error = action.payload;
        });
    }
})

export const messgeAction=messsage.actions
const messageSlice=messsage.reducer
export default messageSlice
