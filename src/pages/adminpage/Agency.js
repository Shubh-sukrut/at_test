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
const CreateAgency = () => {
  // state for form data store
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const formInit = {
    name: "",
    Id: "",
    contactEmail: "",
  }
  const [formData, setformData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')
  const [successToast, setSuccessToast] = useState(false);
  const token = Cookies.get("token");
  useEffect(() => {
    dispatch(get_facility({ token }));
  }, [token]);

  // Handle form input chage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData?.contactEmail && formData?.name && formData?.Id) {
      setLoading(true);
      try {
        const response = await axios.post(apis.CREATE_AGENCY, { ...formData, contactEmail: [formData.contactEmail] }, { headers: { token } });
        setSuccessToast(true);
        setformData(formInit)
        dispatch(get_agency({ token }));
        setTimeout(() => {
          navigate('/admin/agency/dashboard')
        }, 4000)
      } catch (error) {
        setError(error?.response?.data?.message)
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("all fields are required", {
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
  };

  useEffect(() => {
    if (successToast) {
      toast.success("Caregiver Created Successfully", {
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
    if (error) {
      console.log(error)
      toast.error(error, {
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
  }, [error, successToast]);

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
          <div className="create-user boder m-auto" style={{ width: '40%' }}>
            <form action="" onSubmit={handleSubmit}>
              <h1 className="py-3 text-center">Create Agency</h1>
              <div className="container">
                <div className="row">
                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Name"
                      defaultValue={formData.name}
                      onChange={handleInputChange}
                      name="name"
                      fullWidth
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Agency ID"
                      defaultValue={formData.Id}
                      onChange={handleInputChange}
                      name="Id"
                      fullWidth
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      label="Contact Email"
                      defaultValue={formData.contactEmail}
                      onChange={handleInputChange}
                      name="contactEmail"
                      fullWidth
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-dark">
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
