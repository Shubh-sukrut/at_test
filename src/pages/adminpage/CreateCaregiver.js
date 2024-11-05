import React, { useEffect, useState } from "react";
import Navbar2 from "../NavBar2";
import Adminaside from "../../components/asides/Adminaside";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { get_facility } from "../../redux/slice/facility";
import { apis } from "../../apis";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import MultipleSelect from "../../components/input/MultipleSelect";
import { TextField } from "@mui/material";
import { get_employee } from "../../redux/slice/employee";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/comman/admin_header";

const CreateCaregiver = () => {
  // state for form data store
  const facility = useSelector(state => state.facility)
  const profile = useSelector(state => state?.profile)
  const dispatch = useDispatch();
  const Navigate = useNavigate()
  const formInit = {
    first_name: "",
    last_name: "",
    phone: "",
    facility: [],
  }
  const [formData, setFormData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState('')
  const [error, setError] = useState(formInit)
  const [successToast, setSuccessToast] = useState(false);
  const [errToast, setErrToast] = useState(false);
  const token = Cookies.get("token");
  useEffect(() => {
    if (!facility?.status && !facility?.loading)
      dispatch(get_facility({ token }));
  }, [token]);

  // Handle form input chage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      const response = await axios.post(apis.CREATE_CAREGIVER, formData);
      setSuccessToast(true);
      dispatch(get_employee({ token, user: profile?.data?._id }));
      setFormData(formInit)
      setError(formInit)
      setTimeout(() => {
        Navigate('/admin/caregiver/dashboard')
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

  const handleSelect = ({ name, value }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const toastStyle = {
    position: "top-right",
    autoClose: 4000,
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
      toast.success("Caregiver Created Successfully", toastStyle);
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
          <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/caregiver/dashboard" action="All Caregivers" />
          <div className="create-user m-auto" style={{ width: '40%' }}>
            <form action="" onSubmit={loading ? () => { } : handleSubmit}>
              <h1 className="py-3 text-center">Create Caregiver</h1>
              <div className="container">
                <div className="row">
                  <div className="col col-12 mb-3">
                    <MultipleSelect data={facility?.facility_data} value={formData?.facility} name="facility" label="Facility" handleChange={handleSelect} />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="First Name"
                      defaultValue={formData.first_name}
                      value={formData.first_name}
                      onChange={handleInputChange}
                      name="first_name"
                      fullWidth
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Last Name"
                      defaultValue={formData.last_name}
                      value={formData.last_name}
                      onChange={handleInputChange}
                      name="last_name"
                      fullWidth
                    />
                  </div>
                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Phone"
                      defaultValue={formData.phone}
                      value={formData.phone}
                      onChange={handleInputChange}
                      name="phone"
                      fullWidth
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type={loading ? "button" : "submit"} className="btn btn-success">{loading ? 'Loading...' : 'Create Caregiver'} </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div >
    </>
  );
};

export default CreateCaregiver;
