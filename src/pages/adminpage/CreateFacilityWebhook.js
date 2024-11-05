import React, { useEffect, useState } from "react";
import Navbar2 from "../NavBar2";
import Adminaside from "../../components/asides/Adminaside";
import SelectSingle from "../../components/input/Select";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { apis } from "../../apis";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { get_agency } from "../../redux/slice/agency";
import { get_facilitywebhook } from "../../redux/slice/facility_webhook";
import { get_facility } from "../../redux/slice/login";
import AdminHeader from "../../components/comman/admin_header";
const CreateFacilityWebhook = () => {
  // state for form data store
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const agency = useSelector((state) => state?.agency);
  const facility = useSelector((state) => state?.facility);
  const formInit = {
    facility: "",
    agency: '',
    mapping_id: ""
  };
  const [formData, setformData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState('')
  const [error, setError] = useState(formInit)
  const [errToast, setErrToast] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!agency?.status && !agency?.loading) {
      dispatch(get_agency({ token }));
    }
    if (!facility?.status && !facility?.loading) {
      dispatch(get_facility({ token }));
    }
  }, [agency, facility]);

  // Handle form input chage
  const handalChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Regular expression for URL validation
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
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

      const response = await axios.post(apis.CREATE_FACILITYWEBHOOK, formData, {
        headers: { token },
      });
      setSuccessToast(true);
      setformData(formInit);
      setError(formInit)
      dispatch(get_facilitywebhook({ token }));
      setTimeout(() => {
        navigate("/admin/facilitywebhook/dashboard");
      }, 3300);
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
      toast.success("Facility Created Successfully", toastVal);
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
          <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/facilitywebhook/dashboard" action="All Facility Agency Mapping" />
          <div className="create-user boder m-auto" style={{ width: "40%" }}>
            <form action="" onSubmit={loading ? () => { } : handleSubmit}>
              <h1 className="py-3 text-center">Create Facility-Agency Mapping</h1>
              <div className="container">
                <div className="row">
                  <div className="col col-12 mb-3">
                    <SelectSingle
                      data={facility?.facility_data}
                      value={
                        typeof formData?.facility == "string"
                          ? formData?.facility
                          : formData?.facility?._id
                      }
                      name="facility"
                      label="Facility"
                      handleChange={handalChange}
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <SelectSingle
                      data={agency?.agency}
                      value={
                        typeof formData?.agency == "string"
                          ? formData?.agency
                          : formData?.agency?._id
                      }
                      name="agency"
                      label="Agency"
                      handleChange={handalChange}
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      fullWidth
                      label="Mapping Id"
                      value={formData?.mapping_id}
                      name="mapping_id"
                      onChange={handalChange}
                    />
                  </div>

                </div>

                <div className="d-flex justify-content-center">
                  <button type={loading ? "button" : "submit"} className="btn btn-success">{loading ? "Loading..." : " Create Facility-Agency Mapping"} </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFacilityWebhook;
