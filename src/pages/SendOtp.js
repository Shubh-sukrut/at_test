import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {  toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import { get_profile } from "../redux/slice/profile";
import { Backdrop, CircularProgress } from "@mui/material";
import { Sendotp } from "../redux/slice/sendotp";
const SendOtp = () => {
  const loading= useSelector((state) => state?.sendotp?.loading);
  const error=useSelector((state)=>{
    return state.sendotp.error
  })

  let token = Cookies.get("otptoken")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [datas, setdatas] = useState({
    email: "",
    
  });
  const [erremail, seterremail] = useState("");
  const [errpassword, seterrpassword] = useState("");
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!datas.email) {
      console.log("not email")
      seterremail("Required");
      return false;
    }
    
   const res = await dispatch(Sendotp(datas));
   console.log("response" , res);
     if (res?.payload?.token) {
         Cookies.set("otptoken", res?.payload?.token);
         navigate("/verify-otp" , {
          state: {
            email: datas.email,
          }
         });
     } else {
       toast.error("Something went wrong", {
         position: "top-right",
       });
     }

  };
  const handlechange = (e) => {
    setdatas({ ...datas, [e.target.name]: e.target.value });
  };

  return (
    <>
      {
        loading && <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      <Navbar />
      <div className="login-main">
        <div className="login-box forget-width">
          <div className="heading-login">
            <h1>Forget Password</h1>
            {/* <p>to get started</p> */}
          </div>
          <div className="send-otp-from">
            <form onSubmit={sendOtp}>
              <div className="input-grp">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={datas.email}
                  name="email"
                  onChange={(e) => {
                    seterremail("");
                    handlechange(e);
                  }}
                />
                {erremail ? (
                  <span style={{ color: "red" }}>{erremail}</span>
                ) : (
                  ""
                )}
              </div>

              <button type="submit" className="continue-btn-login">
                {loading ? <Spinner animation="grow" /> : "Send"}
              </button>

            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SendOtp;
