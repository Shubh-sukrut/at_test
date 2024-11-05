
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
import { get_twilio } from "../../redux/slice/createtwilio";


export default function CreateTwilioCreds() {
    let token = Cookies.get("token");
    const navigate = useNavigate();

    const formInit = {
        name: "",
        client_sid: "",
        client_auth_token: "",
        client_from_num: "",
        description: "",
    };
    const [formData, setFormData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState("");
  const [error, setError] = useState(formData);
  const [successToast, setSuccessToast] = useState(false);
  const [errToast, setErrToast] = useState(false);
  const dispatch = useDispatch();


  console.log("ffff", formData)
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
    
          const res = await axios.post(apis.TWILIO, formData, { headers });
          setSuccessToast(true);
          setFormData(formInit);
          dispatch(get_twilio({ token }))
    
          setTimeout(() => {
            navigate("/admin/twiliocreds")
          }, 4000);
        } catch (error) {
          setLoading(false);
          setResError(error?.response?.data?.msg || error.message);
        } finally {
          setLoading(false);
          setFormData(formInit);
        }
      };

      useEffect(() => {
        if (successToast) {
          toast.success("Twilio Created Successfully", {
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
          
          backPath="/admin"
          action_path="/admin/twiliocreds"
          action="All Twilio"
        />
        <div className="create-user">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center mb-3">Create Twilio</h1>
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
                    label="Client Sid"
                    value={formData?.city}
                    onChange={handleInputChange}
                    name="client_sid"
                    fullWidth
                    color={formData.city ? "success" : ""}
                  />
                </Col>
              </Row>
              <Row>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className="py-2">
                  <TextField
                    label="Client Auth Token"
                    value={formData?.address}
                    onChange={handleInputChange}
                    name="client_auth_token"
                    fullWidth
                    color={formData.address ? "success" : ""}
                  />
                </Col>
              </Row>
              <Row>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                  <TextField
                    label="Client From  Num"
                    value={formData?.state}
                    onChange={handleInputChange}
                    name="client_from_num"
                    fullWidth
                    color={formData.state ? "success" : ""}
                  />
                </Col>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-2">
                  <TextField
                    label="Description"
                    value={formData?.zip}
                    onChange={handleInputChange}
                    name="description"
                    fullWidth
                    color={formData.zip ? "success" : ""}
                  />
                </Col>
              </Row>

              <div className="mt-2 d-flex justify-content-center">
                <button type={loading ? "button" : "submit"} className="btn btn-success">
                  {loading ? "Loading..." : "Create Twilio"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
  )
}
