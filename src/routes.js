import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Tables from "views/examples/Tables.js";
import AttendanceTable from "views/examples/AttendanceTable";
import PayrollTable from "views/examples/PayrollTable";
import Reports from "views/examples/Reports";
import ELeaveTable from "views/examples/EmployeeView/ELeaveTable";
import LeaveTable from "views/examples/LeaveTable";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/employees",
    name: "Employee Management",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/leave",
    name: "Leave",
    icon: "ni ni-user-run text-blue",
    component: <LeaveTable />,
    layout: "/admin",
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: "ni ni-briefcase-24 text-purple",
    component: <AttendanceTable />,
    layout: "/admin",
  },
  {
    path: "/payroll",
    name: "Payroll",
    icon: "ni ni-money-coins text-green",
    component: <PayrollTable />,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "Reports",
    icon: "ni ni-single-copy-04 text-red",
    component: <Reports />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
];
export default routes;
