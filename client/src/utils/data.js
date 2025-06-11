import FetchData from "./fetch.js";
import FetchAPIData from "./fetchAPIData.js";

export const postReport = async (issues) => {
    try {
        const data = await FetchData("/stats/report", "POST", issues); 
        return data;
    } catch (err) {
        console.error("Error sending report: ", err);
        throw err;
        }
    };


