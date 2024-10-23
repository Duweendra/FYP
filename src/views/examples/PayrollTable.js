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
  Col,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import ReactDatetimeClass from "react-datetime";

const loadDefaultEmployeeObj = () => {
  return {
    _id: -1,
    name: "",
    DOB: new Date(),
    Gender: "",
    JoinedDate: new Date(),
    EmployeeStatus: "",
    JobTitle: "",
    image: "",
  };
};

const loadDefaultPayrollObj = () => {
  return {
    _id: -1,
    employeeId: -1,
    payPeriodStart: new Date(),
    payPeriodEnd: new Date(),
  };
};

const PayrollTable = () => {
  const [scans, setScans] = useState([]);
  const [employs, setEmplos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [predict, setPredict] = useState("");
  const [probability, setProbability] = useState("");
  const [pid, setPid] = useState("");
  const [note, setNote] = useState("");
  const [employee, setEmployee] = useState(loadDefaultEmployeeObj);
  const [payroll, setPayroll] = useState(loadDefaultPayrollObj);
  const [errMsg, setErrMsg] = useState("");
  const [page, setpage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("Pending");

  const fetchScans = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/payroll?page=${page}&limit=${limit}`
      );
      setScans(response?.data?.payrolls ?? []);
      setTotalPages(response?.data?.totalPages ?? 1); // Assuming you have a state for total pages
      setCurrentPage(response?.data?.currentPage ?? 1); // Assuming you have a state for current page
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const fetchEmployees = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/?page=${page}&limit=${limit}`
      );
      setEmplos(response?.data?.employees ?? []);
      //setTotalPages(response?.data?.totalPages ?? 1); // Assuming you have a state for total pages
      //setCurrentPage(response?.data?.currentPage ?? 1); // Assuming you have a state for current page
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    // fetchScans();
    fetchScans();
    fetchEmployees();
  }, []);

  const handleRowClick = (scan) => {
    setSelectedImage(`http://localhost:8000/${scan.image}`);
    setShowModal(true);
    setEmployee({
      ...employee,
      _id: scan._id,
      name: scan.name,
      JobTitle: scan.JobTitle,
      EmployeeStatus: scan.EmployeeStatus,
      JoinedDate: scan.JoinedDate,
      image: selectedImage,
    });
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const openemployee = () => {
    setSelectedImage(null);
    setEmployee(loadDefaultEmployeeObj);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async (scan, e) => {
    try {
      console.log("payroll", payroll);
      const response = await axios.post("/api/employee/payroll", payroll, {
        headers: { "Content-Type": "application/json" },
      });
      if (response) {
        toast.info("Calculation Successful");
      }
      // fetchScans(currentPage);
      // setEmployee(loadDefaultEmployeeObj);
      // setPayroll(loadDefaultPayrollObj);
    } catch (err) {
      if (!err?.response) {
        console.log(err);
        setErrMsg("No Server Response");
        toast.error("No Server Response", err);
      } else if (err.response?.status === 400) {
        setErrMsg(err.message);
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
        setEmployee({ ...employee, image: file });
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

  const handleEmployee = (itm) => {
    setEmployee(itm);
    setPayroll({ ...payroll, employeeId: itm._id });
    console.log(itm);
  };

  const setPayrollDetails = (e, state) => {
    setPayroll({ ...payroll, [state]: e });
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Button className="addemployee" onClick={() => openemployee()}>
          +
        </Button>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Payroll</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">date</th>
                    <th scope="col">regularTime</th>
                    <th scope="col">extraTime</th>
                    <th scope="col">totalLeaveTime</th>
                    <th scope="col">totalTime</th>
                    <th scope="col">grossSalary</th>
                    <th scope="col">taxes</th>
                    <th scope="col">netSalary</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan._id}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <img
                            alt="..."
                            src={
                              scan.employee.image
                                ? `http://localhost:8000/${scan.employee.image}`
                                : require("../../assets/img/theme/user.png")
                            }
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%", // Makes the borders rounded
                              objectFit: "cover", // Ensures the image fills the container without overflow
                              marginRight: "20px",
                            }}
                          />

                          <Media>
                            <span className="mb-0 text-sm">
                              {scan.employee.name}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{formatDate(scan.createdAt)}</td>
                      <td>{parseFloat(scan.regularHours.toFixed(2))}</td>
                      <td>{parseFloat(scan.overtimeHours.toFixed(2))}</td>
                      <td>{scan.totalLeaveTime}</td>
                      <td>{parseFloat(scan.totalHours.toFixed(2))}</td>
                      <td>{parseFloat(scan.grossSalary.toFixed(2))}</td>
                      <td>{parseFloat(scan.taxes.toFixed(2))}</td>
                      <td>{parseFloat(scan.netSalary.toFixed(2))}</td>
                      <td>
                        {" "}
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="secondary">
                            {scan.status}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              value="Pending"
                              onClick={(e) => handleChange(e, scan)}
                            >
                              Pending
                            </DropdownItem>
                            <DropdownItem
                              value="Approved"
                              onClick={(e) => handleChange(e, scan)}
                            >
                              Approved
                            </DropdownItem>
                            <DropdownItem
                              value="Rejected"
                              onClick={(e) => handleChange(e, scan)}
                            >
                              Rejected
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
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
            <div className="center-content ">
              <h2>Calculate Payroll</h2>
            </div>
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
            <form>
              <FormGroup className="">
                <Row>
                  <Col sm="3">Employee</Col>
                  <Col sm="9">
                    <UncontrolledDropdown>
                      <DropdownToggle caret color="secondary">
                        {employee.name}
                      </DropdownToggle>
                      <DropdownMenu>
                        {employs.map((itm, idx) => (
                          <DropdownItem
                            key={itm._id}
                            value={itm.name}
                            onClick={() => handleEmployee(itm)}
                          >
                            {itm.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup>
                <Row>
                  <Col sm="3">From Date</Col>
                  <Col sm="9">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-calendar-grid-58" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <ReactDatetimeClass
                        inputProps={{
                          placeholder: "From Date",
                        }}
                        timeFormat={false}
                        value={payroll.payPeriodStart}
                        onChange={(date) =>
                          setPayrollDetails(date.toDate(), "payPeriodStart")
                        }
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm="3">To Date</Col>
                  <Col sm="9">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-calendar-grid-58" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <ReactDatetimeClass
                        inputProps={{
                          placeholder: "To Date",
                        }}
                        timeFormat={false}
                        value={payroll.payPeriodEnd}
                        onChange={(date) =>
                          setPayrollDetails(date.toDate(), "payPeriodEnd")
                        }
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </FormGroup>

              <Button
                color="secondary"
                style={{ float: "right" }}
                onClick={handleSubmit}
              >
                Calculate
              </Button>
            </form>
          </div>
        </Modal>
      </Container>
    </>
  );
};

export default PayrollTable;

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
