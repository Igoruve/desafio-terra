/* import TopNavbar from "../navbar/TopNavbar";
import TopNavbar from "../navbar/TopNavbar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <footer className="bg-[var(--bg-color)] text-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout; */

import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import TopNavbar from "../navbar/TopNavbar";
/* import AsideNavbar from "../navbar/AsideNavbar";
 */
const Layout = () => {

    const { userData, loading } = useContext(AuthContext);
    if (!userData) {
        if (loading) {
            return <div>Loading...</div>; //TODO spinner
        } else {
            return <Navigate to="/login" />
        }
    }

return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout
