import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddNoAuthPunch from "../components/NoAuthPuch/addPunch";
import AddCareGiver from '../components/NoAuthPuch/addCaregiver';
import AddPhoneNumber from '../components/NoAuthPuch/addPhoneNumber';
import { useDispatch, useSelector } from 'react-redux';
import { get_noAuthInfo } from '../redux/slice/noAuthPunch';
function NoAuthPuch() {
    const { facilityId } = useParams();
    const noAuthInfo = useSelector(state => state?.noAuthInfo)
    const dispatch = useDispatch()
    const [isAddCaregiver, setIsAddCareGiver] = useState(false)
    useEffect(() => {
        const phoneNumber = Cookies.get("caregiver-phone-num");
        if (!noAuthInfo?.status && phoneNumber) {
            dispatch(get_noAuthInfo({ phone: phoneNumber, facilityId }))
        }
    }, [])

    const validatePhoneNumber = (phoneNumber) => {
        // Check if the phone number doesn't start with +1, contains only digits, and is exactly 10 digits
        const isValid = /^[^+1\D]*\d{10}$/.test(phoneNumber);
        return isValid;
    };


    return (
        <>
            <div>

                {isAddCaregiver && !noAuthInfo?.status && noAuthInfo?.isPhone && <AddCareGiver setIsAddCareGiver={setIsAddCareGiver} validatePhoneNumber={validatePhoneNumber} />}
                {!noAuthInfo?.status && <AddPhoneNumber setIsAddCareGiver={setIsAddCareGiver} validatePhoneNumber={validatePhoneNumber} />}
                {noAuthInfo?.status && <AddNoAuthPunch />}

            </div>
        </>
    );
}

export default NoAuthPuch;
