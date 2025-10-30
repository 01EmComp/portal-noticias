import { useState } from "react";

// Components
import Chart from "./Chart";

// Css
import "./Statistics.css";

const Statistics = () => {
  const [tab, setTab] = useState("monthly-accesses");

  return (
    <div className="statistics-container">
      <div className="news-filters">
        <button
          className={tab === "monthly-accesses" ? "active" : ""}
          onClick={() => setTab("monthly-accesses")}
        >
          Acessos Men.
        </button>
        <button
          className={tab === "subscribers" ? "active" : ""}
          onClick={() => setTab("subscribers")}
        >
          Assinantes
        </button>
      </div>

      <div className="graph">
        <Chart tab={tab} />
      </div>
    </div>
  );
};

export default Statistics;
