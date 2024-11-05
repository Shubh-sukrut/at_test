import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apis } from "../../apis";

export const resetpasss= createAsyncThunk('resetpasss',async(params)=>{
    let {password,token} = params;
    let headers = {
        verify_token: token
    }
    const resetpasswordApi=await axios.post(apis.UPDATE_PASS_API,{new_password:password} , {headers})

    return resetpasswordApi.data
})

const resetpasswordslice=createSlice({
    name:'resetpassword',
    initialState:{
        loading:false,
        error:false,
        data:[]
    },
    extraReducers:(builder)=>{
        builder.addCase(resetpasss.pending,(state)=>{
            state.loading=true;
            state.error=false;
        })
        .addCase(resetpasss.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=false;
            state.data=action?.payload

        })
        .addCase(resetpasss.rejected,(state,action)=>{
            state.loading=false;
            state.error=true;
            
        })
    }
    
})

export const restepassword_action = resetpasswordslice.actions
const resetpasswordreducer = resetpasswordslice.reducer
export default resetpasswordreducer