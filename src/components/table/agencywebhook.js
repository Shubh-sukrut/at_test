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
import { get_agencywebhook } from "../../redux/slice/webhook";
import { get_agency } from "../../redux/slice/agency";
import EnhancedTable from "./EnhancedTable";

const columns = [
  { id: "id", label: "Sr No", isSort: true },
  { id: "agency", label: "Agency", isSort: true },
  { id: "dev_url", label: "Dev URL", isSort: true },
  { id: "prod_url", label: "Prod URL", isSort: true },
  { id: "functionName", label: "Function Name", isSort: true },
  { id: "token", label: "Token", isSort: false },
  { id: "action", label: "Action", align: "center", isSort: false },
];

export default function FacilityTable({ }) {
  const [updateModel, setUpdateModel] = useState(false);
  const [FormData, setFormData] = useState({});
  const agencywebhook = useSelector((state) => state.agencywebhook);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);
  const agency = useSelector((state) => state?.agency);
  const [loading, setLoading] = useState(false) // for update and delete action
  const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data\
  const [page, setPage] = useState(0)
  useEffect(() => {
    if (!agency?.status) {
      dispatch(get_agency({ token }));
    }
  }, [agency?.status]);

  useEffect(() => {
    if (!agencywebhook?.status) {
      dispatch(get_agencywebhook({ token }));
    } else {
      const dataRows = agencywebhook?.agencywebhook?.map((it, key) => {
        return {
          id: agencywebhook?.agencywebhook?.length - key,
          agency: it?.agency?.name,
          dev_url: it?.dev_url,
          prod_url: it?.prod_url,
          functionName: it?.functionName,
          token: it?.token,
          // zip: it?.zip ? it?.zip : 'NA',
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
  }, [agencywebhook]);

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
        apis.UPDATE_AGENCYWEBHOOK,
        {
          id: FormData._id,
          agency: FormData?.agency,
          dev_url: FormData?.dev_url,
          prod_url: FormData?.prod_url,
          functionName: FormData?.functionName,
          token: FormData?.token,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      setUpdateModel(false);
      toast.success("Agency Webhook Successfully updated..", {
        position: "top-right",
      });
      dispatch(get_agencywebhook({ token }));
    } catch (error) {
      toast.error("Agency Webhook update failed..", {
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
        `${apis.DELETE_AGENCYWEBHOOK}/${data?._id}`,
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success("Agency Webhook Successfully deleted..", {
        position: "top-right",
      });
      dispatch(get_agencywebhook({ token }));
    } catch (error) {
      toast.error("Agency Webhook Not deleted..", {
        position: "top-right",
      });
      console.log(error);
    }
  }

  const filteredRows = [...rows]
    .filter(row => {
      const searchFields = [row.agency, row.dev_url, row.prod_url, row.functionName, row.token];
      return searchFields.some(field => field?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    }).map((row, index) => ({
      ...row,
      id: index + 1,
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
      <EnhancedTable status={agencywebhook?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />
      <Modal
        size="lg"
        show={updateModel}
        onHide={() => setUpdateModel(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Agency Webhook
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4 mb-4 text-center">
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

            <div className="col-md-4 mb-4 text-center">
              <TextField
                id="outlined-required"
                fullWidth
                label="Dev_url"
                value={FormData?.dev_url}
                name="dev_url"
                onChange={handalChange}
              />
            </div>

            <div className="col-md-4 mb-4 text-center">
              <TextField
                id="outlined-required"
                fullWidth
                label="Prod_url"
                value={FormData?.prod_url}
                name="prod_url"
                onChange={handalChange}
              />
            </div>

            <div className="col-md-4 mb-4 text-center">
              <TextField
                id="outlined-required"
                fullWidth
                label="FunctionName"
                value={FormData?.functionName}
                name="functionName"
                onChange={handalChange}
              />
            </div>

            <div className="col-md-4 mb-4 text-center">
              <TextField
                id="outlined-required"
                fullWidth
                label="Token"
                value={FormData?.token}
                name="token"
                onChange={handalChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center container">
            {
              loading ? <Button variant="success">Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update Agency Webhook</Button>
            }
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
