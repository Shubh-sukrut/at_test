import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { registraionuser } from "../redux/slice/registration";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import { Backdrop, CircularProgress } from "@mui/material";
import google from "../asset/google.png";
import microsoft from "../asset/microsoft.png";
import facebook from "../asset/facebook.jpg";

const Registeruser = () => {
  const loading = useSelector((state) => state?.registraion?.loading);
  const error = useSelector((state) => state.registraion.error);
  let token = Cookies.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [datas, setdatas] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [erremail, seterremail] = useState("");
  const [errpassword, seterrpassword] = useState("");
  const [errphone, seterrphone] = useState("");

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validnumber=(number)=>{
    const nuberregex=/^\d*$/;
    return nuberregex.test(number)
  }

  const loginuser = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!datas.email || !validateEmail(datas.email)) {
      seterremail("Invalid email address");
      valid = false;
    }

    if (!datas.phone || !validnumber(datas.phone)) {
      seterremail("Invalid Phone Number");
      valid = false;
    }

    if (!datas.password) {
      seterrpassword("Password is required");
      valid = false;
    }
  

    if (!valid) return;

    dispatch(registraionuser(datas)).then((payload) => {
      if (payload?.payload?.token && payload?.payload?.status) {
        navigate("/landing-page");
      } else {
        toast.error(payload.msg, {
          position: "top-right",
        });
      }
    });
  };

  const handlechange = (e) => {
    setdatas({ ...datas, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      seterremail("");
    }
    if (e.target.name === "password") {
      seterrpassword("");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token])

  return (
    <>
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Navbar />
      <div className="login-main">
        {error ? (
          <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Something went wrong
          </h1>
        ) : (
          <div className="login-box registionbox">
            <div className="heading-login">
              <h1>Registration</h1>
            </div>
            <div className="login-form">
              <form onSubmit={loginuser}>
                <div className="input-grp">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    onChange={handlechange}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    onChange={handlechange}
                  />
                  <input
                    type="text"
                    maxLength="12"
                    placeholder="Phone Number"
                    name="phone"
                    onChange={handlechange}
                  />
                   {errphone && <span style={{ color: "red" }}>{errphone}</span>}
                  <input
                    type="email"
                    placeholder="Email"
                    value={datas.email}
                    name="email"
                    onChange={handlechange}
                  />
                  {erremail && <span style={{ color: "red" }}>{erremail}</span>}
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={datas.password}
                    onChange={handlechange}
                  />
                  {errpassword && <span style={{ color: "red" }}>{errpassword}</span>}
                </div>
                <button type="submit" className="continue-btn-login">
                  {loading ? <Spinner animation="grow" /> : "Submit"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Registeruser;
