import { useEffect, useState, useRef } from "react";
import { useLoaderData, useParams, useRevalidator } from "react-router-dom";

function Project() {
    const project = useLoaderData();    
    const { projectId } = useParams();
    const revalidator = useRevalidator();
    

return(
    <section className="flex flex-col items-center justify-center h-screen bg-gray-800">
        <div className="bg-white text-black w-fit h-fit"><p>{project.title}</p></div>
    </section>
)
}

export default Project;