import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { apis } from "../../apis";
import { Skeleton, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import MultipleSelect from "../../components/input/MultipleSelect";
import SelectSingle from "../../components/input/Select";
import Cookies from "js-cookie";
import { updateUserState, get_user } from "../../redux/slice/user";
import { toast } from "react-toastify";
import { get_company } from "../../redux/slice/createcompany";
import { get_facility } from "../../redux/slice/facility";
import { get_roles } from "../../redux/slice/roles";
import TableSection from "./table";
import { get_agency } from "../../redux/slice/agency";
import EnhancedTable from "./EnhancedTable";
const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'name', label: 'Name', isSort: true },
    { id: 'company', label: 'Company', isSort: true },
    { id: 'roles', label: 'Roles', isSort: true },
    { id: 'email', label: 'Email', align: 'center', isSort: true },
    { id: 'portal', label: 'Agency Tracking', isSort: false },
    // { id: 'mail_report', label: 'Mail Report', align: 'end', isSort: false },
    { id: 'subscribe', label: 'Patient Communication', align: 'end', isSort: false },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];


export default function UserTable() {
    const [Loading, setLoading] = useState(false)
    const [updateModel, setUpdateModel] = useState(false);
    const [FormData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const facility = useSelector(state => state.facility)
    const user = useSelector((state) => state.user);
    const company = useSelector(state => state.company)
    const roles = useSelector(state => state.roles)
    const agency = useSelector(state => state.agency)
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [isSkeleton, setIsSkeleton] = useState(true)
    const profile = useSelector(state => state.profile)
    const [isToggleLoader, setIsToggleLoader] = useState({
        id: '',
        email: false,
        portal: false,
        subscribe: false
    })
    const [page, setPage] = useState(0)
    useEffect(() => {
        if (!agency?.status && profile?.status) {
            dispatch(get_agency({ token, user: profile?.data?._id }))
        }
        if (user?.status) {
            setIsSkeleton(false)
        }
        if (!user?.status) {
            dispatch(get_user({ token }));
        }
        if (!company?.status) {
            dispatch(get_company({ token }))
        }
        if (!facility?.status) {

            dispatch(get_facility({ token }))
        }
        if (!roles?.status) {
            dispatch(get_roles({ token }))
        }
    }, [company, roles, facility, user, agency, profile]);

    useEffect(() => {
        const dataRows = user?.user_data?.map((it, key) => {
            return {
                id: user?.user_data?.length - key,
                name: `${it?.first_name} ${it?.last_name}`,
                company: it?.company?.name ? it?.company?.name : 'NA',
                roles: it?.roles[0]?.name ? it?.roles[0]?.name : "NA",
                email: it?.email ? it?.email : 'NA',
                portal: (
                    <div className="form-check form-switch d-flex justify-content-center">
                        <input
                            style={{ cursor: 'pointer' }}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            onChange={() => handalPortalAccess(it)}
                            id="flexSwitchCheckDefault"
                            checked={it?.portal_access}
                        />
                    </div>
                ),
                // mail_report: (
                //     <div className="form-check form-switch d-flex justify-content-center">
                //         <input
                //             style={{ cursor: 'pointer' }}
                //             className="form-check-input"
                //             type="checkbox"
                //             role="switch"
                //             onChange={() => enableMailReportChange(it)}
                //             id="flexSwitchCheckDefault"
                //             checked={it?.enabled_mail_report}
                //         />
                //     </div>
                // ),
                subscribe: (
                    <div className="form-check form-switch d-flex justify-content-center">
                        <input
                            style={{ cursor: 'pointer' }}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            onChange={() => handalSubscribe(it)}
                            id="flexSwitchCheckDefault"
                            checked={it?.is_subscriptable_text}
                        />
                    </div>
                ),
                action: (
                    <>
                        <button className="btn" onClick={() => handleModel(it)}>
                            <TbEdit />
                        </button>
                        {/* <button className="btn" onClick={() => handalDropUser(it)}>
                            <RiDeleteBin6Line />
                        </button> */}
                    </>
                ),
            }
        })
        setRows(dataRows?.reverse())
    }, [user?.user_data])

    const hadalChangeModal = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...FormData,
            [name]: value,
        });
    };

    // handal mail report 
    async function enableMailReportChange(data) {
        setLoading(true);
        try {
            const res = await axios.post(
                apis.ENABLED_MAIL_REPORT,
                {
                    userid: data?._id,
                    enabled_mail_report: !data?.enabled_mail_report,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setLoading(false);
            setIsToggleLoader({
                id: data?._id,
                email: true,
                portal: false,
                subscribe: false
            })
            dispatch(updateUserState({ _id: data?._id, field: 'enabled_mail_report' }));
        } catch (error) {
            setLoading(false);
        }
    };

    // handal portal access 
    async function handalPortalAccess(data) {
        setLoading(true);
        try {
            const res = await axios.put(
                apis.PORTAL_ACCESS,
                {
                    _id: data?._id,
                    portal_access: !data?.portal_access,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setLoading(false);
            setIsToggleLoader({
                id: data?._id,
                email: false,
                portal: true,
                subscribe: false
            })
            dispatch(updateUserState({ _id: data?._id, field: 'portal_access' }));
        } catch (error) {
            setLoading(false);
        }
    };

    // handal Subscribe  
    async function handalSubscribe(data) {
        setLoading(true);
        try {
            const res = await axios.put(
                apis.SUBSCRIPTABLE_TEXT,
                {
                    _id: data?._id,
                    is_subscriptable_text: !data?.is_subscriptable_text,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setLoading(false);
            setIsToggleLoader({
                id: data?._id,
                email: false,
                portal: false,
                subscribe: true
            })
            dispatch(updateUserState({ _id: data?._id, field: 'is_subscriptable_text' }));
        } catch (error) {
            setLoading(false);
        }
    };

    function handleModel(item) {
        setFormData(item);
        setUpdateModel(true);
    };

    // select input 
    const handleSelect = ({ name, value }) => {
        setFormData({
            ...FormData,
            [name]: value,
        });
    }

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const updatauser = await axios.put(
                apis.UPDATE_USER,
                {
                    Id: FormData?._id,
                    first_name: FormData?.first_name,
                    last_name: FormData?.last_name,
                    email: FormData?.email,
                    phone: FormData?.phone,
                    facility: FormData?.facility,
                    company: FormData?.company,
                    roles: FormData?.roles,
                    agency: FormData?.agency,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setUpdateModel(false);
            setLoading(false);
            toast.success("User Successfully updated..", {
                position: "top-right",
            });
            setTimeout(() => {
                dispatch(get_user({ token }));
            }, 2000)
        } catch (error) {
            if (error?.response?.data?.msg) {
                toast.error(error?.response?.data?.msg, {
                    position: "top-right",
                });
            } else {
                toast.error(error?.message, {
                    position: "top-right",
                });
            }
        } finally {
            setLoading(false);
        }
    };


    // drop user 
    async function handalDropUser(data) {
        try {
            const res = await axios.delete(
                `${apis.DROP_USER}/${data?._id}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            dispatch(get_user({ token }))
        } catch (error) {
            console.log(error)
        }
    }

    const filteredRows = [...rows]
        .filter(row => {
            const searchFields = [row.name, row.company, row.roles, row.email];
            return searchFields.some(field => field?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
        }).map((row, index) => ({
            ...row,
            id: index + 1,
        }));

    return (
        <>
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
            <EnhancedTable status={user?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />
            <Modal
                size="lg"
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="First Name"
                                value={FormData?.first_name}
                                onChange={hadalChangeModal}
                                name="first_name"
                            />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Last Name"
                                defaultValue={FormData?.last_name}
                                onChange={hadalChangeModal}
                                name="last_name"
                            />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Phone"
                                defaultValue={FormData?.phone}
                                onChange={hadalChangeModal}
                                name="phone"
                            />
                        </div>

                        <div className="col-md-8 mb-4 text-center">
                            <TextField
                                fullWidth
                                id="outlined-required"
                                label="Email"
                                defaultValue={FormData?.email}
                                onChange={hadalChangeModal}
                                name="email"
                            />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <SelectSingle data={company?.company_data} value={typeof FormData?.company == "string" ? FormData?.company : FormData?.company?._id} name="company" label="Company" handleChange={hadalChangeModal} />

                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <MultipleSelect data={facility?.facility_data} value={FormData?.facility} name="facility" label="Facility" handleChange={handleSelect} />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <MultipleSelect data={roles?.roles} value={FormData?.roles} name="roles" label="Roles" handleChange={handleSelect} />
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <MultipleSelect data={agency?.agency} value={FormData?.agency} name="agency" label="Agency" handleChange={handleSelect} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            Loading ? <button className="btn btn-success" type="button">Loading...</button> : <button className="btn btn-success" onClick={handleUpdate}>Update User</button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}