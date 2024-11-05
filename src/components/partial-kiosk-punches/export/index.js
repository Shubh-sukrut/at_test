import React, { useEffect, useState } from 'react'
import { CiExport } from "react-icons/ci";
import { CSVLink } from "react-csv";
const ExportJSON = ({ data }) => {
    const [csvData, setCsvData] = useState([]);
    const [filename, setFileName] = useState("");
    const headers = [
        "ClassName",
        "FullName",
        "Email",
        "CheckInTime",
        "CheckOutTime",
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
                "CheckInTime": `${it?.startShift?.date} : ${it?.startShift?.time}`,
                "CheckOutTime": `${it?.endShift?.date} : ${it?.endShift?.time}`,
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
            const date = new Date().toLocaleDateString("fr-BE").split("/").join("-");
            const file = `${data[0].facility_id.name
                ?.split(" ")
                .join("_")}_${date}.csv`;
            setFileName(file);
            setCsvData(dataList);
        } else {
            setFileName([]);
            setCsvData("no-data.csv");
        }
    }, [data]);
    return (
        <CSVLink
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
    )
}

export default ExportJSON