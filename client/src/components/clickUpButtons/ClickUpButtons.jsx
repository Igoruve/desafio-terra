import { useState, useRef } from "react";
import { editUserWorkSpace } from "../../utils/user";
import { editUser } from "../../utils/user";
import {AuthContext} from "../../context/AuthContext";
import { useContext } from "react";

function ClickUpButtons() {
  const [expanded, setExpanded] = useState(false);
  const formRef = useRef(null);
  const [workspaceId, setWorkspaceId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { userData } = useContext(AuthContext);

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
      await editUserWorkSpace({workspaceId});
      setExpanded(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateAPIKey = async (userData, apiKey) => {
    try{
      await editUser( userData.userId,{apiKey});
      setExpanded(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        className="bg-[var(--bg-color)] text-white px-12 py-6 rounded-[50px] hover:rounded-[8px] cursor-pointer transition-all 300ms ease-in-out text-2xl font-bold"
        onClick={() => setExpanded(!expanded)}
      >
        ClickUp!
      </button>

      {expanded && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="absolute flex flex-col bg-[#F7F8F4] px-6 py-4 shadow-md rounded-[30px] text-xl"
          >
            <label>Workspace ID:</label>
            <input
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              type="text"
              className="bg-white rounded-[30px] py-2 px-4 my-4 border border-black"
            />
            <button
              onClick={handleUpdateWorkspaceID}
              className="bg-[var(--bg-color)] rounded-[50px] hover:rounded-[8px] text-white px-4 py-2 cursor-pointer transition-all 300ms ease-in-out mb-8"
            >
              Update
            </button>
            <label>API Key:</label>
            <input
              type="text"
              className="bg-white rounded-[30px] py-2 px-4 my-4 border border-black"
              onChange={(e) => setApiKey(e.target.value)}
              value={apiKey}
            />
            <button
              className="bg-[var(--bg-color)] rounded-[50px] hover:rounded-[8px] text-white px-4 py-2 cursor-pointer transition-all 300ms ease-in-out"
              onClick={() => handleUpdateAPIKey(userData, apiKey)}
            >
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ClickUpButtons;
