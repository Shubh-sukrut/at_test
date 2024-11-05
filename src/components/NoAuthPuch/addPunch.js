import { MdDone } from "react-icons/md";
import { Autocomplete, Chip, Skeleton, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { get_noAuthInfo } from '../../redux/slice/noAuthPunch';
import { useParams } from 'react-router-dom';
import { apis } from '../../apis';
import axios from 'axios';
import { Bounce, toast } from "react-toastify";
import { Row, Col, Container, Modal } from 'react-bootstrap'
import { ThreeDots } from "react-loader-spinner";
const AddNoAuthPunch = () => {
    const { facilityId } = useParams();
    const formInint = {
        agency: {
            id: '',
            name: ''
        },
        position: {
            id: '',
            name: ''
        }
    }
    const [resError, setResError] = useState('')
    const [error, setError] = useState({})
    const [errToast, setErrToast] = useState(false);
    const [successToast, setSuccessToast] = useState(false);
    const noAuthInfo = useSelector(s => s.noAuthInfo)
    const dispatch = useDispatch()
    const phone = Cookies.get("caregiver-phone-num");
    const [formData, setFormData] = useState(formInint)
    const [show, setShow] = useState(false)
    const [loader, setLoader] = useState(false)
    useEffect(() => {
        if (!noAuthInfo.status) {
            dispatch(get_noAuthInfo({ phone, facilityId }))
        }
    }, [noAuthInfo])


    const handalSearchById = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handelCreatePunch = async (e) => {
        e.preventDefault()
        try {
            setLoader(true)
            let isError = false;
            let errorList = {}
            Object.keys(formData).map((it) => {
                if (formData[it].id == '') {
                    errorList[it] = `${it.split('_').join(' ')} is required!`
                    setErrToast(true)
                    isError = true
                }
            })
            setError(errorList)
            if (isError) {
                setLoader(false)
                return
            }
            const finalData = {
                caregiver_id: noAuthInfo?.data?.caregiver?.id,
                agency_id: formData?.agency?.id,
                facility_id: facilityId,
                position: formData?.position?.name
            }
            const response = await axios.post(
                apis.ADD_NO_AUTH_PUNCH,
                finalData
            );
            dispatch(get_noAuthInfo({ phone, facilityId }))
            const responseData = response.data;
            if (responseData.punch_type === "In") {
                toast.success(
                    "Thank you for punching In at " + noAuthInfo?.data?.facility_name,
                    {
                        position: "top-right",
                    }
                );
            } else {
                toast.warning(
                    "Thank you for punching Out at " + noAuthInfo?.data?.facility_name,
                    {
                        position: "top-right",
                    }
                );
            }
            setShow(true)

        } catch (error) {
            if (error?.response?.data?.message) {
                setResError(error?.response?.data?.message)
            } else {
                setResError(error?.message)
            }

        } finally {
            setFormData(formInint)
            setLoader(false)
        }
    };

    const handalClose = () => {
        setShow(false)
    }


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
            toast.success("Facility Created Successfully", toastVal);
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
        <Container>
            <Row className="justify-content-center align-items-center flex-column vh-100">
                <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
                    {noAuthInfo?.status ? <h4 className="mb-4 text-center">
                        Hi {noAuthInfo?.data?.caregiver?.first_name} {noAuthInfo?.data?.caregiver?.last_name}, Welcome to {noAuthInfo?.data?.facility_name}!
                    </h4> : <div className='px-5 py-3'>
                        <Skeleton animation="wave" height={50} />
                    </div>}

                </Col>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12}>
                    <div className="card px-3" >
                        <div className="card-body">
                            {
                                !noAuthInfo?.status ? <>
                                    <div className='py-1 d-flex justify-content-center'>
                                        <Skeleton animation="wave" height={60} width={100} />
                                    </div>
                                    <div className='py-1'>
                                        <Skeleton animation="wave" height={100} />
                                    </div>
                                    <div className='py-1'>
                                        <Skeleton animation="wave" height={100} />
                                    </div>
                                </> : <>
                                    <h4 className="my-4 text-center">Add Punch</h4>
                                    <form onSubmit={handelCreatePunch}>
                                        <div className="mb-4">
                                            <Autocomplete
                                                id="size-small-filled"
                                                size="large"
                                                options={noAuthInfo?.data?.agency_list}
                                                value={formData?.agency}
                                                onChange={(_, value) => handalSearchById('agency', value)}
                                                getOptionLabel={(option) => option.name}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            label={option.name}
                                                            size="small"
                                                            {...getTagProps({ index })}
                                                        />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Agency"
                                                        placeholder="Search Agency"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Autocomplete
                                                id="size-small-filled"
                                                size="large"
                                                options={noAuthInfo?.data?.position || [{'name':'LPN'}, {'name':'RN'}, {'name':'CNA'}]} // Use an empty array if options are undefined
                                                value={formData?.position}
                                                onChange={(_, value) => handalSearchById('position', value)}
                                                getOptionLabel={(option) => option ? option.name : "N/A"} // If option is undefined, return "N/A"
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => {
                                                        return (
                                                            <Chip
                                                                label={option.name}
                                                                size="small"
                                                                {...getTagProps({ index })}
                                                            />
                                                        );
                                                    })
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Position"
                                                        placeholder="Search Position"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="text-center d-flex justify-content-center">
                                            {
                                                loader ? <button type="button" className="btn bg-custom-green d-flex align-items-end">
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
                                                </button> : <button type="submit" className="btn bg-custom-green"> Punch</button>
                                            }
                                        </div>
                                    </form>
                                </>
                            }
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal show={show} centered onHide={handalClose}>
                <Modal.Body>
                    <div className="d-flex justify-content-center mt-2">
                        <div className="d-flex justify-content-center py-3 text-center" style={{ fontSize: '50px', background: '#345d3b', color: '#fff', borderRadius: '50%', width: '80px', height: '80px', }}>
                            <MdDone />
                        </div>
                    </div>
                    <h4 className="text-center py-4">Thank you for punching.</h4>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-secondary" onClick={handalClose}>close</button>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>


    )
}

export default AddNoAuthPunch