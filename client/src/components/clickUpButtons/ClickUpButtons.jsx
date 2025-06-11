import { useState, useRef } from "react";
import { editUserWorkSpace } from "../../utils/user";
import { editUser } from "../../utils/user";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function ClickUpButtons() {
  const [expanded, setExpanded] = useState(false);
  const formRef = useRef(null);
  const [workspaceId, setWorkspaceId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { userData } = useContext(AuthContext);
  const [hover, setHover] = useState(false);

  const handleOverlayClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setExpanded(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleUpdateWorkspaceID = async () => {
    try {
      await editUserWorkSpace({ workspaceId });
      setExpanded(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateAPIKey = async (userData, apiKey) => {
    try {
      await editUser(userData.userId, { apiKey });
      setExpanded(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <div className="relative flex flex-row items-end gap-2">
        {hover && (
          <div className="absolute top-full right-0 bg-white/80 backdrop-blur-md shadow-md rounded-[30px] p-4 text-[var(--bg-color)] w-[min(90vw,400px)] z-40 sm:w-[400px]">
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>How to link your ClickUp account with Easy?</li>
              <li>
                To get your Workspace ID, go to ClickUp in your browser and copy
                the number in the URL after https://app.clickup.com/.
              </li>
              <li>
                To get your API Key, open your profile, go to Settings, then
                select Apps from the left menu. On that page, click Generate to
                get your API Key.
              </li>
              <li>
                Finally, return to Easy and paste the Workspace ID and the API
                Key into the corresponding fields.
              </li>
            </ul>
          </div>
        )}

        <button
          className="bg-[var(--bg-color)] text-white px-8 py-3 rounded-[50px] hover:rounded-[8px] cursor-pointer transition-all 300ms ease-in-out text-xl font-bold border-3 border-white"
          onClick={() => setExpanded(!expanded)}
        >
          ClickUp!
        </button>
        <img
          src="/Question.svg"
          className="h-6 opacity-30 cursor-help"
          alt="Help"
          onClick={() => setHover(!hover)}
          onMouseEnter={() => window.innerWidth >= 640 && setHover(true)}
          onMouseLeave={() => window.innerWidth >= 640 && setHover(false)}
        />
      </div>

      {expanded && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-[var(--bg-color)]"
          onClick={handleOverlayClick}
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="absolute flex flex-col bg-[#F7F8F4] px-6 py-4 shadow-md rounded-[30px] text-xl"
          >
            <label>API Key:</label>
            <input
              type="text"
              className="bg-white rounded-[30px] py-2 px-4 my-4 border border-black"
              onChange={(e) => setApiKey(e.target.value)}
              value={apiKey}
            />
            <button
              className="bg-[var(--bg-color)] rounded-[50px] hover:rounded-[8px] text-white px-4 py-2 cursor-pointer transition-all 300ms ease-in-out mb-8"
              onClick={() => handleUpdateAPIKey(userData, apiKey)}
            >
              Update
            </button>
            <label>Workspace ID:</label>
            <input
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              type="text"
              className="bg-white rounded-[30px] py-2 px-4 my-4 border border-black"
            />
            <button
              onClick={handleUpdateWorkspaceID}
              className="bg-[var(--bg-color)] rounded-[50px] hover:rounded-[8px] text-white px-4 py-2 cursor-pointer transition-all 300ms ease-in-out "
            >
              Update
            </button>
            <a
              className="self-center underline pt-6"
              href="https://app.clickup.com/"
              target="_blank"
            >
              ClickUp
            </a>
          </form>
        </div>
      )}
    </div>
  );
}

export default ClickUpButtons;