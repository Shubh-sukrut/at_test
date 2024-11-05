import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { apis } from "../../apis";

export const Sendotp= createAsyncThunk('sendotp',async(userinfo)=>{
    const resetPassword=await axios.post(apis.RESET_PASS_API,userinfo)
    return resetPassword.data
})

const sendotpslice=createSlice({
    name:'sendotp',
    initialState:{
        loading:false,
        error:false,
        data:[]
    },
    extraReducers:(builder)=>{
        builder.addCase(Sendotp.pending,(state)=>{
            state.loading=true;
            state.error=false;
        })
        .addCase(Sendotp.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=false;
            state.data=action?.payload

        })
        .addCase(Sendotp.rejected,(state,action)=>{
            state.loading=false;
            state.error=true;
            state.data=action;
        })
    }
    
})

export const sendotp_action = sendotpslice.actions
const  sendotpreducer = sendotpslice.reducer
export default sendotpreducer