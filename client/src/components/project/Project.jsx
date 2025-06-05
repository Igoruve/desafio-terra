import { useEffect, useState, useRef } from "react";
import {
  useLoaderData,
  useParams,
  useRevalidator,
  Link,
} from "react-router-dom";

function Project() {
  const project = useLoaderData();

  return (
    <section className="flex flex-col items-center justify-start h-screen bg-[var(--bg-color)] pt-16">
      <div className="bg-white/80 text-black w-full h-fit px-8 py-4 my-4">
        <Link to="/issues">
          <p>{project.title}</p>
        </Link>
      </div>
    </section>
  );
}

export default Project;
