import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../assets/css/employee.css";
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
  TabPane,
  Col,
  CardBody,
  TabContent,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import ReactDatetimeClass from "react-datetime";
import Navspills from "views/examples/navpills";
import useAuth from "hooks/useAuth";

const loadDefaultLeaveObj = () => {
  return {
    id: -1,
    employeeId: -1,
    leaveType: "",
    startDate: new Date(),
    endDate: new Date(),
    reason: "",
  };
};

const LeaveTable = () => {
  const { setAuth, auth } = useAuth();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [predict, setPredict] = useState("");
  const [probability, setProbability] = useState("");
  const [pid, setPid] = useState("");
  const [note, setNote] = useState("");
  const [leave, setLeave] = useState(loadDefaultLeaveObj);
  const [errMsg, setErrMsg] = useState("");
  const [page, setpage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("Pending");

  const fetchScans = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/leave?page=${page}&limit=${limit}`
      );
      setScans(response.data.leaves);
      setTotalPages(response.data.totalLeaves); // Assuming you have a state for total pages
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

  const handleRowClick = (scan) => {
    setShowModal(true);
    setLeave({
      ...leave,
      id: scan._id,
      employeeId: scan.employeeId,
      leaveType: scan.leaveType,
      startDate: scan.startDate,
      endDate: scan.endDate,
      reason: scan.reason,
    });
  };

  /* const validateEmployee = (nav) => {
    console.log("nav", nav);
    console.log("employee", employee);
    if (nav === 1) {
      if (employee.name === "" || employee.name === null) {
        return false;
      } else if (employee.DOB == "" || employee.DOB === null) {
        return false;
      } else if (employee.Gender === "" || employee.Gender === null) {
        return false;
      } else if (
        employee.MaritalStatus === null ||
        employee.MaritalStatus === ""
      ) {
        return false;
      } else if (employee.NIC === null || employee.NIC === "") {
        return false;
      } else {
        return true;
      }
    } else if (nav === 2) {
      if (
        employee.ProbationEndDate === "" ||
        employee.ProbationEndDate === null
      ) {
        return false;
      } else if (
        employee.PermanencyDate === "" ||
        employee.PermanencyDate === null
      ) {
        return false;
      } else if (employee.JobTitle == null || employee.JobTitle === "") {
        return false;
      } else if (
        employee.EmployeeStatus == null ||
        employee.EmployeeStatus == ""
      ) {
        return false;
      } else {
        return true;
      }
    } else if (nav === 3) {
      if (employee.Manager === null || employee.Manager === "") {
        return false;
      } else {
        return true;
      }
    }
  }; */

  const setLeaveDetails = (e, state) => {
    setLeave({ ...leave, [state]: e });
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const openleave = () => {
    setLeave(loadDefaultLeaveObj);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async (scan, e) => {
    const leaveData = {
      id: leave.id,
      employeeId: auth?.newUser?._id,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      //status: e.target.value,
    };
    try {
      const response = await axios.post("/api/employee/leave", leaveData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.info("Saving Successful");
      fetchScans(currentPage);
      //setEmployee(loadDefaultEmployeeObj);
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
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setSelectedImage(base64Image);
        //   setEmployee({ ...employee, image: file });
        console.log("file", file);
      };
      reader.readAsDataURL(file);
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
          className="modal-dialog-centered"
          size="lg"
          style={{ height: "700px" }}
          isOpen={showModal}
          toggle={toggleModal}
        >
          <div className="modal-header">
            <h2>Leave Request</h2>
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
            <Card className="shadow">
              <CardBody>
                <form /* onSubmit={handleSubmit} */>
                  <FormGroup className="mb-3">
                    <Row>
                      <Col sm="3">Leave Type</Col>
                      <Col sm="9">
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="secondary">
                            {leave.leaveType}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              value="Medical"
                              onClick={(e) =>
                                setLeaveDetails(e.target.value, "leaveType")
                              }
                            >
                              Sick
                            </DropdownItem>
                            <DropdownItem
                              value="Matrinity"
                              onClick={(e) =>
                                setLeaveDetails(e.target.value, "leaveType")
                              }
                            >
                              Matrinity
                            </DropdownItem>
                            <DropdownItem
                              value="Other"
                              onClick={(e) =>
                                setLeaveDetails(e.target.value, "leaveType")
                              }
                            >
                              Other
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Leave Start Date</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-calendar-grid-58" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <ReactDatetimeClass
                            inputProps={{
                              placeholder: "Leave Start Date",
                            }}
                            timeFormat={false}
                            value={leave.startDate}
                            onChange={(date) =>
                              setLeaveDetails(date.toDate(), "startDate")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Leave End Date</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-calendar-grid-58" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <ReactDatetimeClass
                            inputProps={{
                              placeholder: "Leave End Date",
                            }}
                            timeFormat={false}
                            value={leave.startDate}
                            onChange={(date) =>
                              setLeaveDetails(date.toDate(), "endDate")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Reason</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Your Leave Reasons"
                            type="text"
                            value={leave.reason}
                            onChange={(e) =>
                              setLeaveDetails(e.target.value, "reason")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                </form>

                <Button
                  color="success"
                  style={{ float: "right" }}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </CardBody>
            </Card>
          </div>
        </Modal>
      </Container>
    </>
  );
};

export default LeaveTable;

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
