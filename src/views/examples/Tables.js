import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../assets/css/employee.css";
import * as XLSX from "xlsx";
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
import Navspills from "./navpills";
import { validate } from "schema-utils";

const loadDefaultEmployeeObj = () => {
  return {
    _id: -1,
    name: "",
    DOB: new Date(),
    Gender: "Male",
    JoinedDate: new Date(),
    EmployeeStatus: "",
    JobTitle: "",
    image: "",
    PermanencyDate: new Date(),
    ProbationEndDate: new Date(),
    NIC: "",
    MaritalStatus: "Single",
    Manager: "",
    email: "",
    password: "",
    rfid: "",
    isAdmin: false,
  };
};

const Tables = (props) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [employee, setEmployee] = useState(loadDefaultEmployeeObj);
  const [errMsg, setErrMsg] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchScans = async (page = 1, limit = 5) => {
    try {
      // props.changeLoader(true);
      const response = await axios.get(
        `/api/employee?page=${page}&limit=${limit}`
      );
      setScans(response.data.employees);
      setTotalPages(response.data.totalPages); // Assuming you have a state for total pages
      setCurrentPage(response.data.currentPage); // Assuming you have a state for current page
      setLoading(false);
      //props.changeLoader(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchScans();
  }, []);

  const handleRowClick = (scan) => {
    setSelectedImage(`http://localhost:8000/${scan.image}`);
    setShowModal(true);
    setEmployee({
      ...employee,
      _id: scan._id,
      name: scan.name,
      NIC: scan.NIC,
      rfid: scan.rfid,
      isAdmin: scan.isAdmin,
      JobTitle: scan.JobTitle,
      EmployeeStatus: scan.EmployeeStatus,
      ProbationEndDate: scan.ProbationEndDate,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", employee._id);
    formData.append("name", employee.name);
    formData.append("EmployeeStatus", employee.EmployeeStatus);
    formData.append("DOB", employee.DOB);
    formData.append("NIC", employee.NIC);
    formData.append("rfid", employee.rfid);
    formData.append("JobTitle", employee.JobTitle);
    formData.append("JoinedDate", employee.JoinedDate);
    formData.append("ProbationEndDate", employee.ProbationEndDate);
    formData.append("password", employee.password);
    formData.append("email", employee.email);
    formData.append("image", employee.image);
    formData.append("isAdmin", employee.isAdmin);
    console.log(employee.image);

    try {
      // props.changeLoader(true);
      const response = await axios.post("/api/employee", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.info("Saving Successful");
      fetchScans(currentPage);
      setEmployee(loadDefaultEmployeeObj);
      toggleModal();
      //  props.changeLoader(false);
    } catch (err) {
      //   props.changeLoader(false);
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

  const setEmployeeDetails = (e, state) => {
    setEmployee({ ...employee, [state]: e });
  };

  const validateEmployee = (nav) => {
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
  };

  const exportToExcel = () => {
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
      <Container className="mt--7" fluid>
        <Button className="addemployee" onClick={() => openemployee()}>
          +
        </Button>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Employees</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Employee Id</th>
                    <th scope="col">Job Title</th>
                    <th scope="col">Employment Status</th>
                    <th scope="col">Sub Unit</th>
                    <th scope="col">Location</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan._id} onClick={() => handleRowClick(scan)}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <img
                            alt="..."
                            src={
                              scan.image
                                ? `http://localhost:8000/${scan.image}`
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
                            <span className="mb-0 text-sm">{scan.name}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>{scan.JobTitle}</td>
                      <td>{scan.EmployeeStatus}</td>
                      <td>{scan.EmployeeStatus}</td>
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
            <h2>Add Employee</h2>
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
            <Navspills
              employee={employee}
              handleSubmit={handleSubmit}
              setEmployeeDetails={setEmployeeDetails}
              selectedImage={selectedImage}
              handleImageUpload={handleImageUpload}
              validateEmployee={validateEmployee}
            />
          </div>
        </Modal>
      </Container>
    </>
  );
};

export default Tables;

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
