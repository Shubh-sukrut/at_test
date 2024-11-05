import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";

import { Backdrop, CircularProgress } from "@mui/material";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { resetpasss } from "../redux/slice/resetpasswordslice";

const ResetPassword = () => {
  const [showpassword, setshowpassword] = useState(false)
  const [showconfirmpassword, setshowconfirmpassword] = useState(false)
  const loading = useSelector((state) => state?.resetpassword?.loading);
  const profile = useSelector(state => state.profile)
  let token = Cookies.get("otptoken")
  let user = Cookies.get("token")

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [new_password, setnewpassword] = useState({ new_password: '' })
  const [datas, setdatas] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errconfirmPassword, seterrconfirmPassword] = useState("");
  const [errpassword, seterrpassword] = useState("");
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!datas.password) {
      seterrpassword("Required");
      return;
    }
    if (!datas.confirmPassword) {
      seterrconfirmPassword("Required");
      return;
    }
    if (datas.password == datas.confirmPassword) {
      const resetpassword = await dispatch(resetpasss({ password: datas.password, token }));
      if (resetpassword?.payload?.message) {
        navigate("/");
        Cookies.remove('otptoken');
      }
    }else{
      toast.error("Password and confirm password must be same", {
        position: "top-right",
    });
    }
  };

useEffect(() => {
  if(!token){
    navigate('/');
  }
}, [token])


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
            <h1>Enter Password</h1>
            {/* <p>to get started</p> */}
          </div>
          <div className="send-otp-from">
            <form onSubmit={sendOtp}>
              <div className="input-grp" style={{ position: 'relative' }} >
                <input
                  type={showpassword ? " text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={datas.password}
                  onChange={(e) => {
                    seterrpassword("");
                    handlechange(e);
                  }}
                />
                <IoEyeOutline style={{ position: 'absolute', top: '37px', right: '10px', display: showpassword === true ? null : 'none' }} onClick={() => { setshowpassword(false) }} />
                <IoEyeOffOutline style={{ position: 'absolute', top: '37px', right: '10px', display: showpassword === false ? null : 'none' }} onClick={() => { setshowpassword(true) }} />

                {errpassword ? (
                  <span style={{ color: "red" }}>{errpassword}</span>
                ) : (
                  ""
                )}
                <input
                  type={showconfirmpassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={datas.confirmPassword}
                  onChange={(e) => {
                    seterrpassword("");
                    handlechange(e);
                  }}
                />

                <IoEyeOutline style={{ position: 'absolute', top: '100px', right: '10px', display: showconfirmpassword === true ? null : 'none' }} onClick={() => { setshowconfirmpassword(false) }} />
                <IoEyeOffOutline style={{ position: 'absolute', top: '100px', right: '10px', display: showconfirmpassword === false ? null : 'none' }} onClick={() => { setshowconfirmpassword(true) }} />

                {errconfirmPassword ? (
                  <span style={{ color: "red" }}>{errconfirmPassword}</span>
                ) : (
                  ""
                )}
              </div>

              <button type="submit" className="continue-btn-login">
                {loading ? <Spinner animation="grow" /> : "Submit"}
              </button>

            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ResetPassword;
