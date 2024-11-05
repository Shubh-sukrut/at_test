import React, { useEffect, useState } from "react";
import Navbar2 from "../NavBar2";
import Adminaside from "../../components/asides/Adminaside";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { get_facility } from "../../redux/slice/facility";
import { apis } from "../../apis";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { get_agency } from "../../redux/slice/agency";
import AdminHeader from "../../components/comman/admin_header";
const CreateAgency = () => {
  // state for form data store
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const formInit = {
    name: "",
    Agency_Id: "",
    Contact_Email: "",
  }
  const [formData, setformData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState('')
  const [error, setError] = useState(formData)
  const [successToast, setSuccessToast] = useState(false);
  const [errToast, setErrToast] = useState(false);
  const token = Cookies.get("token");
  // Handle form input chage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let isError = false;
      let errorList = {}
      Object.keys(formData).map((it) => {
        if (formData[it] == '') {
          errorList[it] = `${it.split('_').join(' ')} is required!`
          setErrToast(true)
          isError = true
        }
      })
      setError(errorList)
      if (isError) {
        return
      }
      const response = await axios.post(apis.CREATE_AGENCY, { ...formData, Id: formData.Agency_Id, contactEmail: [formData.Contact_Email] }, { headers: { token } });
      setSuccessToast(true);
      setformData(formInit)
      dispatch(get_agency({ token }));
      setTimeout(() => {
        navigate('/admin/agency/dashboard')
      }, 3300)
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.msg) {
        setResError(error?.response?.data?.msg)
      } else {
        setResError(error?.message)
      }
    } finally {
      setLoading(false);
    }
  };

  const toastStyle = {
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
      toast.success("Agency Created Successfully", toastStyle);
      setSuccessToast(false)
    }
  }, [successToast]);

  useEffect(() => {
    if (errToast) {
      Object.values(error).map(it => {
        toast.error(it, toastStyle);
      })

      setTimeout(() => {
        setErrToast(false)
      }, 1000)
    }
  }, [errToast]);

  useEffect(() => {
    if (resError !== '') {
      toast.error(resError, toastStyle);
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
          <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/agency/dashboard" action="All Agencies" />
          <div className="create-user boder m-auto" style={{ width: '40%' }}>
            <form action="" onSubmit={loading ? () => { } : handleSubmit}>
              <h1 className="py-3 text-center">Create Agency</h1>
              <div className="container">
                <div className="row">
                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Name"
                      defaultValue={formData.name}
                      value={formData.name}
                      onChange={handleInputChange}
                      name="name"
                      fullWidth
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Agency ID"
                      defaultValue={formData.Agency_Id}
                      value={formData.Agency_Id}
                      onChange={handleInputChange}
                      name="Agency_Id"
                      fullWidth
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Contact Email"
                      defaultValue={formData.Contact_Email}
                      value={formData.Contact_Email}
                      onChange={handleInputChange}
                      name="Contact_Email"
                      fullWidth
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type={loading ? "button" : "submit"} className="btn btn-success">
                    {loading ? "Loading..." : "Create Agency"}
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

export default CreateAgency;
