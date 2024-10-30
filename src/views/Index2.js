import { useEffect, useState } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import { chartOptions, parseOptions, chartExample1 } from "variables/charts.js";

import Header from "components/Headers/Header.js";
import axios from "api/axios";

const Index2 = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [dates, setDates] = useState();
  const [counts, setCounts] = useState();
  const [Adates, setADates] = useState();
  const [Acounts, setACounts] = useState();
  const [engagments, setEngagments] = useState();
  const [engagmentratios, setEngagmentratios] = useState();
  const [eRcounts, setREcounts] = useState();
  const [ecounts, setEcounts] = useState();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const employeeid = storedUser?.newUser?.employee?._id ?? -1;
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.post(
          `/api/reports/getleaves?employeeId=${employeeid}`
        );
        const labels = Object.keys(response.data.leaveCountByDay);
        const data = Object.values(response.data.leaveCountByDay);

        setDates(labels);
        setCounts(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAttendances = async () => {
      try {
        const response = await axios.post(
          `/api/reports/getattendances?employeeId=${employeeid}`
        );
        const labels = Object.keys(response.data.attendancePresenceByDay);
        const data = Object.values(response.data.attendancePresenceByDay);

        setADates(labels);
        setACounts(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchEngagement = async () => {
      try {
        const response = await axios.post(
          `/api/reports/getattendancerates?employeeId=${employeeid}`
        );
        const labels = Object.keys(response.data);
        const data = Object.values(response.data);
        console.log(response);
        setEngagments(labels);
        setEcounts(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchEngagementRatio = async () => {
      try {
        const response = await axios.post(
          `/api/reports/getattendanceratio?employeeId=${employeeid}`
        );
        const labels = Object.keys(response.data);
        const data = Object.values(response.data);
        console.log(response);
        setEngagmentratios(labels);
        setREcounts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLeaves();
    fetchAttendances();
    fetchEngagementRatio();
    fetchEngagement();
  }, []);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  // Colors
  var colors = {
    gray: {
      100: "#f6f9fc",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#8898aa",
      700: "#525f7f",
      800: "#32325d",
      900: "#212529",
    },
    theme: {
      default: "#172b4d",
      primary: "#5e72e4",
      secondary: "#f4f5f7",
      info: "#11cdef",
      success: "#2dce89",
      danger: "#f5365c",
      warning: "#fb6340",
    },
    black: "#12263F",
    white: "#FFFFFF",
    transparent: "transparent",
  };

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  let line = {
    options: {
      scales: {
        yAxes: [
          {
            gridLines: {
              color: colors.gray[900],
              zeroLineColor: colors.gray[900],
            },
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  return "" + value + "";
                }
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";

            if (data.datasets.length > 1) {
              content += label;
            }

            content += "" + yLabel + "";
            return content;
          },
        },
      },
    },
    data1: (canvas) => {
      return {
        labels: dates,
        datasets: [
          {
            label: "Performance",
            data: counts,
          },
        ],
      };
    },
    data2: (canvas) => {
      return {
        labels: Adates,
        datasets: [
          {
            label: "Performance",
            data: Acounts,
          },
        ],
      };
    },
  };

  let chartExample2 = {
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  //return '$' + value + 'k'
                  return value;
                }
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
            if (data.datasets.length > 1) {
              content += label;
            }
            content += yLabel;
            return content;
          },
        },
      },
    },
    data: {
      labels: engagments,
      datasets: [
        {
          label: "Engagements",
          data: ecounts,
          maxBarThickness: 10,
        },
      ],
    },
  };

  let chartexample3 = {
    data: {
      labels: engagmentratios,
      datasets: [
        {
          label: "My First Dataset",
          data: eRcounts,
          backgroundColor: [
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(255, 99, 132)",
          ],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      cutout: "50%", // Adjust this to control thickness (lower value makes it thicker)
    },
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">
                      {chartExample1Data === "data1"
                        ? "Leave Rate"
                        : "Attendance Rate"}
                    </h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Leave</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Attendance</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={line[chartExample1Data]}
                    options={line.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total Engagement Ratio</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total Engagement Hours</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Doughnut
                    data={chartexample3.data}
                    options={chartexample3.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index2;
