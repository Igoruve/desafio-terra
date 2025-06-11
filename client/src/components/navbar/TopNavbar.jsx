import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ClickUpButtons from "../clickUpButtons/ClickUpButtons";
import Browser from "../browser/Browser";
import { AuthContext } from "../../context/AuthContext";

function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const { userData } = useContext(AuthContext);

  return (
    <section className="flex flex-row bg-[var(--bg-color)] h-fit w-full fixed top-0 z-50">
      <nav className="flex flex-row justify-between items-center w-full px-2 md:px-12 py-4 text-white/80 text-xl">
        <Link to="/">
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex flex-col items-end self-center">
              <svg
                id="Layer_1"
                data-name="Layer 1"
                fill="#3d9dd8"
                viewBox="0 0 200 200"
                height="24px"
                width="24px"
              >
                <path d="m100,18.62c-44.88,0-81.38,36.51-81.38,81.38s36.51,81.38,81.38,81.38,81.38-36.51,81.38-81.38S144.88,18.62,100,18.62Zm0,152.77c-39.36,0-71.38-32.02-71.38-71.38S60.64,28.62,100,28.62s71.38,32.02,71.38,71.38-32.02,71.38-71.38,71.38Z" />
                <path d="m100,49.58c-27.8,0-50.42,22.62-50.42,50.42s22.62,50.42,50.42,50.42,50.42-22.62,50.42-50.42-22.62-50.42-50.42-50.42Zm0,90.84c-22.29,0-40.42-18.13-40.42-40.42s18.13-40.42,40.42-40.42,40.42,18.13,40.42,40.42-18.13,40.42-40.42,40.42Z" />
                <path d="m100,79.52c-11.29,0-20.48,9.19-20.48,20.48s9.19,20.48,20.48,20.48,20.48-9.19,20.48-20.48-9.19-20.48-20.48-20.48Zm0,30.97c-5.78,0-10.48-4.7-10.48-10.48s4.7-10.48,10.48-10.48,10.48,4.7,10.48,10.48-4.7,10.48-10.48,10.48Z" />
              </svg>

              <svg
                fill="#ffb41d"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 200 200"
                height="24px"
                width="24px"
              >
                <path d="m42.96,95.86c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.03,19.86-8.46,6.3-18.05,13.44-18.05,27.88s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z" />
                <path d="m82.98,95.94c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.02,19.86-8.46,6.3-18.06,13.44-18.06,27.88s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z" />
                <path d="m122.99,96.03c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.03,19.86-8.46,6.3-18.05,13.44-18.05,27.88s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z" />
                <path d="m163.01,96.11c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.02,19.86-8.46,6.3-18.06,13.44-18.06,27.89s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z" />
              </svg>
            </div>
            <div className="flex flex-col justify-center leading-none">
              <h1 className="text-start text-2xl font-black leading-tight">
                easy
              </h1>
              <h2 className="text-sm font-extralight leading-tight">
                by <span className="font-bold">terra</span>
              </h2>
            </div>
            <img className=" h-12 pl-2" src="/terraforms.gif" alt="" />
          </div>
        </Link>

        <div className="flex flex-row items-center gap-8">
          {userData?.role === "admin" && (
            <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center gap-12 relative w-full sm:w-auto sm:justify-end">
              {/* <Browser /> */}
              <ClickUpButtons />
            </div>
          )}

          <button
            className="text-[var(--bg-color)] bg-white px-8 py-3 min-w-[120px] text-center rounded-[50px] hover:rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer font-bold flex justify-center items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {!isOpen ? (
              "Menu!"
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28"
                viewBox="0 0 384 512"
                fill="currentColor"
                className="text-[var(--bg-color)]"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            )}
          </button>

          <a href="/profile">
            <img src="/Profile.svg" className="h-6" alt="Profile" />
          </a>
        </div>
      </nav>

      {isOpen && (
        <nav className="absolute top-18 right-0 w-full bg-[var(--bg-color)] font-bold text-white flex flex-col px-6 py-4 text-4xl text-center sm:text-6xl h-screen gap-6 items-center justify-center">
          <Link
            onClick={closeMenu}
            className="border-[5px] border-[#F96E43] px-12 py-3 h-fit w-full sm:max-w-[50%] rounded-[50px] hover:rounded-[8px] transition-all duration-300 ease-in-out"
            to="/projects"
          >
            projects
          </Link>
          <Link
            onClick={closeMenu}
            className=" border-[5px] border-[#7CE55E] px-12 py-3 h-fit w-full sm:max-w-[50%] rounded-[50px] hover:rounded-[8px] transition-all duration-300 ease-in-out "
            to="/faq"
          >
            FAQ
          </Link>
          <Link
            onClick={closeMenu}
            className=" border-[5px] border-[#3D9DD8] px-12 py-3 h-fit w-full sm:max-w-[50%] rounded-[50px] hover:rounded-[8px] transition-all duration-300 ease-in-out "
            to="/profile"
          >
            profile
          </Link>
          <Link
            onClick={closeMenu}
            className=" border-[5px] border-[#F78BD8] px-12 py-3 h-fit w-full sm:max-w-[50%] rounded-[50px] hover:rounded-[8px] transition-all duration-300 ease-in-out "
            to="/stats"
          >
            stats
          </Link>
          <Link
            onClick={closeMenu}
            className=" border-[5px] border-[#F78BD8] px-12 py-3 h-fit w-full sm:max-w-[50%] rounded-[50px] hover:rounded-[8px] transition-all duration-300 ease-in-out "
            to="/logout"
          >
            log out
          </Link>
          
        </nav>
      )}
    </section>
  );
}

export default TopNavbar;
