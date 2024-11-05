import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apis } from "../../apis";
// import { act } from "react";

export const verifyotptooken= createAsyncThunk('verifyotptooken',async(params)=>{
    let {otpforget,token} = params;
    let headers = {
        verify_token: token
    }
    const verifyotpapi=await axios.post(apis.VERIFY_OTP_API,{otp:otpforget} , {headers})

    return verifyotpapi.data
})

const verifyotpslice=createSlice({
    name:'otpverify',
    initialState:{
        loading:false,
        error:false,
        data:[]
    },
    extraReducers:(builder)=>{
        builder.addCase(verifyotptooken.pending,(state)=>{
            state.loading=true;
            state.error=false;
        })
        .addCase(verifyotptooken.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=false;
            state.data=action?.payload

        })
        .addCase(verifyotptooken.rejected,(state,action)=>{
            state.loading=false;
            state.error=true;
            state.data=action?.payload
            
        })
    }
    
})

export const verify_action = verifyotpslice.actions
const verifyotpreducer = verifyotpslice.reducer
export default verifyotpreducer