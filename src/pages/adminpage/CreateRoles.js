import React, { useEffect, useState } from "react";
import Navbar2 from "../NavBar2";
import Adminaside from "../../components/asides/Adminaside";
import SelectSingle from "../../components/input/Select";
import MultipleSelect from "../../components/input/MultipleSelect";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { get_company } from "../../redux/slice/createcompany";
import { get_permissionSet } from "../../redux/slice/permissionSet";
import { apis } from "../../apis";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { get_roles } from "../../redux/slice/roles";
import AdminHeader from "../../components/comman/admin_header";
const CreateRole = () => {
    // state for form data store
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const roles = useSelector((state) => state?.roles);
    const permissionSet = useSelector((state) => state?.permissionsSet);
    const company = useSelector((state) => state?.company);
    const formInit = {
        permissionSets: [],
        name: "",
        company: [],
    }
    const [formData, setformData] = useState(formInit);
    const [loading, setLoading] = useState(false);
    const [resError, setResError] = useState('')
    const [error, setError] = useState(formInit)
    const [successToast, setSuccessToast] = useState(false);
    const [errToast, setErrToast] = useState(false);
    const token = Cookies.get("token");

    useEffect(() => {
        if (!roles?.status && !roles?.loading) {
            dispatch(get_roles({ token }));
        }
        if (!permissionSet?.status && !permissionSet?.loading) {
            dispatch(get_permissionSet({ token }))
        }
        if (!company?.status && !company?.loading) {
            dispatch(get_company({ token }));
        }
    }, [roles, permissionSet, company, token, dispatch]);

    // select input 
    const handleSelect = ({ name, value }) => {
        setformData({
            ...formData,
            [name]: value,
        });
    }

    // Handle form input chage
    const handalChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let isError = false;
            let errorList = {}
            Object.keys(formData).map((it) => {
                if (formData[it] === '') {
                    errorList[it] = `${it.split('_').join(' ')} is required!`
                    setErrToast(true)
                    isError = true
                }
                return it
            })
            setError(errorList)
            if (isError) {
                return
            }

            await axios.post(apis.CREATE_ROLE, formData, { headers: { token } });
            setSuccessToast(true);
            setformData(formInit)
            setError(formInit)
            dispatch(get_roles({ token }));
            setTimeout(() => {
                navigate('/admin/role/dashboard')
            }, 3000)
        } catch (error) {
            setLoading(false);
            if (error?.response?.data?.message) {
                setResError(error?.response?.data?.message)
            } else {
                setResError(error?.message)
            }
        } finally {
            setLoading(false);
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
            toast.success("Role Created Successfully", toastVal);
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
            <div className="admin-dashboard">
                <div className="admin-nav">
                    <Navbar2 />
                </div>

                {/* dashboard  */}
                <div className="admin-container ">
                    {/* aside  */}
                    <div className="aside text-center align-item-center">
                        <Adminaside />
                    </div>
                    <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/role/dashboard" action="All Roles" />
                    <div className="create-user boder m-auto" style={{ width: '40%' }}>
                        <form action="" onSubmit={loading ? () => { } : handleSubmit}>
                            <h1 className="py-3 text-center">Create Role</h1>
                            <div className="container">
                                <div className="row">
                                    <div className="col col-12 mb-3">
                                        <TextField
                                            id="outlined-required"
                                            fullWidth
                                            label="Name"
                                            value={formData?.name}
                                            name="name"
                                            onChange={handalChange}
                                        />
                                    </div>

                                    <div className="col col-12 mb-3">
                                        <SelectSingle data={company?.company_data} value={typeof formData?.company == "string" ? formData?.company : formData?.company?._id} name="company" label="Company" handleChange={handalChange} />
                                    </div>

                                    <div className="col col-12 mb-3">
                                        <MultipleSelect data={permissionSet?.permission} value={formData?.permissionSets} name="permissionSets" label="PermissionSet" handleChange={handleSelect} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <button type={loading ? "button" : "submit"} className="btn btn-success">
                                        {loading ? "Loading..." : "Create Role"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateRole;
