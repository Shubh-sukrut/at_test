import React, { useEffect, useState } from 'react'
import Navbar2 from '../NavBar2'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import ShiftFilter from '../../components/shift/filter'
import EnhancedTable from '../../components/table/EnhancedTable'
import { Backdrop, CircularProgress, Skeleton } from '@mui/material'
import axios from 'axios'
import { FaCheckCircle } from "react-icons/fa";

import { apis } from '../../apis'
import DynamicTable from '../../components/table/dynamicTable'
import moment from 'moment'

const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'employee_name', label: 'Employee Name', isSort: true },
    { id: 'facility', label: 'Facility', isSort: true },
    { id: 'agency', label: 'Agency', isSort: true },
    { id: 'position', label: 'Position', align: 'center', isSort: true, textTransform: "uppercase" },
    { id: 'shift_start', label: 'Shift Start', align: 'center', isSort: true },
    { id: 'shift_end', label: 'Shift End', align: 'center', isSort: true },
    { id: 'shift_duration', label: 'Shift Duration', align: 'center', isSort: true },
    { id: 'scan_time', label: 'Scan Time', align: 'center', isSort: false },
    { id: 'punch_string', label: 'Kiosk Punch', align: 'center', isSort: false },
    // { id: 'action', label: 'Action', align: 'center' },
];

const ShiftDashboard = () => {
    const profile = useSelector(state => state.profile)
    const shift = useSelector((state) => state?.shift);
    const [rows, setRows] = useState([])
    const [isSkeleton, setIsSkeleton] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    useEffect(() => {
        const dataRows = shift?.shift?.map((it, key) => {
            const scan_date = moment(it?.scan_time);
            return {
                id: key + 1,
                employee_name: `${it?.caregiver?.lastName} ${it?.caregiver?.firstName}`,
                facility: it?.facility_id?.name,
                agency: it?.agency?.name,
                position: it.position,
                shift_start: `${it?.startShift?.date} \n ${it?.startShift?.time}`,
                shift_end: `${it?.endShift?.date} \n ${it?.endShift?.time}`,
                shift_duration: `${it.duration}`,
                scan_time:`${it?.scan_time ? scan_date.utc().format('DD/MM/YYYY') +" " +scan_date.utc().format('h:mm A') : "N/A"}`,
                punch_string: it?.shift_in_id?.punch_string ? <button className="btn"><FaCheckCircle size={20} color='#345d3b' /></button> : <>N/A</>,
                // action: <button className='btn' onClick={() => handalDrop(it)}>Drop</button>
            }
        })
        setRows(dataRows)
    }, [shift])

    let token = Cookies.get("token");
    async function handalDrop(payload) {
        try {
            await axios.delete(`${apis.DROP_SHIFT}/${payload?._id}`, {
                headers: {
                    token
                }
            })
        } catch (error) {
            console.log("error : ", error)
        }
    }

    return (
        <>
            <Navbar2 />
            {
                shift?.loading && <Backdrop
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
                            shifts
                        </p>
                    </div>
                    <div className="col d-flex justify-content-end">
                        <div>
                            {profile?.data?.roles[0]?.name === "admin" && (
                                <NavLink to="/partial-kiosk-punches" className={"admin-name-choose-sel text-decoration-none py-3 mx-2 px-4 rounded"}>
                                    Partial Punches
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
                    <ShiftFilter isSkeleton={isSkeleton} setIsSkeleton={setIsSkeleton} page={page} setPage={setPage} limit={rowsPerPage} />
                </div>
                <div className="container py-3">
                    {
                        !isSkeleton ? <DynamicTable status={shift?.status} columns={columns} rows={rows} page={page} setPage={setPage} totalPage={shift?.pagination?.total} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} /> :
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
        </>
    )
}

export default ShiftDashboard