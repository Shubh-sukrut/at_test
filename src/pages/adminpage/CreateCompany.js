import React, { useState, useEffect } from "react";
import NavBar2 from "../NavBar2";
import { apis } from "../../apis";
import axios from "axios";
import Cookies from "js-cookie";
import Adminaside from "../../components/asides/Adminaside";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { get_company } from "../../redux/slice/createcompany";
import AdminHeader from "../../components/comman/admin_header";
import { Col, Row } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const CreateCompany = () => {
  let token = Cookies.get("token");
  const navigate = useNavigate();

  // Initial form data state
  const formInit = {
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isAutumnTrack: false,  // Ensure it's initialized as false
  };

  // State definitions
  const [formData, setFormData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState("");
  const [error, setError] = useState(formData);
  const [successToast, setSuccessToast] = useState(false);
  const [errToast, setErrToast] = useState(false);
  const dispatch = useDispatch();


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle switch toggle
  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setFormData({ ...formData, isAutumnTrack: isChecked }); // Directly update formData's isAutumnTrack
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let isError = false;
      let errorList = {};

      Object.keys(formData).forEach((key) => {
        if (formData[key] === "") {
          errorList[key] = `${key} is required!`;
          setErrToast(true);
          isError = true;
        }
      });

      setError(errorList);

      if (isError) {
        return;
      }

      const headers = {
        token: token,formData
      };

      const res = await axios.post(apis.CREATE_COMPANY, formData, { headers });
      setSuccessToast(true);
      setFormData(formInit);
      dispatch(get_company({ token }));

      setTimeout(() => {
        navigate("/admin/company/dashboard");
      }, 4000);
    } catch (error) {
      setLoading(false);
      setResError(error?.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toast success and error messages
  useEffect(() => {
    if (successToast) {
      toast.success("Company Created Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [successToast]);

  useEffect(() => {
    if (errToast) {
      Object.values(error).forEach((message) => {
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      });

      setTimeout(() => {
        setErrToast(false);
      }, 1000);
    }
  }, [errToast]);

  useEffect(() => {
    if (resError !== "") {
      toast.error(resError, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [resError]);

  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-nav">
          <NavBar2 />
        </div>
        <div className="admin-container">
          <div className="aside text-center align-item-center">
            <Adminaside />
          </div>
          <AdminHeader
            backTitle="Dashboard"
            backPath="/admin"
            action_path="/admin/company/dashboard"
            action="All Companies"
          />
          <div className="create-user">
            <form onSubmit={handleSubmit}>
              <h1 className="text-center mb-3">Create Company</h1>
              <div className="container">
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      label="Name"
                      value={formData?.name}
                      onChange={handleInputChange}
                      name="name"
                      fullWidth
                      color={formData.name ? "success" : ""}
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      label="City"
                      value={formData?.city}
                      onChange={handleInputChange}
                      name="city"
                      fullWidth
                      color={formData.city ? "success" : ""}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className="py-2">
                    <TextField
                      label="Address"
                      value={formData?.address}
                      onChange={handleInputChange}
                      name="address"
                      fullWidth
                      color={formData.address ? "success" : ""}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      label="State"
                      value={formData?.state}
                      onChange={handleInputChange}
                      name="state"
                      fullWidth
                      color={formData.state ? "success" : ""}
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                    <TextField
                      label="Zip"
                      value={formData?.zip}
                      onChange={handleInputChange}
                      name="zip"
                      fullWidth
                      color={formData.zip ? "success" : ""}
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

                <div className="mt-2 d-flex justify-content-center">
                  <button type={loading ? "button" : "submit"} className="btn btn-success">
                    {loading ? "Loading..." : "Create Company"}
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

export default CreateCompany;
