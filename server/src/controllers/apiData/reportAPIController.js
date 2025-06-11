import reportController from "./reportController.js";

const generateReport = async (req, res) => {
    try {
        const reportData = req.body;
        console.log(reportData)
        const data = await reportController.generateReport(reportData); 
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.error("Flask API error: ", error.message); 
        console.error(error);
        res.status(500).json({ error: "Error generating report" });
    }
};

export default {
    generateReport
};