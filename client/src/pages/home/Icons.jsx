function Icons() {
    const icons = [
      "Diana-Orange.svg",
      "Stanley-Pink.svg",
      "Gollum-Lime.svg",
      "Ebb-Red.svg",
      "Boba-Orange.svg",
      "Ebb-Lime.svg",
      "Boba-Blue.svg",
      "Mendia-Pink.svg",
      "Mistyk-Green.svg",
      "Melos-Red.svg",
      "Prismo-Blue.svg",
      "Mendia-Green.svg",
      "Stanley-Pink.svg",
      "Infinito-Lime.svg",
    ];
  
    return (
      <div className="flex flex-wrap justify-center items-center gap-2 p-2">
        {icons.map((icon, index) => (
          <img
            key={index}
            src={`/${icon}`}
            alt={icon}
            className={`
              w-12 sm:w-16 md:w-20 lg:w-24
              ${index >= 6 ? 'sm:block hidden' : 'block'}
            `}
          />
        ))}
      </div>
    );
  }
  
  export default Icons;  