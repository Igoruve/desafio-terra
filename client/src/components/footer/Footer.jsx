function Footer() {
  return (
    <footer className="flex flex-col">
      <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-6 sm:mx-12 md:mx-16 lg:mx-24 mt-24 gap-12">
        <div className="flex flex-col justify-start gap-6">
          <h4
            className="text-white font-semibold text-left w-full max-w-[400px] 
            text-2xl sm:text-3xl md:text-4xl"
          >
            We’re excited to support you every step of the way.
          </h4>
          <p
            className="text-white text-left w-full max-w-[400px] 
            text-lg sm:text-xl md:text-2xl"
          >
            Track your project issues with Easy.
          </p>
          <a
            className="px-6 py-2 mt-8 text-lg sm:text-xl font-bold bg-white text-black w-fit rounded-[50px] hover:rounded-[8px] cursor-pointer transition-all 300ms ease-in-out"
            href=""
          >
            Let's Talk!
          </a>
        </div>

        <div className="flex flex-col justify-start items-center gap-6">
          <div className="flex flex-row gap-8">
            <a
              href="https://www.linkedin.com/company/terra-agency-hq/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Linkedin.svg"
                alt="Linkedin"
                className="h-8 w-8 filter brightness-0 invert cursor-pointer"
              />
            </a>
            <a
              href="https://x.com/terra_hq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Twitter.svg"
                alt="Twitter"
                className="h-8 w-8 filter brightness-0 invert cursor-pointer"
              />
            </a>
            <a
              href="https://www.instagram.com/terra.agency.hq/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Instagram.svg"
                alt="Instagram"
                className="h-8 w-8 filter brightness-0 invert cursor-pointer"
              />
            </a>
            <a
              href="https://www.facebook.com/terra.agency.hq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Facebook.svg"
                alt="Facebook"
                className="h-8 w-8 filter brightness-0 invert cursor-pointer"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-start items-center gap-2 text-white/80 text-left">
          <p className="w-full max-w-[400px] text-sm sm:text-base md:text-lg">
            <a
              href="mailto:hello@terrahq.com"
              className="underline hover:text-white"
            >
              hello@terrahq.com
            </a>
          </p>
          <p className="w-full max-w-[400px] text-sm sm:text-base md:text-lg">
            <a
              href="https://www.google.com/maps/search/?api=1&query=228+Park+Ave+S+New+York+NY+10003"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              228 Park Ave S New York, NY 10003
            </a>
          </p>
          <p className="w-full max-w-[400px] text-sm sm:text-base md:text-lg">
            <a className="underline hover:text-white" href="/privacy">
              Privacy Policy
            </a>
          </p>
        </div>
      </section>

      <section className="flex items-center justify-start w-full h-full gap-4 overflow-hidden px-4 mt-12">
        <img
          src="/Diana-Orange.svg"
          alt="Diana Orange"
          className="h-24 sm:h-32 md:h-48 lg:h-56 xl:h-64 2xl:h-96 object-contain -translate-x-1/2"
        />
        <h2
          className="leading-tight whitespace-nowrap
            text-[80px] sm:text-[120px] md:text-[200px] lg:text-[300px] xl:text-[400px] 2xl:text-[500px]"
          style={{ lineHeight: 1 }}
        >
          easy
        </h2>
      </section>
    </footer>
  );
}

export default Footer;
