import axios from "../../api/axios";
import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/reports.css";
import * as XLSX from "xlsx";
import { FaRegFilePdf } from "react-icons/fa6";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Container,
  Row,
  Button,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { Nav } from "react-bootstrap";
import AttendanceTable from "./ReportTables/AttendanceTable";
import EmployeeTable from "./ReportTables/Employeetable";
import LeaveTable from "./ReportTables/LeaveTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [employee, setEmployee] = useState(loadDefaultEmployeeObj);
  const [payroll, setPayroll] = useState(loadDefaultPayrollObj);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("leave"); // Set default tab

  const EmployeeRef = useRef();
  const LeaveRef = useRef();
  const AttendanceRef = useRef();

  const fetchPayrolls = async (page = 1, limit = 5) => {
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

  const fetchAttendances = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/api/employee/attendance?page=${page}&limit=${limit}`
      );
      setAttendances(response?.data?.attendances ?? []);
      setTotalPages(response?.data?.totalPages ?? 1); // Assuming you have a state for total pages
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
      setTotalPages(response.data.totalPages); // Assuming you have a state for total pages
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
    let xname = "Employee_Report";
    if (activeTab === "employee") {
      datas = employs;
      xname = "Employee_Report";
    }
    if (activeTab === "leave") {
      datas = leaves;
      xname = "Leave_Report";
    }
    if (activeTab === "attendance") {
      datas = attendances;
      xname = "Attendance_Report";
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
    const fileName = `${xname}_${date}_${time}.xlsx`;
    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, fileName);
  };

  const exportToPDF = () => {
    let input = EmployeeRef.current; // Reference to the table
    let pdfname = "Employee_Report";
    if (activeTab === "employee") {
      input = EmployeeRef.current;
      pdfname = "Employee_Report";
    }
    if (activeTab === "leave") {
      input = LeaveRef.current;
      pdfname = "Leave_Report";
    }
    if (activeTab === "attendance") {
      input = AttendanceRef.current;
      pdfname = "Attendance_Report";
    }

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Create a new jsPDF document in landscape orientation, A4 size
      const pdf = new jsPDF("landscape", "mm", "a4");

      // Get the width and height of the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in landscape
      const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in landscape

      // Calculate the aspect ratio of the canvas to maintain proportions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const aspectRatio = canvasHeight / canvasWidth;

      // Calculate the height to fit the image into the PDF while keeping the aspect ratio
      const imgHeight = pdfWidth * aspectRatio;

      // Add the image to the PDF, keeping it at the top left corner (x: 0, y: 0)
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);

      // Get the current date and time for naming the file
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 10); // YYYY-MM-DD format
      const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, "-"); // HH-MM-SS format
      const finalFileName = `${pdfname}_${formattedDate}_${formattedTime}.pdf`;

      // Save the PDF
      pdf.save(finalFileName);
    });
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
                <Button className="pdfbtn" onClick={() => exportToPDF()}>
                  <FaRegFilePdf style={{ fontSize: "17px" }} /> Pdf
                </Button>
                <Button className="excelbtn" onClick={() => exportToExcel()}>
                  <PiMicrosoftExcelLogoFill style={{ fontSize: "20px" }} />{" "}
                  Excel
                </Button>
              </CardHeader>

              {/* Conditionally render the table components */}
              {activeTab === "employee" && (
                <EmployeeTable
                  scans={employs}
                  formatDate={formatDate}
                  EmployeeRef={EmployeeRef}
                />
              )}
              {activeTab === "leave" && (
                <LeaveTable
                  scans={leaves}
                  formatDate={formatDate}
                  LeaveRef={LeaveRef}
                />
              )}
              {activeTab === "attendance" && (
                <AttendanceTable
                  scans={attendances}
                  formatDate={formatDate}
                  AttendanceRef={AttendanceRef}
                />
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
