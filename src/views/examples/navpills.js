import React from "react";
import classnames from "classnames";
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

class Navspills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circledNavPills: 3,
    };
  }
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
    });
  };
  render() {
    const { selectedImage, employee, setEmployeeDetails, handleImageUpload } =
      this.props;
    return (
      <>
        <div className="nav-wrapper">
          <Nav className="nav-pills-circle" id="tabs_2" pills role="tablist">
            <NavItem>
              <NavLink
                aria-selected={this.state.circledNavPills === 1}
                className={classnames("rounded-circle", {
                  active: this.state.circledNavPills === 1,
                })}
                onClick={(e) => this.toggleNavs(e, "circledNavPills", 1)}
                href="#pablo"
                role="tab"
              >
                <span className="nav-link-icon d-block">
                  <i className="ni ni-atom" />
                </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                aria-selected={this.state.circledNavPills === 2}
                className={classnames("rounded-circle", {
                  active: this.state.circledNavPills === 2,
                })}
                onClick={(e) => this.toggleNavs(e, "circledNavPills", 2)}
                href="#pablo"
                role="tab"
              >
                <span className="nav-link-icon d-block">
                  <i className="ni ni-chat-round" />
                </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                aria-selected={this.state.circledNavPills === 3}
                className={classnames("rounded-circle", {
                  active: this.state.circledNavPills === 3,
                })}
                onClick={(e) => this.toggleNavs(e, "circledNavPills", 3)}
                href="#pablo"
                role="tab"
              >
                <span className="nav-link-icon d-block">
                  <i className="ni ni-cloud-download-95" />
                </span>
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <Card className="shadow">
          <CardBody>
            <TabContent activeTab={"tabs" + this.state.circledNavPills}>
              <TabPane tabId="tabs1">
                <div className="center-content p-3">
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Selected Scan"
                      style={{ width: "200px", height: "auto" }}
                    />
                  )}
                </div>
                <form /* onSubmit={handleSubmit} */>
                  <FormGroup className="mb-3">
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
                          setEmployeeDetails(date.toDate(), "JoinedDate")
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
                          setEmployeeDetails(e.target.value, "JobTitle")
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
                          setEmployeeDetails(e.target.value, "EmployeeStatus")
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
              </TabPane>
              <TabPane tabId="tabs2">
                <form /* onSubmit={handleSubmit} */>
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
                      <Col sm="3">Permanency Date</Col>
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
                            value={employee.PermanencyDate}
                            onChange={(date) =>
                              setEmployeeDetails(
                                date.toDate(),
                                "PermanencyDate"
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
                              value="Pending"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "JobTitle")
                              }
                            >
                              Pending
                            </DropdownItem>
                            <DropdownItem
                              value="Approved"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "JobTitle")
                              }
                            >
                              Approved
                            </DropdownItem>
                            <DropdownItem
                              value="Rejected"
                              onClick={(e) =>
                                setEmployeeDetails(e.target.value, "JobTitle")
                              }
                            >
                              Rejected
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
                            {employee.EmploymentStatus}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              value="Freelance"
                              onClick={(e) =>
                                setEmployeeDetails(
                                  e.target.value,
                                  "EmploymentStatus"
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
                                  "EmploymentStatus"
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
                                  "EmploymentStatus"
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
                  <Button
                    color="secondary"
                    style={{ float: "right" }}
                    type="submit"
                  >
                    Save
                  </Button>
                </form>
              </TabPane>
              <TabPane tabId="tabs3">
                <p className="description">
                  Raw denim you probably haven't heard of them jean shorts
                  Austin. Nesciunt tofu stumptown aliqua, retro synth master
                  cleanse. Mustache cliche tempor, williamsburg carles vegan
                  helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher
                  synth.
                </p>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default Navspills;
