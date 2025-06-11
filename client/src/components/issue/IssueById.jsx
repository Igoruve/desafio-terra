import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIssueById } from "../../utils/issue";

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

const statusBorderColor = {
  "On Hold": "border-[#ffb410]",
  "In Progress": "border-[#3D9DD8]",
  Complete: "border-[#7ce55e]",
  "Post Launch": "border-[#B679F7]",
  "Needs Inputs": "border-[#F77241]",
  "Ready to upload": "border-[#3EE3EB]",
  "Duplicate Comment": "border-[#F78BD8]",
  "N/A": "border-[var(--bg-color)]",
};

function IssueById() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);

      const data = await getIssueById(issueId);
      setIssue(data);
      setLoading(false);
    }
    fetchIssues();
  }, [issueId]);

  if (loading) return <div>Loading issue...</div>;
  if (!issue) return <div>Issue not found.</div>;

  return (
    <section className="pt-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          project
          <br />
          <span className="pl-24">issue</span>
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Review your project issue</p>
        </div>
      </header>

      <main className="flex flex-col container py-12 items-center justify-center relative">
        <img
          src="/Back.svg"
          alt=""
          className="absolute top-4 left-4 sm:top-8 sm:left-8 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="bg-[#F7F8F4] p-8 rounded-[30px] shadow-sm w-full sm:max-w-[50%] sm:mx-4 mx-4">
          <div className="flex justify-between gap-6">
            <div className="flex-1">
              <p className="text-xl pb-6">
                Issue ID: {issue.issueId || issue._id || "N/A"}
              </p>
              <div className="flex flex-wrap gap-4 text-lg">
                <p
                  className={`border-3 w-fit rounded-[50px] px-4 py-2 ${
                    statusBorderColor[issue.status] ||
                    "border-[var(--bg-color)]"
                  }`}
                >
                  Status:{" "}
                  <span className="font-medium">{issue.status || "N/A"}</span>
                </p>
                <p className="border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                  Type:{" "}
                  <span className="font-medium">
                    {issue.issueType || "N/A"}
                  </span>
                </p>
                <p className="border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                  Device:{" "}
                  <span className="font-medium">{issue.device || "N/A"}</span>
                </p>
                <p className="border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                  Browser:{" "}
                  <span className="font-medium">{issue.browser || "N/A"}</span>
                </p>
                <p className="border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                  Created:{" "}
                  <span className="font-medium">
                    {formatDate(issue.createdAt)}
                  </span>
                </p>
                {issue.page && (
                  <div className="border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                    <a
                      href={
                        issue.page.startsWith("http://") ||
                        issue.page.startsWith("https://")
                          ? issue.page
                          : `https://${issue.page}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-words break-all max-w-xs sm:max-w-md"
                    >
                      {issue.page}
                    </a>
                  </div>
                )}

                {issue.screenshot && (
                  <div className="mt-4">
                    <img
                      src={issue.screenshot}
                      alt="Issue Screenshot"
                      className="rounded-lg max-w-full"
                    />
                  </div>
                )}
              </div>
              {issue.terraComments && (
                <>
                  <p className="pt-8 text-lg ">Terra Comments:</p>
                  <p className="pt-2 text-lg ">{issue.terraComments}</p>
                </>
              )}
              <p className="pt-8 text-lg ">Client Comment:</p>
              <p className="pt-2 text-lg ">{issue.clientComment}</p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default IssueById;
