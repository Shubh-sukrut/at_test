import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from '@mui/material';
// import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { apis } from "../../apis";
import { TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { get_roles } from "../../redux/slice/roles";
import MultipleSelect from "../input/MultipleSelect";
import SelectSingle from "../input/Select";
import { get_permissionSet } from "../../redux/slice/permissionSet";
import { get_company } from "../../redux/slice/createcompany";
// import TableSection from "./table";
import EnhancedTable from "./EnhancedTable";
const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'company', label: 'Company', align: 'center', isSort: true },
    { id: 'name', label: 'Name', isSort: true },
    { id: 'permissionSets', label: 'Permissions', isSort: false },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];


export default function PermissionSetsTable({ }) {
    const [updateModel, setUpdateModel] = useState(false);
    const [FormData, setFormData] = useState({});
    const roles = useSelector((state) => state?.roles);
    const [searchQuery, setSearchQuery] = useState('');
    const permissionSet = useSelector((state) => state?.permissionsSet);
    const company = useSelector((state) => state?.company);
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false) // for update and delete action
    const [page, setPage] = useState(0)

    useEffect(() => {
        if (!permissionSet?.status && !permissionSet?.loading) {
            dispatch(get_permissionSet({ token }))
        }
        if (!company?.status && !company?.loading) {
            dispatch(get_company({ token }));
        }
    }, [permissionSet?.status, company?.status]);


    useEffect(() => {
        if (!roles?.status && !roles.loading) {
            dispatch(get_roles({ token }));
        } else {
            const dataRows = roles?.roles?.map((it, key) => {
                return {
                    id: roles?.roles.length - key,
                    company: it?.company?.name,
                    name: it?.name,
                    permissionSets: <div>
                        {it?.permissionSets?.map((f) => (
                            <div>{f?.name?.split('_').join(" ")},</div>
                        ))}
                        align:
                    </div>,
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
            setRows(dataRows?.reverse())
        }
    }, [roles])

    const handalChange = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...FormData,
            [name]: value,
        });
    };


    // select permissionSet input 
    const handleSelect = ({ name, value }) => {
        setFormData({
            ...FormData,
            [name]: value,
        });
    }

    function handleModel(item) {
        setFormData(item);
        setUpdateModel(true);
    };

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const updata = await axios.put(
                apis.UPDATE_ROLE,
                {
                    id: FormData._id,
                    name: FormData?.name,
                    company: FormData?.company,
                    permissionSets: FormData.permissionSets,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setUpdateModel(false);
            toast.success("Role Updated Successfully", {
                position: "top-right",
            });
            setTimeout(() => {
                dispatch(get_roles({ token }));
            }, 3000)
        } catch (error) {
            setLoading(false)
            toast.error(error?.message, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };


    // drop Roles 
    async function handalDrop(data) {
        try {
            const res = await axios.delete(`${apis.DROP_ROLE}/${data?._id}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            toast.success("Role Deleted Successfully", {
                position: "top-right",
                autoClose: 5000,
            });
            setTimeout(() => {
                dispatch(get_roles({ token }));
            }, 3000)
        } catch (error) {
            toast.error(error?.message, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    }

    const filteredRows = [...rows].filter(row => {
        const searchFields = [row.company, row.name, row.permissionSets];
        return searchFields.some(field => field?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    }).map((row, index) => ({
        ...row,
        id: index + 1,
    }));


    return (
        <>
            {/* Search Input */}
            {
                !roles?.status ? <div className="d-flex justify-content-end">
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
            <EnhancedTable status={roles?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />

            <Modal
                // size="lg"
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered    
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Role
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="Name"
                                value={FormData?.name}
                                name="name"
                                onChange={handalChange}
                            />
                        </div>

                        <div className="col-md-12 mb-4 text-center">
                            <SelectSingle data={company?.company_data} value={typeof FormData?.company == "string" ? FormData?.company : FormData?.company?._id} name="company" label="Company" handleChange={handalChange} />
                        </div>
                        <div className="col-md-12 mb-4 text-center">
                            <MultipleSelect data={permissionSet?.permission} value={FormData?.permissionSets} name="permissionSets" label="PermissionSet" handleChange={handleSelect} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            loading ? <Button variant="success">Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update Role</Button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}