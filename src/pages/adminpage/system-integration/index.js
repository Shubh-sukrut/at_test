import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import NavBar2 from "../../NavBar2";
import { apis } from "../../../apis";
import axios from "axios";
import Cookies from "js-cookie";
import Adminaside from "../../../components/asides/Adminaside";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { get_company } from "../../../redux/slice/createcompany";
import AdminHeader from "../../../components/comman/admin_header";
import { Col, Row } from "react-bootstrap";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
const CreateCompany = () => {
    let token = Cookies.get("token");
    const navigate = useNavigate()
    // state for form data store
    const formInit = {
        from: new Date(new Date().getTime() - 60 * 1000 * 60 * 2 * 39),
        to: new Date(),
    }
    const [formData, setFormData] = useState(formInit);
    const [loading, setLoading] = useState(false);
    const [resError, setResError] = useState('')
    const [error, setError] = useState(formData)
    const [successToast, setSuccessToast] = useState(false);
    const [errToast, setErrToast] = useState(false);
    const dispatch = useDispatch()
    const [notFound, setNotFound] = useState([])

    // Handle form input change
    const handalChange = (target) => {
        const { name, value } = target;

        if (name === 'from') {
            const fromDate = new Date(value);
            const toDate = new Date(formData.to);
            const differenceInTime = toDate.getTime() - fromDate.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);

            if (differenceInDays > 39) {
                // Handle the case where the difference is more than 39 days
                // For example, you can set the "to" date to be 39 days after the "from" date
                const newToDate = new Date(fromDate.getTime() + (39 * 24 * 60 * 60 * 1000));
                setFormData({
                    ...formData,
                    from: fromDate,
                    to: newToDate
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: fromDate
                });
            }
        } else {
            const toDate = new Date(value);
            const fromDate = new Date(formData.from);
            const differenceInTime = toDate.getTime() - fromDate.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);

            if (differenceInDays > 39) {
                // Handle the case where the difference is more than 39 days
                // For example, you can set the "from" date to be 39 days before the "to" date
                const newFromDate = new Date(toDate.getTime() - (39 * 24 * 60 * 60 * 1000));
                setFormData({
                    ...formData,
                    from: newFromDate,
                    to: toDate
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: toDate
                });
            }
        }
    };




    // handel onSumit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            let headers = {
                token: token
            }
            const { data } = await axios.post(apis?.SYSTEM_INTEGRATION, formData, { headers })
            setNotFound(data?.not_found_falicity)
        } catch (error) {

        } finally {
            setLoading(false)
        }

    };

    const toast_item = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    }

    useEffect(() => {
        if (successToast) {
            toast.success("Company Created Successfully", toast_item);
        }
    }, [successToast]);

    useEffect(() => {
        if (errToast) {
            Object.values(error).map(it => {
                toast.error(it, toast_item);
            })

            setTimeout(() => {
                setErrToast(false)
            }, 1000)
        }
    }, [errToast]);

    useEffect(() => {
        if (resError !== '') {
            toast.error(resError, toast_item);
        }
    }, [resError]);

    return (
        <>
            <div className="admin-dashboard">
                <div className="admin-nav">
                    <NavBar2 />
                </div>
                {/* dashboard  */}
                <div className="admin-container ">
                    {/* aside  */}
                    <div className="aside text-center align-item-center">
                        <Adminaside />
                    </div>
                    <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/integration-facility-mapping/create" action="Create Integration Facility Mapping" />
                    <div className="create-user">
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-center mb-3">System Integration</h1>
                            <h6 className="text-center mb-3">Only 40 Days difference is allow.</h6>
                            <div className="container">
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <Row>
                                        <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className="py-2">
                                            <Stack spacing={2} sx={{ minWidth: '100%' }}>
                                                <DatePicker value={dayjs(formData.from)} onChange={e => handalChange({ name: "from", value: e })} />
                                            </Stack>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h4 className="text-center">To</h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className="py-2">
                                            <Stack spacing={2} sx={{ minWidth: '100%' }} value={dayjs('2022-04-17')}>
                                                <DatePicker value={dayjs(formData.to)} onChange={e => handalChange({ name: "to", value: e })} />
                                            </Stack>
                                        </Col>
                                    </Row>
                                </LocalizationProvider>
                                <div className="mt-2 d-flex justify-content-center">
                                    <button type={loading ? "button" : 'submit'} className="btn btn-success">
                                        {loading ? "Loading..." : "System Integration"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Modal show={notFound?.length} centered onHide={() => setNotFound([])}>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Facility Not Found
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {
                                notFound?.map((it, keys) => {
                                    return (
                                        <div className="d-flex justify-content-start align-items-center">
                                            <div className="d-flex align-items-center justify-content-center border rounded mx-2 fw-bold" style={{ width: '35px', height: '35px' }}> {keys + 1}. </div>
                                            <div>{it}</div>
                                        </div>
                                    )
                                })
                            }

                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setNotFound([])}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div >
            </div >
        </>
    );
};

export default CreateCompany;
