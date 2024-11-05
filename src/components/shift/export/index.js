import React, { useEffect, useState } from 'react'
import { CiExport } from "react-icons/ci";
import { CSVLink } from "react-csv";
import { useSelector } from 'react-redux';

//function to get current date and time
function formatDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const formattedHours = String(hours).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}-${formattedHours}:${minutes}${ampm}`;
    return formattedDate;
}


const ExportJSON = ({ data }) => {
    const [csvData, setCsvData] = useState([]);
    const [filename, setFileName] = useState("");
    const all_csv_shifts = useSelector(state => state.all_csv_shifts);

    const headers = [
        "ClassName",
        "FullName",
        "Email",
        "CheckInTime(MM/DD/YYYY)",
        "CheckOutTime(MM/DD/YYYY)",
        "ManualCheckOutTime",
        "HoursInFacility",
        "Phone",
        "Address",
        "VisitType",
        "ResidentName",
        "RoomNumber",
        "KioskName",
        "Agency",
        "ShiftTime",
        "JobFunction",
        "Vendor",
        "Department",
        "Vaccination",
        "CheckInTemperature",
        "CheckOutTemperature",
        "MidShiftTemperatures",
        "Do you have fever or symptoms of a respiratory infection, such as a cough and sore throat?",
        "Have you traveled internationally within the last 14 days to restricted countries?",
        "Have you had contact with someone with known or suspected COVID-19?",
    ];
    useEffect(() => {
        const dataList = data?.map((it) => {
            return {
                "ClassName": it?.facility_id?.name,
                "FullName": `${it?.caregiver?.lastName} ${it?.caregiver?.firstName}`,
                "Email": "",
                "CheckInTime(MM/DD/YYYY)": `${it?.startShift?.date} : ${it?.startShift?.time}`,
                "CheckOutTime(MM/DD/YYYY)": `${it?.endShift?.date} : ${it?.endShift?.time}`,
                "ManualCheckOutTime": "",
                "HoursInFacility": `${it?.duration}`,
                "Phone": it?.caregiver?.phone,
                "Address": it?.facility_id?.address,
                "VisitType": "agency",
                "ResidentName": "",
                "RoomNumber": "",
                "KioskName": it?.facility_id?.name,
                "Agency": it?.agency?.name,
                "ShiftTime": "",
                "JobFunction": it?.position,
                "Vendor": "",
                "Department": "",
                "Vaccination": "",
                "CheckInTemperature": "",
                "CheckOutTemperature": "",
                "MidShiftTemperatures": "",
                "Do you have fever or symptoms of a respiratory infection, such as a cough and sore throat?": "",
                "Have you traveled internationally within the last 14 days to restricted countries?": "",
                "Have you had contact with someone with known or suspected COVID-19?": "",
            };
        });
        if (data?.length) {
            const date = formatDate();
            const file = `Report-${date}.csv`;
            setFileName(file);
            setCsvData(dataList);
        } else {
            setFileName([]);
            setCsvData("no-data.csv");
        }
    }, [data]);
    return (
      !all_csv_shifts.loading ?  <CSVLink
            data={csvData}
            headers={headers}
            filename={filename}
            style={{ textDecoration: "none" }}
        >
            <div className="date-fltr">
                <span className="">
                    <i className="px-2">
                        <CiExport />
                    </i>
                    Export
                </span>
            </div>
        </CSVLink> 
        :
        <div className="date-fltr">
                <span className="">
                    Loading...
                </span>
            </div>
    )
}

export default ExportJSON