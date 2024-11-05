import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import { DatePicker } from "rsuite";
import { FaCalendar } from "react-icons/fa";
import SelectSingle from "../../input/Select";
import { apis } from '../../../apis';
import Cookies from 'js-cookie';
import { get_employee } from '../../../redux/slice/employee';
const positionData = [
    {
        _id: "RN",
        name: "RN",
    },
    {
        _id: "CNA",
        name: "CNA",
    },
    {
        _id: "LPN",
        name: "LPN",
    },
];

const caregiverfilter = (data) => {
    return data?.map((it) => {
        return {
            _id: it._id,
            value: `${it?.firstName} ${it?.lastName}`
        }
    })
}


const AuthPunch = ({ filter }) => {
    const profile = useSelector(state => state.profile)
    const facility = useSelector(state => state?.facility)
    // const employee = useSelector((state) => state.employees);
    const [employee,setEmployee] = useState({
        _id:'',
        value:''
    })
    const all_caregivers = useSelector(state => state.all_caregivers);
    const { agency } = useSelector((state) => state.agency);
    const initPunch = {
        caregiver_id: "",
        agency_id: "",
        position: "",
        facility_id: "",
        date: "",
    };
    const [facilityList, setFacilityList] = useState([])
    const [modalShow, setModalShow] = useState("");
    const [empFilterFacility, setEmpFilterFacility] = useState([]);
    const [punchFormData, setPunchFormData] = useState(initPunch);
    const [punchErrorData, setPunchErrorData] = useState(initPunch);
    const dispatch = useDispatch()
    const token = Cookies.get('token')
    const handalChange = ({ target }) => {
        const { name, value } = target;
        setPunchErrorData(initPunch);
        setPunchFormData({
            ...punchFormData,
            [name]: value,
        });
    };
    function sortArrayByValue(array) {
        array?.sort((a, b) => {
            const valueA = a.value.toLowerCase();
            const valueB = b.value.toLowerCase();
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });
        return array;
    }

    // useEffect(() => {
    //     const isAdmin = profile?.data?.roles.some(item => item.name === "admin");
    //     if (isAdmin) {
    //         setFacilityList(facility?.facility_data)
    //     } else {
    //         setFacilityList(facility?.facility_data)
    //     }
    // }, [facility, profile])
    useEffect(() => {
        setFacilityList(facility?.facility_data)
    }, [facility, profile])
    // handal close modal
    function handalClosePunch() {
        setPunchErrorData(initPunch);
        setPunchFormData(initPunch);
        setModalShow(false);
    }

    // useEffect(() => {
    //     if (!employee?.status) {
    //         dispatch(get_employee({ token, user: profile?.data?._id }))
    //     }
    //     let newList = [];
    //     employee?.data?.filter((it) => {
           
    //     });
    //     // remove Duplicate object  
    //     const finalList = newList.filter((item, index, self) => index === self.findIndex(obj => obj._id === item._id))
    //     setEmpFilterFacility(finalList);
    // }, [employee.status]);
    useEffect(() => {
        if (all_caregivers?.status) {
            const list = all_caregivers?.data
            
            setEmpFilterFacility(list);
        }

    }, [all_caregivers.status])


    // create punch 
    const handalCreatePunch = async (e) => {
        e.preventDefault();
        try {
            let error = {};
            if (!punchFormData.caregiver_id) {
                error.caregiver_id = "Employee Required";
            }
            if (!punchFormData.agency_id) {
                error.agency_id = "Agency Required";
            }
            if (!punchFormData.position) {
                error.position = "Position Required";
            }
            if (!punchFormData.facility_id) {
                error.facility_id = "Facility Required";
            }

            if (!punchFormData.date) {
                error.date = "Date Required";
            }

            setPunchErrorData({
                ...punchErrorData,
                ...error,
            });

            if (Object.keys(error).length) {
                toast.error("Something went wrong with data..", {
                    position: "top-right",
                });
            }
            var res = await axios.post(apis.ADD_NO_AUTH_PUNCH, { ...punchFormData, punchuser: profile?.data?._id, });
            handalClosePunch();
            toast.success("Punch Added Successfully..", {
                position: "top-right",
            });
        } catch (error) {
            toast.error("Punch creation failed...", {
                position: "top-right",
            });
        }
    };
    return (
        <>
            <div className="date-fltr">
                <span onClick={() => setModalShow(true)}>
                    <span style={{ cursor: "pointer" }} className="date-icon-span">
                        <i style={{ color: "#4C7153" }} className="fa-solid fa-plus"></i>
                    </span>
                    Add Punch
                </span>
            </div>
            <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Add Punch
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handalCreatePunch}>
                        <div className="row">
                            {/* caregiver */}
                            <div className="col-md-4 mb-4 text-center">
                                <SelectSingle
                                    data={empFilterFacility?.map((it) => {
                                        return { ...it, name: `${it.firstName} ${it.lastName}` };
                                    }).sort((a, b) => {
                                        const valueA = a.name?.toLowerCase();
                                        const valueB = b.name?.toLowerCase();
                                        if (valueA < valueB) return -1;
                                        if (valueA > valueB) return 1;
                                        return 0;
                                    })}
                                    value={punchFormData?.caregiver_id}
                                    name="caregiver_id"
                                    label="Employee"
                                    handleChange={handalChange}
                                    error={punchErrorData?.caregiver_id}
                                />
                            </div>

                            {/* agency */}
                            <div className="col-md-4 mb-4 text-center">
                                <SelectSingle
                                    data={agency}
                                    value={punchFormData?.agency_id}
                                    name="agency_id"
                                    label="Agency"
                                    handleChange={handalChange}
                                    error={punchErrorData?.agency_id}
                                />
                            </div>

                            {/* facility */}
                            <div className="col-md-4 mb-4 text-center">
                                <SelectSingle
                                    data={facilityList}
                                    value={punchFormData?.facility_id}
                                    name="facility_id"
                                    label="Facility"
                                    handleChange={handalChange}
                                    error={punchErrorData?.facility_id}
                                />
                            </div>

                            {/* position */}
                            <div className="col-md-4 mb-4 text-center">
                                <SelectSingle
                                    data={positionData}
                                    value={punchFormData?.position}
                                    name="position"
                                    label="Position"
                                    handleChange={handalChange}
                                    error={punchErrorData?.position}
                                />
                            </div>

                            <div className="col-md-4 p-2 mb-4 text-center ">
                                <DatePicker
                                    // style={{ minWidth: 370, marginLeft: "3px" }}
                                    onChange={(e) => {
                                        handalChange({
                                            target: {
                                                name: "date",
                                                value: new Date(e),
                                            },
                                        });
                                    }}
                                    format="dd MMM yyyy hh:mm:ss aa"
                                    showMeridian
                                    caretAs={FaCalendar}
                                    className="uppercase"
                                    oneTap={true}
                                />

                                {punchErrorData?.date ? (
                                    <span className="err_cls">Date Required</span>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button
                                className="btn btn-success px-5"
                                style={{ background: "#345d3b" }}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AuthPunch