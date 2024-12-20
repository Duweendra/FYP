import React from "react";
import classnames from "classnames";
import "../../assets/css/employee.css";
// reactstrap components
import {
  Card,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  FormGroup,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import ReactDatetimeClass from "react-datetime";
import { toast } from "react-toastify";

class Navspills extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      circledNavPills: 1,
      IsHovered: false,
    };
  }
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
    });
  };

  PushNaves = (push) => {
    let nav = this.state.circledNavPills;
    let validate = this.props.validateEmployee;
    if (push === "next") {
      if (validate(nav)) {
        if (nav == 3) {
        } else {
          this.setState({ circledNavPills: nav + 1 });
        }
      } else {
        toast.warn("Please Fill required Feilds");
      }
    } else if (push === "prev") {
      if (nav !== 1) {
        this.setState({ circledNavPills: nav - 1 });
      }
    }
  };

  PushbuttonNaves = (push) => {
    let nav = this.state.circledNavPills;
    let validate = this.props.validateEmployee;
    if (push === "next") {
      if (validate(nav)) {
        if (nav == 3) {
        } else {
          this.setState({ circledNavPills: nav + 1 });
        }
      } else {
        toast.warn("Please Fill required Feilds");
      }
    } else if (push === "prev") {
      if (nav !== 1) {
        this.setState({ circledNavPills: nav - 1 });
      }
    }
  };

  handleImageClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  render() {
    const {
      selectedImage,
      employee,
      setEmployeeDetails,
      handleImageUpload,
      handleSubmit,
      validateEmployee,
    } = this.props;
    return (
      <>
        <div className="nav-wrapper">
          <Nav
            className="nav-pills-circle"
            style={{ justifyContent: "space-evenly", position: "relative" }}
            id="tabs_2"
            pills
            role="tablist"
          >
            <hr
              className="my-3"
              style={{
                position: "absolute",
                border: "0.5px solid rgb(119 139 255 / 22%)",
                width: "62%",
                top: "24%",
              }}
            />
            <NavItem style={{ zIndex: 1 }}>
              <NavLink
                aria-selected={this.state.circledNavPills === 1}
                className={classnames("rounded-circle", {
                  active: this.state.circledNavPills === 1,
                })}
                // onClick={(e) => this.toggleNavs(e, "circledNavPills", 1)}
                href="#pablo"
                role="tab"
              >
                <span className="nav-link-icon d-block">1</span>
              </NavLink>
            </NavItem>
            <NavItem style={{ zIndex: 1 }}>
              <NavLink
                aria-selected={this.state.circledNavPills === 2}
                className={classnames("rounded-circle", {
                  active: this.state.circledNavPills === 2,
                })}
                //onClick={(e) => this.toggleNavs(e, "circledNavPills", 2)}
                href="#pablo"
                role="tab"
              >
                <span className="nav-link-icon d-block">2</span>
              </NavLink>
            </NavItem>
            <NavItem style={{ zIndex: 1 }}>
              <NavLink
                aria-selected={this.state.circledNavPills === 3}
                className={classnames("rounded-circle", {
                  active: this.state.circledNavPills === 3,
                })}
                // onClick={(e) => this.toggleNavs(e, "circledNavPills", 3)}
                href="#pablo"
                role="tab"
              >
                <span className="nav-link-icon d-block">3</span>
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <Card className="shadow">
          <CardBody>
            <TabContent activeTab={"tabs" + this.state.circledNavPills}>
              <TabPane tabId="tabs1">
                <div
                  className="center-content p-3 imageblock"
                  onClick={this.handleImageClick}
                  style={{
                    display: "flex",

                    justifyContent: "center",
                  }}
                  onMouseEnter={() => this.setState({ IsHovered: true })}
                  onMouseLeave={() => this.setState({ IsHovered: false })}
                >
                  <div class="middle">
                    <img
                      src={
                        selectedImage
                          ? selectedImage
                          : require("../../assets/img/theme/user.png")
                      }
                      alt="Selected Scan"
                      className="profileimage"
                      style={{
                        width: "200px",
                        height: "200px",
                        cursor: "pointer",
                        borderRadius: "50%", // Makes the borders rounded
                        objectFit: "cover", // Ensures the image fills the container without overflow
                      }}
                    />{" "}
                    <div className="texty">Edit Profile Picture</div>
                  </div>
                </div>
                <form /* onSubmit={handleSubmit} */>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <input
                        color="info"
                        type="file"
                        accept="image/*"
                        ref={this.fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Row>
                      <Col sm="3">Name</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Employee Full Name"
                            type="text"
                            value={employee.name}
                            onChange={(e) =>
                              setEmployeeDetails(e.target.value, "name")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">DOB</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-calendar-grid-58" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <ReactDatetimeClass
                            inputProps={{
                              placeholder: "Employee Birthday",
                            }}
                            timeFormat={false}
                            value={employee.DOB}
                            onChange={(date) =>
                              setEmployeeDetails(date.toDate(), "DOB")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Gender</Col>
                      <Col sm="9">
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="secondary">
                            {employee.Gender}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              value="Female"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "Gender")
                              }
                            >
                              Female
                            </DropdownItem>
                            <DropdownItem
                              value="Male"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "Gender")
                              }
                            >
                              Male
                            </DropdownItem>
                            <DropdownItem
                              value="Non-Binary"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "Gender")
                              }
                            >
                              Non-Binary
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Marital Status</Col>
                      <Col sm="9">
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="secondary">
                            {employee.MaritalStatus}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              value="Married"
                              onClick={(e) =>
                                setEmployeeDetails(
                                  e.target.value,
                                  "MaritalStatus"
                                )
                              }
                            >
                              Married
                            </DropdownItem>
                            <DropdownItem
                              value="Single"
                              onClick={(e) =>
                                setEmployeeDetails(
                                  e.target.value,
                                  "MaritalStatus"
                                )
                              }
                            >
                              Single
                            </DropdownItem>
                            <DropdownItem
                              value="Other"
                              onClick={(e) =>
                                setEmployeeDetails(
                                  e.target.value,
                                  "MaritalStatus"
                                )
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
                      <Col sm="3">NIC</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="National Identity Card number"
                            type="text"
                            value={employee.NIC}
                            onChange={(e) =>
                              setEmployeeDetails(e.target.value, "NIC")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Email</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Email"
                            type="text"
                            value={employee.email}
                            onChange={(e) =>
                              setEmployeeDetails(e.target.value, "email")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Password</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Password"
                            type="password"
                            value={employee.password}
                            onChange={(e) =>
                              setEmployeeDetails(e.target.value, "password")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Is a Admin ?</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          {/*  <Input
                            placeholder="Password"
                            type="password"
                            value={employee.password}
                            onChange={(e) =>
                              setEmployeeDetails(e.target.value, "password")
                            }
                          /> */}
                          <label className="custom-toggle">
                            <input
                              type="checkbox"
                              value={employee.isAdmin}
                              onChange={(e) => {
                                setEmployeeDetails(
                                  !employee.isAdmin,
                                  "isAdmin"
                                );
                                console.log("admin", !employee.isAdmin);
                              }}
                            />
                            <span className="custom-toggle-slider rounded-circle" />
                          </label>
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                </form>
              </TabPane>
              <TabPane tabId="tabs2">
                <form /* onSubmit={handleSubmit} */>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Joined Date</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-calendar-grid-58" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <ReactDatetimeClass
                            inputProps={{
                              placeholder: "Date of Permanency",
                            }}
                            timeFormat={false}
                            value={employee.JoinedDate}
                            onChange={(date) =>
                              setEmployeeDetails(date.toDate(), "JoinedDate")
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Probation End Date</Col>
                      <Col sm="9">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-calendar-grid-58" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <ReactDatetimeClass
                            inputProps={{
                              placeholder: "Probation End Date",
                            }}
                            timeFormat={false}
                            value={employee.ProbationEndDate}
                            onChange={(date) =>
                              setEmployeeDetails(
                                date.toDate(),
                                "ProbationEndDate"
                              )
                            }
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup>
                    <Row>
                      <Col sm="3">Job Title</Col>
                      <Col sm="9">
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="secondary">
                            {employee.JobTitle}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              value="SE"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "JobTitle")
                              }
                            >
                              SE
                            </DropdownItem>
                            <DropdownItem
                              value="QA"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "JobTitle")
                              }
                            >
                              QA
                            </DropdownItem>
                            <DropdownItem
                              value="Manager"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "JobTitle")
                              }
                            >
                              Manager
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col sm="3">Employment Status</Col>
                      <Col sm="9">
                        <UncontrolledDropdown>
                          <DropdownToggle caret color="secondary">
                            {employee.EmployeeStatus}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              value="Freelance"
                              onClick={(e) =>
                                setEmployeeDetails(
                                  e.target.value,
                                  "EmployeeStatus"
                                )
                              }
                            >
                              Freelance
                            </DropdownItem>
                            <DropdownItem
                              value="Full-Time Contract"
                              onClick={(e) =>
                                setEmployeeDetails(
                                  e.target.value,
                                  "EmployeeStatus"
                                )
                              }
                            >
                              Full-Time Contract
                            </DropdownItem>
                            <DropdownItem
                              value="Part-Time Internship"
                              onClick={(e) =>
                                setEmployeeDetails(
                                  e.target.value,
                                  "EmployeeStatus"
                                )
                              }
                            >
                              Part-Time Internship
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                  </FormGroup>
                </form>
              </TabPane>
              <TabPane tabId="tabs3">
                <FormGroup>
                  <Row>
                    <Col sm="3">Manager</Col>
                    <Col sm="9">
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="secondary">
                          {employee.Manager}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            value="Manager1"
                            onClick={(e) =>
                              setEmployeeDetails(e.target.value, "Manager")
                            }
                          >
                            Manager1
                          </DropdownItem>
                          <DropdownItem
                            value="Manager2"
                            onClick={(e) =>
                              setEmployeeDetails(e.target.value, "Manager")
                            }
                          >
                            Manager2
                          </DropdownItem>
                          <DropdownItem
                            value="Manager3"
                            onClick={(e) =>
                              setEmployeeDetails(e.target.value, "Manager")
                            }
                          >
                            Manager3
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col sm="3">RFID ID</Col>
                    <Col sm="9">
                      <InputGroup className="input-group-alternative">
                        <Input
                          placeholder="RFID"
                          type="text"
                          value={employee.rfid}
                          onChange={(e) =>
                            setEmployeeDetails(e.target.value, "rfid")
                          }
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </FormGroup>
              </TabPane>
            </TabContent>
            <Button
              color="secondary"
              className={this.state.circledNavPills === 1 && "d-none"}
              style={{ float: "left" }}
              onClick={() => this.PushNaves("prev")}
            >
              Prev
            </Button>
            <Button
              color="secondary"
              className={this.state.circledNavPills === 3 && "d-none"}
              style={{ float: "right" }}
              onClick={() => this.PushNaves("next")}
            >
              Next
            </Button>
            <Button
              color="success"
              className={this.state.circledNavPills !== 3 && "d-none"}
              style={{ float: "right" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default Navspills;
