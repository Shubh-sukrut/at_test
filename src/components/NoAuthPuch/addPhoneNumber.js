import { ThreeDots } from 'react-loader-spinner'

import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { Input, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import { get_noAuthInfo } from '../../redux/slice/noAuthPunch';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
const AddPhoneNumber = ({ setIsAddCareGiver, validatePhoneNumber }) => {
    const { facilityId } = useParams();
    const [loading, setLoading] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const dispatch = useDispatch()
    const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false)
    const handalChange = ({ target }) => {
        setPhoneNumber(target.value);
        setInvalidPhoneNumber(false);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            setLoading(true)
            if (validatePhoneNumber(phoneNumber)) {

                Cookies.set("caregiver-phone-num", phoneNumber);
                dispatch(get_noAuthInfo({ phone: phoneNumber, facilityId }))
                setIsAddCareGiver(true)
                setLoading(false)
            } else {
                setInvalidPhoneNumber(true)
            }
        } catch (error) {
        }
        finally {
            setLoading(false)
        }
    };
    return (
        <Container>
            <Row className="justify-content-center align-items-center vh-100">
                <Col xxl={6} xl={6} lg={6} md={6} sm={6} xs={12}>
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <h2 htmlFor="phoneNumber" className="form-label text-center py-2">
                                        Enter Phone Number
                                    </h2>
                                    <TextField
                                        type='tel'
                                        id="phoneNumber"
                                        label="Phone"
                                        // defaultValue={formData.Id}
                                        onChange={handalChange}
                                        placeholder='Enter your phone number'
                                        name="Agency_Id"
                                        fullWidth
                                    />
                                    <div id="phoneHelp" className="form-text py-2">
                                        Disregard any special characters and exclude leading '1'.
                                    </div>
                                </div>

                                {invalidPhoneNumber && <p className="text-danger">Enter valid phone number</p>}
                                <div className="text-center d-flex justify-content-center">
                                    {loading ? (
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
                                    ) : (
                                        <>
                                            {" "}
                                            <button type="submit" className="btn bg-custom-green">
                                                Submit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AddPhoneNumber