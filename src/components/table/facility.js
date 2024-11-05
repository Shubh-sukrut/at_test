import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { apis } from "../../apis";
import { Skeleton, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { get_company } from "../../redux/slice/createcompany";
import { get_facility } from "../../redux/slice/facility";
import SelectSingle from "../../components/input/Select";
import TableSection from "./table";
import EnhancedTable from "./EnhancedTable";
import { get_twilio } from "../../redux/slice/createtwilio";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'name', label: 'Name', isSort: true },
    { id: 'company', label: 'Company', isSort: true },
    { id: 'timezone', label: 'Timezone', isSort: true },
    { id: 'address', label: 'Address', isSort: true },
    { id: 'city', label: 'City', isSort: true },
    { id: 'state', label: 'State', isSort: true },
    { id: 'zip', label: 'Zip', isSort: true },
    { id: 'locationId', label: 'Location Id', isSort: true },
    { id: 'twiliocredid', label: 'Twilio Account', isSort: true },
    { id: 'phone', label: 'Phone No.', isSort: true },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];

export default function FacilityTable({ }) {
    const [updateModel, setUpdateModel] = useState(false);
    const [FormData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const facility = useSelector(state => state.facility)
    const company = useSelector(state => state.company)
    const twiliocredid = useSelector(state => state?.twilio)
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false) // for CURD Operation
    const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data
    const [page, setPage] = useState(0)
    useEffect(() => {
        if (facility?.status) {
            setIsSkeleton(false)
        }
        if (!facility?.status) {
            dispatch(get_facility({ token }))
        }
        if (!company?.status) {
            dispatch(get_company({ token }))
        }
        if (!twiliocredid?.status) {
            dispatch(get_twilio({ token }))
        }
    }, [facility?.status, company]);
    useEffect(() => {
        const dataRows = facility?.facility_data?.map((it, key) => {
            return {
                id: facility?.facility_data.length - key,
                name: it?.name,
                company: it?.company?.name,
                phone: it?.phone,
                timezone: it?.timezone,
                address: it?.address,
                city: it?.city,
                state: it?.state,
                zip: it?.zip,
                locationId: it?.locationId,
                isAutumnTrack: it?.isAutumnTrack,
                twiliocredid: it?.twiliocredid?.name,
                action: (
                    <>
                        <button className="btn" onClick={() => handleModel(it)}>
                            <TbEdit />
                        </button>
                        {/* <button className="btn" onClick={() => handalDrop(it)}>
                            <RiDeleteBin6Line />
                        </button> */}
                    </>
                ),
            }
        })
        setRows(dataRows.reverse())
    }, [facility])

    const handleSwitchChange = (event) => {
        const isChecked = event.target.checked;
        setFormData({ ...FormData, isAutumnTrack: isChecked }); // Directly update formData's isAutumnTrack
    };


    const handalChange = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...FormData,
            [name]: value,
        });
    };

    function handleModel(item) {
        setFormData(item);
        setUpdateModel(true);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true)
            const updata = await axios.put(
                apis.FACILITY_UPDATE,
                {
                    id: FormData._id,
                    company: FormData?.company,
                    phone: FormData?.phone,
                    timezone: FormData?.timezone,
                    name: FormData?.name,
                    address: FormData?.address,
                    city: FormData?.city,
                    state: FormData?.state,
                    zip: FormData?.zip,
                    locationId: FormData?.locationId,
                    twiliocredid: FormData?.twiliocredid,
                    isAutumnTrack: FormData?.isAutumnTrack,
                    twiliocredid: FormData?.twiliocredid,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setUpdateModel(false);
            setLoading(false)
            toast.success("Facility Successfully updated..", {
                position: "top-right",
            });
            setTimeout(() => {
                dispatch(get_facility({ token }))
            }, 2000)
        } catch (error) {
            toast.error("Facility update failed..", {
                position: "top-right",
            });
        } finally {
            setLoading(false)
        }
    };


    // drop Company 
    async function handalDrop(data) {
        try {
            const res = await axios.delete(
                `${apis.FACILITY_DROP}/${data?._id}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            dispatch(get_facility({ token }))
        } catch (error) {
            console.log(error)
        }
    }
    const filteredRows = [...rows]
        .filter(row => {
            const searchFields = [row.name, row.company, row.phone, row.timezone, row.address, row.city, row.state, row.zip, row.locationId, row.twiliocredid];
            return searchFields.some(field => field?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
        }).map((row, index) => ({
            ...row,
            id: index + 1, // Start the ID from 1
        }));
    return (
        <>
            {/* Search Input */}
            {
                isSkeleton ? <div className="d-flex justify-content-end">
                    <Skeleton animation="wave" height={60} width={200} />
                </div> : <div className="container text-end mb-2">
                    <TextField
                        label="Search"
                        type="search"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => {
                            setPage(0)
                            setSearchQuery(e.target.value)
                        }}
                    />
                </div>
            }
            <EnhancedTable status={facility?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />
            <Modal
                size="lg"
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Facility
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Name"
                                value={FormData?.name}
                                name="name"
                                onChange={handalChange}
                                sx={{ width: "100%" }}
                            />
                        </div>

                        <div className="col-md-4 mb-4 text-center  ">
                            <SelectSingle data={company?.company_data} value={typeof FormData?.company == "string" ? FormData?.company : FormData?.company?._id} name="company" label="Company" handleChange={handalChange} />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <SelectSingle data={twiliocredid?.twilio_data} value={typeof FormData?.twiliocredid == "string" ? FormData?.twiliocredid : FormData?.twiliocredid?._id} name="twiliocredid" label="Select Twilio" handleChange={handalChange} />
                        </div>


                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label=" City"
                                defaultValue={FormData?.city}
                                onChange={handalChange}
                                name="city"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label=" State"
                                defaultValue={FormData?.state}
                                onChange={handalChange}
                                name="state"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Phone"
                                defaultValue={FormData?.phone}
                                onChange={handalChange}
                                name="phone"
                                sx={{ width: "100%" }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Timezone"
                                defaultValue={FormData?.timezone}
                                onChange={handalChange}
                                name="timezone"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Zip"
                                defaultValue={FormData?.zip}
                                onChange={handalChange}
                                name="zip"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Location Id"
                                defaultValue={FormData?.locationId}
                                onChange={handalChange}
                                name="locationId"
                                sx={{ width: "100%" }}
                            />
                        </div>


                    </div>
                    <div className="row">
                        <div className="col-sm-12 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label=" Address"
                                defaultValue={FormData?.address}
                                onChange={handalChange}
                                name="address"
                                sx={{ width: "100%" }}
                            />
                        </div>
                    </div>
                    <div className="py-3 px-2 border  rounded-2 d-flex justify-content-between align-items-center" style={{
                        width: "100%",
                    }} >
                        Is Autumn Track
                        <div className="form-check form-switch d-flex justify-content-center">
                        <input
                            style={{ cursor: 'pointer' }}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            onChange={handleSwitchChange}
                            id="flexSwitchCheckDefault"
                            checked={FormData.isAutumnTrack}
                        />
                    </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            loading ? <Button variant="success" type="button" disabled>Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update Facility</Button>
                        }

                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}