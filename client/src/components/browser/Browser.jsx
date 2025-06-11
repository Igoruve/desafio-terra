import {
  getIssuesByDate,
  getIssuesByStatus,
  getIssues,
} from "../../utils/issue";

import {
  getProjectsByDate,
  getProjectsByStatus,
  getProjects,
} from "../../utils/project";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

function Browser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [useDate, setUseDate] = useState(false);
  const [useStatus, setUseStatus] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjects();
      setProjects(projects);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      const issues = await getIssues();
      setIssues(issues);
    };
    fetchIssues();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjectsByDate();
      setProjects(projects);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      const issues = await getIssuesByDate();
      setIssues(issues);
    };
    fetchIssues();
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      let filteredProjects = [];
      let filteredIssues = [];

      if (useDate) {
        filteredProjects = await getProjectsByDate(searchTerm);
        filteredIssues = await getIssuesByDate(searchTerm);
      } else if (useStatus) {
        filteredProjects = await getProjectsByStatus(searchTerm);
        filteredIssues = await getIssuesByStatus(searchTerm);
      } else {
        // fallback a búsqueda básica
        filteredProjects = projects.filter((project) =>
          project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        filteredIssues = issues.filter((issue) =>
          issue.issueName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setResults([...filteredProjects, ...filteredIssues]);
    };

    if (searchTerm) {
      fetchFiltered();
    } else {
      setResults([]);
    }
  }, [searchTerm, useDate, useStatus]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (result) => {
    setSearchTerm("");
    setIsOpen(false);
    navigate(`/project/${result._id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <section>
      <div className="relative w-full">
        <div className="border-3 border-white w-full rounded-[50px] text-xl py-3 px-8">
          <div className="flex gap-4 mb-4">
            <label>
              <input
                type="checkbox"
                checked={useDate}
                onChange={() => setUseDate(!useDate)}
              />
              Filtrar por fecha
            </label>
            <label>
              <input
                type="checkbox"
                checked={useStatus}
                onChange={() => setUseStatus(!useStatus)}
              />
              Filtrar por estado
            </label>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full bg-transparent outline-none"
          />
        </div>
        {isOpen && results.length > 0 && (
          <ul className="absolute w-full bg-white text-black rounded shadow-md mt-2 z-10">
            {results.map((result) => (
              <li
                key={result._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onMouseDown={() => handleSelect(result)}
              >
                {result.projectName || result.issueName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Browser;
