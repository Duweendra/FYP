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
import { toast } from "react-toastify";
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
        if (Resuser.employee !== null) {
          userx.JobTitle = Resuser?.employee?.JobTitle ?? "";
          userx.EmployeeStatus = Resuser?.employee?.EmployeeStatus ?? "";
          userx.NIC = Resuser?.employee?.NIC ?? "";
          userx.Image = Resuser?.employee?.image ?? "";
        }
        console.log("response2", userx);
        setUser(userx);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    try {
      let id = auth?.newUser?._id;
      await axios.post(`/api/users/${id}`, user); // Send the updated user and employee data
      toast.info("User and employee details updated successfully!");
    } catch (err) {
      toast.error(`Error updating details: ${err.message}`);
    }
  };

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
                        style={{
                          height: "180px",
                          width: "180px",
                          objectFit: "cover",
                        }}
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

              <CardBody className="pt-md-8">
                <div className="text-center">
                  <h3>
                    {auth?.newUser?.name}
                    <span className="font-weight-light"></span>
                  </h3>

                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {auth?.newUser?.employee?.JobTitle} -{" "}
                    {auth?.newUser?.employee?.EmployeeStatus}
                  </div>
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
                              setUserDetails(e.target.value, "name");
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
                              setUserDetails(e.target.value, "email");
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
                              setUserDetails(e.target.value, "EmployeeStatus");
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
                              setUserDetails(e.target.value, "NIC");
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
                              setUserDetails(e.target.value, "JobTitle");
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
                    <Button
                      className="float-right"
                      onClick={() => handleSubmit()}
                    >
                      Update
                    </Button>
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
