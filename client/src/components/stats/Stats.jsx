import {postReport} from "../../utils/data";
import { getIssues } from "../../utils/issue";
import { useState } from "react";
import Plot from 'react-plotly.js';

function Stats() {

  const [graphs, setGraphs] = useState([]);

  const handleSendReport = async () => {
    try {
      const issues = await getIssues();
      console.log("Issues:", issues);
      const result = await postReport(issues);
      console.log("Result:", result);

      if (result?.graphs) {
        console.log("Graphs:", result.graphs);
        console.log("Data:", result.graphs[0].data);
        console.log("hola", typeof result.graphs[0]);
        setGraphs(result.graphs);
      } else {
        console.warn("No graphs found in the response.");
      }
    } catch (error) {
      console.error("Error sending report: ", error);
    }
  };

  return (
    <section className="flex flex-col bg-white pt-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          my
          <br />
          stats
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Manage your stats</p>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center h-full py-12 bg-white">
        <button
          className="bg-[var(--bg-color)] font-semibold cursor-pointer text-white px-6 py-2 rounded-[50px] hover:rounded-[8px] transition-all duration-300 ease-in-out text-2xl font-bold"
          onClick={handleSendReport}
        >
          Send report
        </button>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4">
          {graphs.map((graph, i) => (
            <Plot
              key={i}
              data={graph.data}
              layout={graph.layout || { title: `Graph ${i + 1}` }}
              style={{ width: "100%", height: "100%" }}
              config={{ responsive: true }}
            />
          ))}
        </div>
        
      </main>
    </section>
  );
}

export default Stats;
