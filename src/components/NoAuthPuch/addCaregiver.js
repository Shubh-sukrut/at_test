
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { apis } from '../../apis';
import { toast, Bounce } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { ThreeDots } from 'react-loader-spinner';
import { get_noAuthInfo } from '../../redux/slice/noAuthPunch';
import { useParams } from 'react-router-dom';
const AddCareGiver = ({ setIsAddCareGiver, validatePhoneNumber }) => {
    const { facilityId } = useParams();
    const dispatch = useDispatch()
    const [isLoader, setIsLoader] = useState(false)
    const [resError, setResError] = useState('')
    const [error, setError] = useState({})
    const [errToast, setErrToast] = useState(false);
    const [successToast, setSuccessToast] = useState(false);
    const formInit = {
        first_name: "",
        last_name: "",
        phone: "",
    }
    const [formData, setFormData] = useState(formInit);

    useEffect(() => {
        toast.info(
            "Your profile is not available with provided phone.Please enter your details here.",
            {
                position: "top-right",
            }
        );
    }, [])

    const handleformChange = ({ target }) => {
        const { name, value } = target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    // submit form 
    const submitCreateCaregiver = async (event) => {
        event.preventDefault();
        setIsLoader(true)
        if (validatePhoneNumber(formData.phone)) {
            let isError = false;
            let errorList = {}
            Object.keys(formData).map((it) => {
                if (formData[it] == '') {
                    errorList[it] = `${it.split('_').join(' ')} is required!`
                    setErrToast(true)
                    isError = true
                }
            })
            setError(errorList)
            if (isError) {
                setIsLoader(false)
                return
            }
            try {
                const response = await axios.post(
                    apis.CREATE_CAREGIVER,
                    formData
                );
                const responseData = response.data;
                setSuccessToast(true)
                dispatch(get_noAuthInfo({ phone: formData.phone, facilityId }))
            } catch (error) {
                if (error?.response?.data?.message) {
                    setResError('Caregiver with the same phone number already exists')
                } else {
                    setResError(error?.message)
                }
            } finally {
                // Clear the entire formData state
                setFormData(formInit);
                setIsLoader(false)
            }
        } else {
            toast.error('Invalid Phone Number', {
                position: "top-right",
            });
            setIsLoader(false)

        }
    };

    const toastVal = {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        autoClose: 3000,
    }

    useEffect(() => {
        if (successToast) {
            toast.success("Caregiver Created Successfully", toastVal);
            setSuccessToast(false)
        }
    }, [successToast]);

    useEffect(() => {
        if (errToast) {
            Object.values(error).map(it => {
                toast.error(it, toastVal);
            })
            setErrToast(false)
        }
    }, [errToast]);

    useEffect(() => {
        if (resError !== '') {
            toast.error(resError, toastVal);
            setResError('')
        }
    }, [resError]);


    return (
        <>
            <div className="d-flex justify-content-center align-items-center flex-column vh-100">
                <h4>Enter your details here</h4>
                <div className="cards card my-4">
                    <div className="card-body">
                        <p className="mt-2" style={{ cursor: "pointer" }} onClick={() => setIsAddCareGiver(false)}>
                            <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        </p>
                        <form onSubmit={submitCreateCaregiver}>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">
                                    Enter First Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="first_name"
                                    placeholder="Enter your first name here"
                                    value={formData.first_name}
                                    onChange={handleformChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">
                                    Enter Last Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="last_name"
                                    placeholder="Enter your last name here"
                                    value={formData.last_name}
                                    onChange={handleformChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">
                                    Enter Phone Number
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter your phone number here"
                                    value={formData.phone}
                                    onChange={handleformChange}
                                    required
                                />
                                <div id="phoneHelp" className="form-text">
                                    Disregard any special characters and exclude leading '1'.
                                </div>
                            </div>
                            {/* {invalidPhoneNumber && (
                                <p className="text-danger">Enter a valid phone number</p>
                            )} */}
                            <div className="d-flex justify-content-center">
                                {isLoader ? (
                                    <button type="submit" className="btn bg-custom-green d-flex align-items-end">
                                        <span className='px-1'>Loading</span> <ThreeDots
                                            visible={true}
                                            height="20"
                                            width="30"
                                            color="#fff"
                                            radius="9"
                                            className='px-1'
                                            ariaLabel="three-dots-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                        />
                                    </button>
                                ) :
                                    <> <button type="submit" className="btn bg-custom-green"> Submit </button></>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCareGiver