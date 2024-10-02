// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useEffect, useState } from "react";
import axios from "api/axios";
import useAuth from "hooks/useAuth";

const loadUser = () => {
  return {
    _id: "",
    name: "",
    email: "",
    EmployeeStatus: "",
    NIC: "",
    Image: "",
    JobTitle: "",
  };
};

const Profile = () => {
  const { setAuth, auth } = useAuth();
  const [user, setUser] = useState(loadUser());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let id = auth?.newUser?._id;
        const response = await axios.get(`/api/users/${id}`);
        console.log("response", response.data);
        let Resuser = response.data;
        let userx = loadUser();
        userx._id = Resuser._id;
        userx.name = Resuser.name;
        userx.email = Resuser.email;
        userx.JobTitle = Resuser.employee.JobTitle;
        userx.EmployeeStatus = Resuser.employee.EmployeeStatus;
        userx.NIC = Resuser.employee.NIC;
        userx.Image = Resuser.employee.image;
        console.log("response2", userx);
        setUser(userx);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const setUserDetails = (e, state) => {
    setUser({ ...user, [state]: e });
  };

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container style={{ marginTop: "-450px" }} fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={
                          user.Image
                            ? `http://localhost:8000/${user.Image}`
                            : require("../../assets/img/theme/user.png")
                        }
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Connect
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">22</span>
                        <span className="description">Friends</span>
                      </div>
                      <div>
                        <span className="heading">10</span>
                        <span className="description">Photos</span>
                      </div>
                      <div>
                        <span className="heading">89</span>
                        <span className="description">Comments</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    Jessica Jones
                    <span className="font-weight-light">, 27</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    Bucharest, Romania
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    University of Computer Science
                  </div>
                  <hr className="my-4" />
                  <p>
                    Ryan — the name taken by Melbourne-raised, Brooklyn-based
                    Nick Murphy — writes, performs and records all of his own
                    music.
                  </p>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Show more
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.name}
                            id="input-username"
                            onChange={(e) => {
                              setUserDetails("name", e.target.value);
                            }}
                            placeholder="Username"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.email}
                            onChange={(e) => {
                              setUserDetails("email", e.target.value);
                            }}
                            placeholder="jesse@example.com"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Employee information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Employee Status
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.EmployeeStatus}
                            onChange={(e) => {
                              setUserDetails("EmployeeStatus", e.target.value);
                            }}
                            id="input-city"
                            placeholder="City"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            NIC
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.NIC}
                            onChange={(e) => {
                              setUserDetails("NIC", e.target.value);
                            }}
                            id="input-country"
                            placeholder="Country"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            JobTitle
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={user.JobTitle}
                            onChange={(e) => {
                              setUserDetails("JobTitle", e.target.value);
                            }}
                            id="input-postal-code"
                            placeholder="JobTitle"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
                <div className="pl-lg-4">
                  <Row>
                    <Button className="float-right">Edit</Button>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
