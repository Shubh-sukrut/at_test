import React, { useEffect, useState } from "react";
import NavBar2 from "../NavBar2";
import { apis } from "../../apis";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { get_company } from "../../redux/slice/createcompany";
import Adminaside from "../../components/asides/Adminaside";
import { Bounce, toast } from "react-toastify";
import SelectSingle  from '../../components/input/Select'
import { useNavigate } from "react-router-dom";
import { get_facility } from '../../redux/slice/facility'
import timeZone from "../../static-data/timezone";
import AdminHeader from "../../components/comman/admin_header";
import { Col, Row } from "react-bootstrap";
import { get_twilio } from "../../redux/slice/createtwilio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
const CreateFacility = () => {
  const formInit = {
    name: "",
    company: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    timezone: "",
    locationId: "",
    twiliocredid: "",
    isAutumnTrack: false,
  }
  const navigate = useNavigate()
  const company = useSelector((state) => state.company);
  const twiliocredid = useSelector(state => state?.twilio) 
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState('')
  const [error, setError] = useState(formInit)
  const [successToast, setSuccessToast] = useState(false);
  const [errToast, setErrToast] = useState(false);
  let token = Cookies.get("token");
  useEffect(() => {
    if (!company?.status && !company?.loading) {
      dispatch(get_company({ token }));
    }
  }, [token, company]);

   // Handle switch toggle
   const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setFormData({ ...formData, isAutumnTrack: isChecked }); // Directly update formData's isAutumnTrack
  };

  useEffect(() => {
    if (!twiliocredid?.status && !twiliocredid?.loading) {
      dispatch(get_twilio({ token }));
    }
  }, [token, twiliocredid]);

  // Handle form input chage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handel onSumit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let isError = false;
      let errorList = {}
      Object.keys(formData).map((it) => {
        if (formData[it] == '') {
          errorList[it] = `${it} is required!`
          setErrToast(true)
          isError = true
        }
      })
      setError(errorList)
      if (isError) {
        return
      }
      let headers = {
        token: token,
      };
      const res = await axios.post(
        apis.CREATE_FACILITY,
        { ...formData },
        { headers }
      );
      setSuccessToast(true);
      dispatch(get_facility({ token }));
      setTimeout(() => {
        navigate('/admin/facility/dashboard')
      }, 1000)
    } catch (error) {
      setLoading(false);
      if (error?.message) {
        setResError(error?.message)
      } else {
        setResError(error?.response?.data?.msg)
      }
    } finally {
      setLoading(false);
    }
  };

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
      toast.success("Facility Created Successfully", toastStyle);
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
    }
  }, [resError]);

  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-nav">
          <NavBar2 />
        </div>

        {/* dashboard  */}
        <div className="admin-container ">
          {/* aside  */}
          <div className="aside text-center align-item-center">
            <Adminaside />
          </div>
          <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/facility/dashboard" action="All Facilities" />
          <div className="create-user boder m-auto" style={{ height: '77.3%' }}>
            <form action="" onSubmit={handleSubmit}>
              <h1 className="text-center">Create Facility</h1>
              <div className="container">
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <SelectSingle  data={company?.company_data} value={formData?.company} name="company" label="Company" handleChange={handleInputChange} />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      id="outlined-required"
                      label="Facility Name"
                      defaultValue={formData.name}
                      onChange={handleInputChange}
                      name="name"
                      fullWidth
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      id="outlined-required"
                      label="Phone"
                      defaultValue={formData.phone}
                      onChange={handleInputChange}
                      name="phone"
                      fullWidth
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <SelectSingle data={twiliocredid?.twilio_data} value={formData?.twiliocredid} name="twiliocredid" label="Select 
                     Twilio" handleChange={handleInputChange} />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      id="outlined-required"
                      label="City"
                      defaultValue={formData.city}
                      onChange={handleInputChange}
                      name="city"
                      fullWidth
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      id="outlined-required"
                      label="State"
                      defaultValue={formData.state}
                      onChange={handleInputChange}
                      name="state"
                      fullWidth
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      id="outlined-required"
                      label="Zip"
                      defaultValue={formData.zip}
                      onChange={handleInputChange}
                      name="zip"
                      fullWidth
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <SelectSingle data={timeZone} value={formData?.timezone} name="timezone" label="Timezone" handleChange={handleInputChange} />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      id="outlined-required"
                      label="Location Id"
                      defaultValue={formData.locationId}
                      onChange={handleInputChange}
                      name="locationId"
                      fullWidth
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      id="outlined-required"
                      label="Address"
                      defaultValue={formData.address}
                      onChange={handleInputChange}
                      name="address"
                      fullWidth
                    />
                  </Col>
                </Row>
                <div className="py-4 px-2 border rounded-2 d-flex justify-content-between align-items-center" style={{
                  color:"gray",
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
                            checked={formData.isAutumnTrack}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-2">
                  <button type={loading ? "button" : "submit"} className="btn btn-success">
                    {loading ? "Loading..." : "Create Facility"}
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

export default CreateFacility;
