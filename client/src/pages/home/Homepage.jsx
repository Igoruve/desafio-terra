import { Link } from "react-router-dom";

function Homepage() {
  return (
    <section className="h-screen w-screen bg-[var(--bg-color)] text-white font-uncut flex flex-col justify-center">
      <div className="flex flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-end justify-end self-end">
          <svg
            id="Layer_1"
            data-name="Layer 1"
            fill="#3d9dd8"
            viewBox="0 0 200 200"
            height="64px"
            width="64px"
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
            height="64px"
            width="64px"
          >
            <path
              className="cls-1"
              d="m173.41,23.43c-2.76,0-5,2.24-5,5v126.63c0,7.36-5.99,13.35-13.35,13.35s-13.35-5.99-13.35-13.35V44.94c0-12.88-10.48-23.35-23.35-23.35s-23.35,10.48-23.35,23.35v110.11c0,7.36-5.99,13.35-13.35,13.35s-13.35-5.99-13.35-13.35V44.94c0-12.88-10.48-23.35-23.35-23.35s-23.35,10.48-23.35,23.35v126.63c0,2.76,2.24,5,5,5s5-2.24,5-5V44.94c0-7.36,5.99-13.35,13.35-13.35s13.35,5.99,13.35,13.35v110.11c0,12.88,10.48,23.35,23.35,23.35s23.35-10.48,23.35-23.35V44.94c0-7.36,5.99-13.35,13.35-13.35s13.35,5.99,13.35,13.35v110.11c0,12.88,10.48,23.35,23.35,23.35s23.35-10.48,23.35-23.35V28.43c0-2.76-2.24-5-5-5Z"
            />
          </svg>
        </div>
        <div className="flex flex-col h-full justify-between">
          <h1 className="text-start text-9xl">easy</h1>
          <h2 className="text-4xl ">
            by <span>terra</span>
          </h2>
        </div>
      </div>
      <div className="flex flex-row gap-8 justify-center items-center mt-32">
        <Link to="/login">
          <button className="w-32 text-white font-bold py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out">
            Log In
          </button>
        </Link>
        <Link to="/register">
          <button className="w-32 text-black font-bold py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] bg-white transition-all duration-300 ease-in-out">
            Register
          </button>
        </Link>
      </div>
    </section>
  );
}

export default Homepage;
