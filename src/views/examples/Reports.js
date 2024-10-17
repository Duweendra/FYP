import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../assets/css/reports.css";
import * as XLSX from "xlsx";
import { FaRegFilePdf } from "react-icons/fa6";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
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
import classNames from "classnames";
import { Nav } from "react-bootstrap";
import AttendanceTable from "./ReportTables/AttendanceTable";
import EmployeeTable from "./ReportTables/Employeetable";
import LeaveTable from "./ReportTables/LeaveTable";

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

const Reports = () => {
  const [scans, setScans] = useState([]);
  const [leaves, setLeaves] = useState([]); // Leave data
  const [attendances, setAttendances] = useState([]); // Attendance data
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
  const [activeTab, setActiveTab] = useState("leave"); // Set default tab

  const fetchPayrolls = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/payroll?page=${page}&limit=${limit}`
      );
      setScans(response?.data?.payrolls ?? []);
      setTotalPages(response?.data?.totalPayrolls ?? 1); // Assuming you have a state for total pages
      setCurrentPage(response?.data?.currentPage ?? 1); // Assuming you have a state for current page
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchAttendances = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/attendance?page=${page}&limit=${limit}`
      );
      setAttendances(response?.data?.attendances ?? []);
      setTotalPages(response?.data?.totalAttendances ?? 1); // Assuming you have a state for total pages
      setCurrentPage(response?.data?.currentPage ?? 1); // Assuming you have a state for current page
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchLeaves = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/leave?page=${page}&limit=${limit}`
      );
      setLeaves(response.data.leaves);
      setTotalPages(response.data.totalLeaves); // Assuming you have a state for total pages
      setCurrentPage(response.data.currentPage); // Assuming you have a state for current page
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
      console.log(employs);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    // fetchScans();
    fetchAttendances();
    fetchPayrolls();
    fetchLeaves();
    fetchEmployees();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (activeTab === "employee") {
      fetchEmployees(newPage);
    }
    if (activeTab === "leave") {
      fetchLeaves(newPage);
    }
    if (activeTab === "attendance") {
      fetchAttendances(newPage);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEmployee = (itm) => {
    setEmployee(itm);
    setPayroll({ ...payroll, employeeId: itm._id });
    console.log(itm);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab
  };

  const exportToExcel = () => {
    let datas = [];
    if (activeTab === "employee") {
      datas = employs;
    }
    if (activeTab === "leave") {
      datas = leaves;
    }
    if (activeTab === "attendance") {
      datas = attendances;
    }

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(scans);

    // Set custom column widths
    worksheet["!cols"] = [
      { wch: 25 }, // "Name" column width
      { wch: 20 }, // "Age" column width
      { wch: 20 }, // "City" column width
      { wch: 20 }, // "Name" column width
      { wch: 20 }, // "Age" column width
      { wch: 20 }, // "City" column width
      { wch: 20 }, // "Name" column width
      { wch: 20 }, // "Age" column width
      { wch: 20 }, // "City" column width
    ];
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Get current date and time
    const now = new Date();
    const date = now.toLocaleDateString("en-GB").replace(/\//g, "-"); // Format: dd-mm-yyyy
    const time = now.toLocaleTimeString("en-GB").replace(/:/g, "-"); // Format: hh-mm-ss

    // Dynamic filename: Name_Date_Time.xlsx
    const fileName = `Export_${date}_${time}.xlsx`;
    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <div className="TabMenu">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link onClick={() => handleTabClick("employee")}>
              Employee
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={() => handleTabClick("leave")}>Leave</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={() => handleTabClick("attendance")}>
              Attendance
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <Container className="ReportContainer" fluid>
        {/* Table */}

        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <label className="Reporthead mb-0">
                  {activeTab === "employee"
                    ? "Employee Reports"
                    : activeTab === "leave"
                    ? "Leave Reports"
                    : "Attendance Reports"}
                </label>
                <Button className="pdfbtn" onClick={() => exportToExcel()}>
                  <FaRegFilePdf style={{ fontSize: "17px" }} /> Pdf
                </Button>
                <Button className="excelbtn" onClick={() => exportToExcel()}>
                  <PiMicrosoftExcelLogoFill style={{ fontSize: "20px" }} />{" "}
                  Excel
                </Button>
              </CardHeader>

              {/* Conditionally render the table components */}
              {activeTab === "employee" && (
                <EmployeeTable scans={employs} formatDate={formatDate} />
              )}
              {activeTab === "leave" && (
                <LeaveTable scans={leaves} formatDate={formatDate} />
              )}
              {activeTab === "attendance" && (
                <AttendanceTable scans={attendances} formatDate={formatDate} />
              )}

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
      </Container>
    </>
  );
};

export default Reports;

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
