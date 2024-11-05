import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { apis } from "../../apis";
import { Skeleton, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import SelectSingle from "../../components/input/Select";
import TableSection from "./table";
import { get_facilitywebhook } from "../../redux/slice/facility_webhook";
import { get_agency } from "../../redux/slice/agency";
import { get_facility } from "../../redux/slice/login";
import EnhancedTable from "./EnhancedTable";

const columns = [
  { id: "id", label: "Sr No", isSort: true },
  { id: "facility", label: "Facility", isSort: true },
  { id: "agency", label: "Agency", isSort: true },
  { id: "mapping_id", label: "Agency Database Id", isSort: true },
  { id: "action", label: "Action", align: "center", isSort: false },
];

export default function FacilityTable({ }) {
  const [updateModel, setUpdateModel] = useState(false);
  const [FormData, setFormData] = useState({});
  const facilitywebhook = useSelector((state) => state?.facilityWebHook);
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState([]);
  const agency = useSelector((state) => state?.agency);
  const facility = useSelector((state) => state?.facility);
  const [loading, setLoading] = useState(false) // for update and delete action
  const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data\
  const [page, setPage] = useState(0)
  useEffect(() => {
    if (!agency?.status) {
      dispatch(get_agency({ token }));
    }
    if (!facility?.status) {
      dispatch(get_facility({ token }));
    }

  }, [agency?.status, facility]);
  useEffect(() => {

  }, [facilitywebhook?.status]);
  useEffect(() => {
    if (!facilitywebhook?.status) {
      dispatch(get_facilitywebhook({ token }));
    } else {
      const dataRows = facilitywebhook?.facilitywebhook?.map((it, key) => {
        return {
          id: facilitywebhook?.facilitywebhook?.length - key,
          facility: it?.facility?.name,
          agency: it?.agency?.name,
          mapping_id: it?.mapping_id,
          action: (
            <>
              <button className="btn" onClick={() => handleModel(it)}>
                <TbEdit />
              </button>
              {/* <button className="btn" onClick={() => handalDrop(it)}>
                <RiDeleteBin6Line />
              </button> */}
            </>
          ),
        };
      });
      setRows(dataRows?.reverse());
      setIsSkeleton(false)
    }
  }, [facilitywebhook]);

  const handalChange = ({ target }) => {
    const { name, value } = target;
    setFormData({
      ...FormData,
      [name]: value,
    });
  };

  function handleModel(item) {
    setFormData(item);
    setUpdateModel(true);
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const updata = await axios.put(
        apis.UPDATE_FACILITYWEBHOOK,
        {
          id: FormData?._id,
          facility: typeof FormData?.facility == "string" ? FormData?.facility : FormData?.facility?._id,
          agency: typeof FormData?.agency == "string" ? FormData?.agency : FormData?.agency?._id,
          mapping_id: FormData?.mapping_id
        },
        {
          headers: {
            token: token,
          },
        }
      );
      setUpdateModel(false);
      toast.success("Facility-Agency Mapping Successfully updated..", {
        position: "top-right",
      });
      dispatch(get_facilitywebhook({ token }));
    } catch (error) {
      toast.error("Facility-Agency Mapping update failed..", {
        position: "top-right",
      });
    } finally {
      setLoading(false)
    }
  };

  // drop Company
  async function handalDrop(data) {
    try {
      const res = await axios.delete(
        `${apis.DELETE_FACILITYWEBHOOK}/${data?._id}`,
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success("Facility-Agency Mapping Successfully deleted..", {
        position: "top-right",
      });
      dispatch(get_facilitywebhook({ token }));
    } catch (error) {
      toast.error("Facility-Agency Mapping Not deleted..", {
        position: "top-right",
      });
      console.log(error);
    }
  }
  const filteredRows = [...rows]
    .filter(row => {
      const searchFields = [row.facility, row.agency, row.mapping_id];
      return searchFields.some(field => field?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    })
    .map((row, index) => ({
      ...row,
      id: index + 1, // Start the ID from 1
    }));

  return (
    <>
      {/* Search Input */}
      {
        isSkeleton ? <div className="d-flex justify-content-end">
          <Skeleton animation="wave" height={60} width={200} />
        </div> : <div className="container text-end mb-2">
          <TextField
            label="Search"
            type="search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setPage(0)
              setSearchQuery(e.target.value)
            }}
          />
        </div>
      }
      <EnhancedTable status={facilitywebhook?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />
      <Modal
        // size="lg"
        show={updateModel}
        onHide={() => setUpdateModel(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Facility-Agency Mapping
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 mb-4 text-center">
              <SelectSingle
                data={facility?.facility_data}
                value={
                  typeof FormData?.facility == "string"
                    ? FormData?.facility
                    : FormData?.facility?._id
                }
                name="facility"
                label="Facility"
                handleChange={handalChange}
              />
            </div>

            <div className="col-md-12 mb-4 text-center">
              <SelectSingle
                data={agency?.agency}
                value={
                  typeof FormData?.agency == "string"
                    ? FormData?.agency
                    : FormData?.agency?._id
                }
                name="agency"
                label="Agency"
                handleChange={handalChange}
              />
            </div>

            <div className="col-md-12 mb-4 text-center">
              <TextField
                id="outlined-required"
                fullWidth
                label="Mapping_id"
                value={FormData?.mapping_id}
                name="mapping_id"
                onChange={handalChange}
              />
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center container">
            <button className="btn btn-success" onClick={loading ? () => { } : handleUpdate}>{loading ? 'Loading...' : 'Update Facility-Agency Mapping'}</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
