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
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import ReactDatetimeClass from "react-datetime";

const loadDefaultEmployeeObj = () => {
  return {
    name: "",
    DOB: new Date(),
    Gender: "",
    JoinedDate: new Date(),
    EmployeeStatus: "",
    JobTitle: "",
    image: "",
  };
};

const Tables = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [predict, setPredict] = useState("");
  const [probability, setProbability] = useState("");
  const [pid, setPid] = useState("");
  const [note, setNote] = useState("");
  const [employee, setEmployee] = useState(loadDefaultEmployeeObj);
  const [errMsg, setErrMsg] = useState("");
  const [page, setpage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchScans = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `/api/employee?page=${page}&limit=${limit}`
      );
      setScans(response.data.employees);
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

  const handleRowClick = (scan) => {
    setSelectedImage(`http://localhost:8000/${scan.image}`);
    setShowModal(true);
    setEmployee({
      ...employee,
      name: scan.name,
      JobTitle: scan.JobTitle,
      EmployeeStatus: scan.EmployeeStatus,
      JoinedDate: scan.JoinedDate,
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
    formData.append("name", employee.name);
    formData.append("EmployeeStatus", employee.EmployeeStatus);
    formData.append("DOB", employee.DOB);
    formData.append("JobTitle", employee.JobTitle);
    formData.append("JoinedDate", employee.JoinedDate);
    formData.append("image", employee.image);
    console.log(employee.image);

    try {
      const response = await axios.post("/api/employee", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.info("Saving Successful");
      setEmployee(loadDefaultEmployeeObj);
      toggleModal();
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
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={`http://localhost:8000/${scan.image}`}
                            />
                          </a>
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
          className="modal-dialog-centered modal-danger"
          contentClassName="bg-gradient-primary"
          isOpen={showModal}
          toggle={toggleModal}
        >
          <div className="modal-header">
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
            <div className="center-content p-3">
              <h2>Add Employee</h2>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected Scan"
                  style={{ width: "200px", height: "auto" }}
                />
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    placeholder="Employee Full Name"
                    type="text"
                    value={employee.name}
                    onChange={(e) =>
                      setEmployee({ ...employee, name: e.target.value })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    color="info"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetimeClass
                    inputProps={{
                      placeholder: "Employee Joined Date",
                    }}
                    timeFormat={false}
                    value={employee.JoinedDate}
                    onChange={(date) =>
                      setEmployee({ ...employee, JoinedDate: date.toDate() })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    placeholder="Job Title"
                    type="text"
                    value={employee.JobTitle}
                    onChange={(e) =>
                      setEmployee({ ...employee, JobTitle: e.target.value })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    placeholder="Employee Status"
                    type="text"
                    value={employee.EmployeeStatus}
                    onChange={(e) =>
                      setEmployee({
                        ...employee,
                        EmployeeStatus: e.target.value,
                      })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <Button
                color="secondary"
                style={{ float: "right" }}
                type="submit"
              >
                Save
              </Button>
            </form>
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
