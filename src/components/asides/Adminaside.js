import React from "react";
import { NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { admin_dashboard_aside } from "../../static-data/admin_dashboard";
import { ImExit } from "react-icons/im";
const Adminaside = () => {
  return (
    <>
      <div className="aside text-center align-item-center">
        <div className="aside-child">
          <div className="aside-inner" >
            {admin_dashboard_aside?.map((item) => {
              return (
                <div className="aside-icon mt-4" key={item.title}>
                  <Tooltip title={item.title} placement="right">
                    <NavLink to={item.path} style={{ color: "white" }}>
                      {item?.icon}
                    </NavLink>
                  </Tooltip>
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", bottom: "10px", width: "100%" }}>
            <Tooltip title='Exit' placement="right">
              <NavLink
                to={"/dashboard"}
                style={{
                  fontSize: "30px",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                <ImExit />
              </NavLink>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminaside;
