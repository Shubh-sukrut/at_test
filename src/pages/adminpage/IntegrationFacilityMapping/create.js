import React, { useEffect, useState } from "react";
import Navbar2 from "../../NavBar2";
import Adminaside from "../../../components/asides/Adminaside";
import SelectSingle from "../../../components/input/Select";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { apis } from "../../../apis";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/comman/admin_header";
import { get_facility } from "../../../redux/slice/facility";
import { get_Integration_Facility_Mapping } from "../../../redux/slice/Integration-Facility-Mapping";
const CreateIntegrationFacilityMapping = () => {
  // state for form data store
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const facility = useSelector((state) => state?.facility);
  const formInit = {
    facility_name: '',
    facility_id: '',
    systemName: 'TouchPoint',
  };
  const [formData, setformData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState('')
  const [error, setError] = useState(formInit)
  const [errToast, setErrToast] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!facility?.status && !facility?.loading) {
      dispatch(get_facility({ token }));
    }
  }, [facility?.status]);

  // Handle form input chage
  const handalChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Regular expression for URL validation
    try {
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
      const response = await axios.post(apis.INTEGRATION_FACILITY_MAPPING, formData, {
        headers: { token },
      });
      setSuccessToast(true);
      setformData(formInit);
      setError(formInit)
      dispatch(get_Integration_Facility_Mapping({ token }));
      setTimeout(() => {
        navigate("/admin/integration-facility-mapping");
      }, 4000);
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
      toast.success("Integration Facility Mapping", toastVal);
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
          <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/integration-facility-mapping" action="All Integration Facility Mapping" />
          <div className="create-user boder m-auto" style={{ width: "40%" }}>
            <form action="" onSubmit={loading ? () => { } : handleSubmit}>
              <h1 className="py-3 text-center">Create Integration Facility Mapping</h1>
              <div className="container">
                <div className="row">
                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      fullWidth
                      label="Facility Name"
                      value={formData?.facility_name}
                      name="facility_name"
                      onChange={handalChange}
                    />
                  </div>
                  <div className="col col-12 mb-3">
                    <SelectSingle
                      data={facility?.facility_data}
                      value={
                        typeof formData?.facility_id == "string"
                          ? formData?.facility_id
                          : formData?.facility?._id
                      }
                      name="facility_id"
                      label="Facility"
                      handleChange={handalChange}
                    />
                  </div>
                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      fullWidth
                      label="SystemName"
                      value={"TouchPoint"}
                      name="systemName"
                      onChange={handalChange}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button type={loading ? "button" : "submit"} className="btn btn-success">{loading ? 'Loading...' : ' Create'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateIntegrationFacilityMapping;
