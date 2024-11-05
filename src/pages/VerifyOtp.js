import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import { Backdrop, CircularProgress } from "@mui/material";
import OtpInput from "react-otp-input";
import { verifyotptooken } from "../redux/slice/verifyforgtpasswordotp";
import { toast, ToastContainer } from "react-toastify";
import { Sendotp } from "../redux/slice/sendotp";

const VerifyOtp = () => {
    const [timer, settimer] = useState(59)
    const [otpvalid, setotpvalid] = useState('')
    const loading = useSelector((state) => state?.verifyotp.loading);
    const errorotp = useSelector((state) => state?.verifyotp.error);
    const location = useLocation();
    let token = Cookies.get("otptoken");
    const [otpforget, setOtp] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [datas, setdatas] = useState({
        otp: "",

    });


    const handleOtpChange = (newValue) => {
        if (/^\d*$/.test(newValue)) {
            console.log(newValue);
            setOtp(newValue);
        }
    }

    useEffect(() => {
        if (timer != 0) {
            setTimeout(() => {
                settimer(timer => timer - 1)
            }, 1000);
        }

    }, [timer])

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token])

    const [resending, setResending] = useState(false)
    const resend = async () => {
        setResending(true)
        const res = await dispatch(Sendotp({ email: location?.state?.email }));
        console.log("response", res);
        if (res?.payload?.token) {
            Cookies.set("otptoken", res?.payload?.token);
            setResending(false)
        } else {
            toast.error("Something went wrong", {
                position: "top-right",
            });
            setResending(false)
        }

    };
    const verifyOtp = async (e) => {
        e.preventDefault();
        const verify = await dispatch(verifyotptooken({ otpforget, token }));
        console.log(verify, "hhekeidfk")
        if (verify?.payload?.token) {
            Cookies.set("otptoken", verify?.payload.token);
            navigate("/reset-password");
        }
        else {
            toast.error("Invalid Otp", {
                position: "top-right",
            });
        }
    };


    return (
        <>
            {
                loading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            <Navbar />
            <div className="login-main">
                <div className="login-box verify-box">
                    <div className="heading-login">
                        <h1 style={{ textAlign: 'center' }}>Verify OTP</h1>
                    </div>
                    <p className="timer">00:{timer >= 10 ? timer : `0${timer}`}</p>
                    <div className="send-otp-from">
                        <form onSubmit={verifyOtp}>
                            <div className="input-grp otpinput">
                                <OtpInput
                                    value={otpforget}
                                    onChange={handleOtpChange}
                                    numInputs={6}
                                    renderSeparator={<span style={{ marginBottom: '10px' }}>-</span>}
                                    renderInput={(props) => <input {...props} />}
                                    containerStyle={{
                                        width: '100%'
                                    }}
                                    inputStyle={{
                                        width: '90%',
                                        padding: '10px 0'
                                    }}
                                />
                            </div>
                            <p className="text-secondary text-center mt-2 d-flex gap-1 justify-content-center align-items-center">
                                I didn't receive any code.
                                {!resending ? (
                                    <span
                                    style={{cursor:timer === 0 ? "pointer" : "default"}}
                                        className={` ${timer === 0 ? "text-dark hover:text-primary" : "text-secondary"}`}
                                        onClick={() => {
                                            if (timer === 0) {
                                                resend();
                                            }
                                        }}
                                    >
                                        Resend
                                    </span>
                                ) : (
                                    <Spinner animation="grow" />
                                )}
                            </p>
                            <button type="submit" className="continue-btn-login">
                                {loading ? <Spinner animation="grow" /> : "Verify"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default VerifyOtp;
