import TopNavbar from "../navbar/TopNavbar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../scrollTop/ScrollTop"; 

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar />
      <main className="flex-1 overflow-auto">
        <ScrollToTop />
        <Outlet />
      </main>
      <footer className="bg-[var(--bg-color)] text-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;