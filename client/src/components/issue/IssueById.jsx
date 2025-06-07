import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const formatDate = (dateObj) => {
  const raw = dateObj?.$date || dateObj;
  if (!raw) return "N/A";
  const date = new Date(raw);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

function IssueById() {
  const { issueId } = useParams(); // Obtener el id del issue de la url
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula cargar issues (aquí harías fetch a backend real)
  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      // Aquí debería ir tu llamada fetch para obtener issues de ese proyecto o issue
      // Por ejemplo:
      // const data = await fetch(`/api/issues/${issueId}`).then(res => res.json());
      // setIssues(data.issues);

      // Por ahora pongo dummy data para que pruebes la UI:
      setIssues([
        {
          issueId: issueId,
          issueType: "Bug",
          status: "Open",
          device: "Desktop",
          browser: "Chrome",
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }
    fetchIssues();
  }, [issueId]);

  if (loading) return <div>Cargando issues...</div>;
  if (!issues.length) return <div>No se encontraron issues.</div>;

  return (
    <section className="py-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          project
          <br />
          <span className="pl-24">issues</span>
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Manage your project issues</p>
        </div>
      </header>
      <main>
        <div className="space-y-4">
          {issues.map((issue, i) => (
            <div
              key={issue.issueId || i}
              className="bg-white p-4 rounded-[30px] shadow-sm  text-sm text-[var(--bg-color)] space-y-1"
            >
              <div className="grid grid-cols-[1fr_40px] gap-4">
                <div className="flex flex-wrap gap-2 text-lg">
                  <p className="font-bold">Type:</p>
                  <p>{issue.issueType || "N/A"}</p>
                  <p className="font-bold">Status:</p>
                  <p>{issue.status || "N/A"}</p>
                  <p className="font-bold">Device:</p>
                  <p>{issue.device || "N/A"}</p>
                  <p className="font-bold">Browser:</p>
                  <p>{issue.browser || "N/A"}</p>
                  <p className="text-[var(--bg-color)]">
                    Created: {formatDate(issue.createdAt)}
                  </p>
                </div>

                <div className="w-[40px] max-w-[40px] flex flex-col justify-between">
                  <img
                    src="/See.svg"
                    alt=""
                    className="cursor-pointer w-[24px] h-[24px]"
                    onClick={() => navigate(`/issue/${issue.issueId}`)}
                  />
                  {/* Aquí puedes agregar otros botones */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
}

export default IssueById;
