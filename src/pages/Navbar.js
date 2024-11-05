import React from "react";
import { BiSolidTime } from "react-icons/bi";
import Clock from "../asset/Vector (2).png";
const Navbar = () => {
  return (
    <>
      <div className="nav-main">
        <div className="nav-inner">
          {/* <BiSolidTime size={40} color="green" /> 
          <*/}
          <img src={Clock} />
          <span className="timetra-heading">
            <b>Time </b>Tracking
          </span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
