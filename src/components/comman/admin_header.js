import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminHeader = ({ backPath, backTitle, action, action_path }) => {
    return (
        <div className="px-5 py-4 d-flex justify-content-between align-items-center table-container4">
            <div className="d-flex align-items-center">
                <div className="text-dark" style={{ cursor: "pointer" }}>
                    <NavLink to={backPath} style={{ color: "black" }}>
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </NavLink>
                </div>
                <p className="admin-name-choose-sel rounded mb-0 mx-2 py-2 px-4">
                    {backTitle}
                </p>
            </div>

            <div className="d-flex align-items-center">
                <NavLink to={action_path} style={{ color: "black", textDecoration: "None" }}>
                    <div className="text-dark" style={{ cursor: "pointer" }} ></div>
                    <p className="admin-name-choose-sel rounded mb-0 mx-2 py-2 px-4">
                        {action}
                    </p>
                </NavLink>
            </div>
        </div>
    )
}

export default AdminHeader