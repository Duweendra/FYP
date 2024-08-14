import React, { useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import routes from "routes.js";
import useAuth from "hooks/useAuth";
import routes2 from "routes2.js";
import loaderGif from "../assets/gifs/Spinner@1x-1.0s-200px-200px (1).gif";
import "../assets/css/employee.css";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const { setAuth, auth } = useAuth();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [location]);

  const changeLoader = (loader) => {
    setIsLoading(loader);
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        const Component = prop.component;
        return <Route path={prop.path} element={Component} key={key} exact />;
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      {isLoading && (
        <div className="overlay">
          <img src={loaderGif} alt="Loading..." className="loader" />
        </div>
      )}
      <Sidebar
        {...props}
        routes={auth?.newUser?.isAdmin ? routes : routes2}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/dhrms png.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          // changeLoader={changeLoader}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(auth?.newUser?.isAdmin ? routes : routes2)}
          <Route
            path="*"
            //  changeLoader={changeLoader}
            element={<Navigate to="/admin/index" replace />}
          />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default Admin;
