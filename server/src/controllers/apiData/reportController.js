import fetch from "node-fetch";

const generateReport = async (reportData) => {
    try {
        const response = await fetch('http://dataterra:5000/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API error: ${errorData}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Flask API error: ", error.message);
        throw error;
    }
};

export default {
    generateReport
};