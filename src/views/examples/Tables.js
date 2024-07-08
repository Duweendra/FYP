import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
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

  const fetchScans = async () => {
    try {
      const response = await axios.get("/api/employee"); // Adjust the URL as necessary
      setScans(response.data);
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
    setNote(scan?.note);
    setPid(scan?.pid);
    setProbability(scan?.probability);
    setPredict(scan?.prediction);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const openemployee = () => {
    setEmployee(loadDefaultEmployeeObj);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const employeesave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", employee.name);
      formData.append("EmployeeStatus", employee.EmployeeStatus);
      formData.append("DOB", employee.DOB);
      formData.append("JobTitle", employee.JobTitle);
      formData.append("JoinedDate", employee.JoinedDate);
      formData.append("image", selectedImage);

      await axios.post("/api/employee", formData);
      console.log("Employee saved:", formData);
      fetchScans();
      setShowModal(false);
      setEmployee(loadDefaultEmployeeObj);
    } catch (error) {
      console.error("There was an error saving the employee data:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setSelectedImage(file);
        setEmployee({ ...employee, image: selectedImage });
      };
    }
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Button onClick={() => openemployee()}>Add Employee</Button>
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
                            <span className="mb-0 text-sm">{scan._id}</span>
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
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
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
            <form onSubmit={employeesave}>
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
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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
