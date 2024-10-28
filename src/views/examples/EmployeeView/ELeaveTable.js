import axios from "../../../api/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../../assets/css/employee.css";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  InputGroup,
  FormGroup,
  Input,
  Button,
  Modal,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import ReactDatetimeClass from "react-datetime";

const ELeaveTable = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const employeeid = storedUser?.newUser?.employee?._id ?? -1;

  const loadDefaultLeaveObj = () => {
    return {
      id: -1,
      employeeId: employeeid,
      leaveType: "",
      startDate: new Date(),
      endDate: new Date(),
      reason: "",
      // status: "Pending",
    };
  };
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [predict, setPredict] = useState("");
  const [probability, setProbability] = useState("");
  const [pid, setPid] = useState("");
  const [note, setNote] = useState("");
  const [leave, setleave] = useState(loadDefaultLeaveObj);
  const [errMsg, setErrMsg] = useState("");
  const [page, setpage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("Pending");

  const fetchScans = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/leave?page=${page}&limit=${limit}&employeeid=${employeeid}`
      );
      setScans(response.data.leaves);
      setTotalPages(response.data.totalPages); // Assuming you have a state for total pages
      setCurrentPage(response.data.currentPage); // Assuming you have a state for current page
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchScans();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const openleave = () => {
    setleave(loadDefaultLeaveObj);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const leavevaliation = () => {
    if (leave.reason.length > 0) {
      if (leave.leaveType.length > 0) {
        return true;
      } else {
        toast.warn("Please add Leave Type");
        return false;
      }
    } else {
      toast.warn("Please add Leave Reason");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (leavevaliation()) {
      try {
        const response = await axios.post("/api/employee/leave", leave, {
          headers: { "Content-Type": "application/json" },
        });
        toast.info("Leave Request Successful");
        fetchScans(currentPage);
        setleave(loadDefaultLeaveObj);
        setShowModal(false);
      } catch (err) {
        if (!err?.response) {
          console.log(err);
          setErrMsg("No Server Response");
          toast.error("No Server Response", err);
        } else if (err.response?.status === 400) {
          setErrMsg("Saving error");
          toast.error("Saving error", err);
        } else if (err.response?.status === 401) {
          setErrMsg("Unauthorized");
          toast.error("Unauthorized", err);
        } else {
          setErrMsg("Saving Failed");
          toast.error("Saving Failed", err);
        }
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    fetchScans(newPage);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChange = (e, scan) => {
    setStatus(e.target.value);
    handleSubmit(scan, e);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Button className="addemployee" onClick={() => openleave()}>
          +
        </Button>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Leaves</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Leave Type</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Reason</th>
                    <th scope="col">status</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan._id}>
                      <td>{scan.leaveType}</td>
                      <td>{formatDate(scan.startDate)}</td>
                      <td>{formatDate(scan.endDate)}</td>
                      <td>{scan.reason}</td>
                      <td>{scan.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>

        <Modal
          className="modal-dialog-centered modal-danger"
          contentClassName="bg-gradient-primary"
          isOpen={showModal}
          toggle={toggleModal}
        >
          <div className="modal-header">
            <h2 style={{ color: "white" }}>Leave Request</h2>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={toggleModal}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="center-content  pt-1"></div>
            <form>
              <FormGroup className="mb-3">
                <label style={{ fontSize: "14px" }}>Leave Reason</label>
                <InputGroup className="input-group-alternative">
                  <Input
                    placeholder="Leave Reason"
                    type="text"
                    value={leave.reason}
                    onChange={(e) =>
                      setleave({ ...leave, reason: e.target.value })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <label style={{ fontSize: "14px" }}>Leave Start Date</label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetimeClass
                    inputProps={{
                      placeholder: "Leave Start Day",
                    }}
                    timeFormat={false}
                    value={leave.startDate}
                    onChange={(date) =>
                      setleave({ ...leave, startDate: date.toDate() })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <label style={{ fontSize: "14px" }}>Leave End Date</label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetimeClass
                    inputProps={{
                      placeholder: "Leave Start Day",
                    }}
                    timeFormat={false}
                    value={leave.endDate}
                    onChange={(date) =>
                      setleave({ ...leave, endDate: date.toDate() })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <label style={{ fontSize: "14px" }}>Leave type</label>
                <InputGroup className="input-group-alternative">
                  <UncontrolledDropdown>
                    <DropdownToggle caret color="secondary">
                      {leave.leaveType}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        value="Matrinity"
                        onClick={(e) =>
                          setleave({ ...leave, leaveType: e.target.value })
                        }
                      >
                        Matrinity
                      </DropdownItem>
                      <DropdownItem
                        value="Other"
                        onClick={(e) =>
                          setleave({ ...leave, leaveType: e.target.value })
                        }
                      >
                        Other
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </InputGroup>
              </FormGroup>
              <Button
                color="secondary"
                style={{ float: "right" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </form>
          </div>
        </Modal>
      </Container>
    </>
  );
};

export default ELeaveTable;

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="pagination justify-content-end mb-0">
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) onPageChange(currentPage - 1);
          }}
          tabIndex="-1"
        >
          <i className="fas fa-angle-left" />
          <span className="sr-only">Previous</span>
        </PaginationLink>
      </PaginationItem>

      {pageNumbers.map((page1) => (
        <PaginationItem key={page1} active={page1 === currentPage}>
          <PaginationLink
            href="#pablo"
            onClick={(e) => {
              console.log("page", page1);
              onPageChange(page1);
            }}
          >
            {page1}
          </PaginationLink>
        </PaginationItem>
      ))}

      <PaginationItem disabled={currentPage === totalPages}>
        <PaginationLink
          href="#pablo"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) onPageChange(currentPage + 1);
          }}
        >
          <i className="fas fa-angle-right" />
          <span className="sr-only">Next</span>
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};
