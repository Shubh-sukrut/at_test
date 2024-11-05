import React from "react";
import { NavLink } from "react-router-dom";
import Adminaside from "../../components/asides/Adminaside";
import Navbar2 from "../NavBar2";
import RolesTable from "../../components/table/roles";

const Roledashboard = () => {
  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-nav">
          <Navbar2 />
        </div>
        {/* dashboard  */}
        <div className="admin-container ">
          {/* aside  */}
          <Adminaside />
          <div className="mt-3">
            <div className="px-5 py-3 d-flex justify-content-between align-items-center table-container4">
              <div className="d-flex align-items-center">
                <div className="text-dark" style={{ cursor: "pointer" }}>
                  <NavLink to={"/admin"} style={{ color: "black" }}>
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                  </NavLink>
                </div>
                <p className="admin-name-choose-sel rounded mb-0 mx-2 py-2 px-4">
                  Roles
                </p>
              </div>

              <div className="d-flex align-items-center">
                <NavLink to={"/admin/create-role"} style={{ color: "black", textDecoration: "None" }}>
                  <div className="text-dark" style={{ cursor: "pointer" }} ></div>
                  <p className="admin-name-choose-sel rounded mb-0 mx-2 py-2 px-4">
                    Create Role
                  </p>
                </NavLink>
              </div>
            </div>
            <div className="px-5 table-container">
              <div className="px-4 d-flex">
                <div className="py-2" style={{ width: '100%' }}>
                  <RolesTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Roledashboard;