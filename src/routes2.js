import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import ELeaveTable from "views/examples/EmployeeView/ELeaveTable";
import EAttendanceTable from "views/examples/EmployeeView/EAttendanceTable";
import EPayrollTable from "views/examples/EmployeeView/EPayrollTable";

var routes2 = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/leave",
    name: "Leave",
    icon: "ni ni-user-run text-blue",
    component: <ELeaveTable />,
    layout: "/admin",
  },
  {
    path: "/attendance",
    name: "Attendance",
    icon: "ni ni-briefcase-24 text-purple",
    component: <EAttendanceTable />,
    layout: "/admin",
  },
  {
    path: "/payroll",
    name: "Payroll",
    icon: "ni ni-money-coins text-green",
    component: <EPayrollTable />,
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
export default routes2;
