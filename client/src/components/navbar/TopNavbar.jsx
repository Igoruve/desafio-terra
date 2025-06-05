import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function TopNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex flex-row bg-[var(--bg-color)] border border-b-white h-16 w-full shadow-lg fixed top-0 z-50">
      <nav className="flex flex-row justify-between items-center w-full px-2 md:px-6 text-white/80 text-xl shadow-md">
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
                <path
                  class="cls-1"
                  d="m42.96,95.86c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.03,19.86-8.46,6.3-18.05,13.44-18.05,27.88s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z"
                />
                <path
                  class="cls-1"
                  d="m82.98,95.94c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.02,19.86-8.46,6.3-18.06,13.44-18.06,27.88s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z"
                />
                <path
                  class="cls-1"
                  d="m122.99,96.03c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.03,19.86-8.46,6.3-18.05,13.44-18.05,27.88s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z"
                />
                <path
                  class="cls-1"
                  d="m163.01,96.11c-7.53-5.6-14.03-10.44-14.03-19.87s6.5-14.26,14.03-19.86c8.46-6.3,18.05-13.44,18.05-27.88,0-2.76-2.24-5-5-5s-5,2.24-5,5c0,9.42-6.5,14.26-14.02,19.86-8.46,6.3-18.06,13.44-18.06,27.89s9.59,21.59,18.05,27.89c7.53,5.6,14.03,10.44,14.03,19.87s-6.5,14.26-14.03,19.87c-8.46,6.3-18.05,13.44-18.05,27.89,0,2.76,2.24,5,5,5s5-2.24,5-5c0-9.43,6.5-14.26,14.03-19.87,8.46-6.3,18.05-13.44,18.05-27.89s-9.59-21.59-18.05-27.89Z"
                />
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
          </div>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="hover:text-white hover:font-medium" to="/">
            Projects
          </Link>
          <Link className="hover:text-white hover:font-medium" to="/">
            FAQ
          </Link>
          <Link className="hover:text-white hover:font-medium" to="/">
            Profile
          </Link>
          <Link className="hover:text-white hover:font-medium" to="/logout">
            Log Out
          </Link>
        </div>

        <button
          className="md:hidden flex items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden absolute top-16 right-0 w-fit bg-[var(--bg-color)] text-white flex flex-col gap-4 px-6 py-4 items-end text-xl rounded-md">
          <Link to="/">Projects</Link>
          <Link to="/">FAQ</Link>
          <Link to="/">Profile</Link>
          <Link to="/logout">Log Out</Link>
        </div>
      )}
    </section>
  );
}

export default TopNavbar;
