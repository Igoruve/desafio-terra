import { useEffect, useState, useRef } from "react";
import { useLoaderData, useParams, useRevalidator } from "react-router-dom";

function Project() {
    const project = useLoaderData();    
    const { projectId } = useParams();
    const revalidator = useRevalidator();

return(
    <section>
        <div className="bg-white text-black w-10 h-10">Hola</div>
    </section>
)

}

export default Project;