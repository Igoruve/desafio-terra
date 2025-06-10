import {
  getIssuesByDate,
  getIssuesByStatus,
  getIssuesByDevice,
} from "../../utils/issue";

import {
  getProjectsByDate,
  getProjectsByStatus,
  getProjectsByDevice,
} from "../../utils/project";

function Browser() {
  return (
    <section>
      <div className="border-3 border-white w-full rounded-[50px] text-xl py-3 px-8">
        <input type="text" placeholder="Search" />
      </div>
    </section>
  );
}

export default Browser;
