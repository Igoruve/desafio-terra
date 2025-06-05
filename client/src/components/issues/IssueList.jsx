import { useLoaderData, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

const IssueList = () => {
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const [search, setSearch] = useState("");


    return ()

}

export default IssueList;