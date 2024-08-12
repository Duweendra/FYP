import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import LeaveTable from "views/User/LeaveTable";
import AttendanceTable from "views/examples/AttendanceTable";
import PayrollTable from "views/examples/PayrollTable";

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
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
];
export default routes2;
