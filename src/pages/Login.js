import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { login, login_action } from "../redux/slice/login";
// import { apis } from "../apis";
// import axios from "axios";
import Cookies from "js-cookie";
import {  toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import google from "../asset/google.png"
import microsoft from "../asset/microsoft.png"
import facebook from "../asset/facebook.jpg"
import { get_profile } from "../redux/slice/profile";
import { Backdrop, CircularProgress } from "@mui/material";
import MicrosoftAuth from "../components/auth/MicrosoftAuth";
import GoogleAuth from "../components/auth/GoogleAuth";
import FacebookAuth from "../components/auth/FacebookAuth";
const Login = () => {
  const { loading } = useSelector((state) => state.login);
  const profile = useSelector(state => state.profile)
  let token = Cookies.get("token")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [datas, setdatas] = useState({
    email: "",
    password: "",
  });
  const [erremail, seterremail] = useState("");
  const [errpassword, seterrpassword] = useState("");
  const loginuser = async (e) => {
    e.preventDefault();
    if (!datas.email) {
      seterremail("Required");
    }
    if (!datas.password) {
      seterrpassword("Required");
    }
    if (!datas.email || !datas.password) {
      return false;
    }
    // const {data}=await axios.post(apis.LOGIN_API,datas)
    dispatch(login({ userdata: datas })).then(({ payload }) => {
      if (payload?.token && payload?.status) {
        dispatch(get_profile({ token: payload?.token }))?.then((res) => {
          Cookies.set("token", payload.token);
          navigate("/landing-page");
        })
      } else {
        toast.error(payload.msg, {
          position: "top-right",
        });
      }
    })
  };
  const handlechange = (e) => {
    setdatas({ ...datas, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (token) {
      navigate("/landing-page")
    }
  }, [token])
  return (
    <>
      {
        profile?.loading && <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      <Navbar />
      <div className="login-main">
        <div className="login-box">
          <div className="heading-login">
            <h1>Login</h1>
            <p>to get started</p>
          </div>
          <div className="login-from">
            <form onSubmit={loginuser}>
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
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={datas.password}
                  onChange={(e) => {
                    seterrpassword("");
                    handlechange(e);
                  }}
                />
                {errpassword ? (
                  <span style={{ color: "red" }}>{errpassword}</span>
                ) : (
                  ""
                )}
                <p className="forgot-psd" onClick={()=>{
                  navigate("/forget-password")
                }} >Forgot Password ?</p>
              </div>

              <button type="submit" className="continue-btn-login">
                {loading ? <Spinner animation="grow" /> : "Continue"}
              </button>

              <p className="forReg-log" onClick={()=>{navigate('/registration')}}>
                New User? <span className="reg-bold">Register</span>
              </p>
            </form>
            <div className="social-login-buttons">
              <GoogleAuth />
              {/* <Link
                to={"http://localhost:4000/auth/facebook"}
                className="facebook-button"
              >
                <div>
                  <img src={facebook} alt="" />
                </div>

              </Link> */}
              <FacebookAuth />
              <MicrosoftAuth />
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
