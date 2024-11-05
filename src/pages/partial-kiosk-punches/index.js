import React, { useEffect, useState } from 'react'
import Navbar2 from '../NavBar2'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import ShiftFilter from '../../components/partial-kiosk-punches/filter'
import EnhancedTable from '../../components/table/EnhancedTable'
import { Backdrop, CircularProgress, TextField, Skeleton } from '@mui/material'
import { FaCircleExclamation } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from 'axios'
import { apis } from '../../apis'
import { get_partial_kiosk_punches } from '../../redux/slice/partial-kiosk-punches'

const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'location_id', label: 'Location Id', isSort: true },
    { id: 'caregiver_name', label: 'Employee Name', isSort: true },
    { id: 'agency_name', label: 'Agency Name', align: 'center', isSort: true },
    { id: 'facility_name', label: 'Facility Name', align: 'center', isSort: true },
    { id: 'punch_type', label: 'Punch Type', isSort: true },
    // { id: 'punch_string', label: 'Punch String', align: 'center', isSort: false },
    // { id: 'is_success', label: 'Success', isSort: false },
    { id: 'facility_mapping_id', label: 'Facility Mapping Id', isSort: true },
    { id: 'punch_date', label: 'Punch Date', isSort: true },
    { id: 'details', label: 'Details', isSort: false },
];

const PartialKioskPunches = () => {
    const profile = useSelector(state => state.profile)
    const [rows, setRows] = useState([])
    const partial_punch = useSelector(state => state.partial_kiosk_punches)
    const [isSkeleton, setIsSkeleton] = useState(true)
    const [page, setPage] = useState(0)
    const dispatch = useDispatch()
    const token = Cookies.get('token')
    const [modalShow, setModalShow] = useState(false)
    const [modalData, setModalData] = useState({})
    useEffect(() => {
        if (!partial_punch?.status && !partial_punch?.loading) {
            dispatch(get_partial_kiosk_punches({ token }))
        }
        if (partial_punch?.status && !partial_punch?.loading) {
            setIsSkeleton(false)
        }
        const dataRows = partial_punch?.data?.map((it, key) => {
            const punch_string = it?.request_data?.punch_string.split('-')
            const date = new Date(it?.request_data?.datetime);

            // Format the date and time using toLocaleString
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            const formattedDate = date.toLocaleString('en-GB', options).replace(',', '-');
            return {
                id: key + 1,
                caregiver_name: it?.meta_data?.caregiver_name || "N/A",
                punch_type: it?.type || 'N/A',
                // is_success: it?.is_success ? <div className="text-success">Success</div> : <div className="text-danger">Failed</div> || 'N/A',
                // punch_string: punch_string?.length ? <div title={it?.request_data?.punch_string}> {`${punch_string[0]}-${punch_string[1]}`}</div> : 'N/A',
                location_id: it?.request_data?.location_id || "N/A",
                agency_name: it?.meta_data?.agency_name || "N/A",
                facility_name: it?.meta_data?.facility_name || "N/A",
                facility_mapping_id: it?.meta_data?.facility_mapping_id || "N/A",
                punch_date: formattedDate || "N/A",
                details: <button className="btn" onClick={() => handleShowModal(it)}><FaCircleExclamation /></button>
            }
        })
        setRows(dataRows)
    }, [partial_punch])


    async function handleShowModal(payload) {
        const punch_string = payload?.request_data?.punch_string.split('-')
        const date = new Date(payload?.request_data?.datetime);

        // Format the date and time using toLocaleString
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedDate = date.toLocaleString('en-GB', options).replace(',', '-');
        const data = {
            caregiver_name: payload?.meta_data?.caregiver_name || "",
            punch_type: payload?.type || '',
            is_success: payload?.is_success ? 'Success' : 'Failed' || '',
            punch_string: punch_string?.length ? payload?.request_data?.punch_string : '',
            location_id: payload?.request_data?.location_id || "",
            agency_name: payload?.meta_data?.agency_name || "",
            facility_name: payload?.meta_data?.facility_name || "",
            facility_mapping_id: payload?.meta_data?.facility_mapping_id || "",
            punch_date: formattedDate || "",
            message: payload?.request_data?.message || ""

        }
        setModalData(data)
        setModalShow(true)
    }

    return (
        <>
            <Navbar2 />
            {
                partial_punch?.loading && <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }

            <div className="container py-4">
                <div className="row justify-content-between align-items-center">
                    <div className="col d-flex align-items-center">
                        <NavLink to={"/landing-page"} className="text-dark">
                            <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        </NavLink>
                        <p className="admin-name-choose-sel rounded mb-0 mx-2 py-3 px-4">
                            Partial Kiosk Punches
                        </p>
                    </div>
                    <div className="col d-flex justify-content-end">
                        <div>
                            {profile?.data?.roles[0]?.name === "admin" && (
                                <NavLink to="/dashboard" className={"admin-name-choose-sel text-decoration-none py-3 mx-2 px-4 rounded"}>
                                    Shifts
                                </NavLink>
                            )}
                            {profile?.data?.roles[0]?.name === "admin" && (
                                <NavLink to="/admin" className={"admin-name-choose-sel text-decoration-none py-3 px-4 rounded"}>
                                    Admin Panel
                                </NavLink>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="dash-main py-3">
                <div className="container shift-filter">
                    <ShiftFilter isSkeleton={isSkeleton} setIsSkeleton={setIsSkeleton} setPage={setPage} rows={rows} />
                </div>
                <div className="container py-3">
                    {
                        !isSkeleton ? <EnhancedTable status={partial_punch?.status} columns={columns} rows={rows} page={page} setPage={setPage} /> :
                            <div>
                                <div className="py-2">
                                    <Skeleton variant="rounded" height={36} />
                                </div>
                                <div className="d-flex justify-content-between  py-2">
                                    {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                </div>
                                <div className="d-flex justify-content-between  py-3">
                                    {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                </div>
                                <div className="d-flex justify-content-between  py-3">
                                    {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                </div>
                                <div className="d-flex justify-content-between  py-3">
                                    {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                </div>
                            </div>
                    }
                </div>
            </div>
            <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Partial Punche Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="row">
                            <div className="col-md-6 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Employee Name"
                                    value={modalData?.caregiver_name}
                                    name="name"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-6 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Agency Name"
                                    value={modalData?.agency_name}
                                    name="name"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-6 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Facility Name"
                                    value={modalData?.facility_name}
                                    name="name"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-6 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Facility Mapping Id"
                                    value={modalData?.facility_mapping_id}
                                    name="name"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-6 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Punch Date"
                                    value={modalData?.punch_date}
                                    name="name"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-6 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Punch Type"
                                    value={modalData?.punch_type}
                                    name="name"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-12 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Message"
                                    value={modalData?.message}
                                    name="name"
                                    readOnly
                                />
                            </div>
                            <div className="col-md-12 mb-4 text-center">
                                <TextField
                                    id="outlined-required"
                                    fullWidth
                                    label="Punch String"
                                    value={modalData?.punch_string}
                                    name="name"
                                    readOnly
                                />
                            </div>

                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-success px-5" onClick={() => setModalShow(false)} style={{ background: "#345d3b" }}>
                                close
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PartialKioskPunches