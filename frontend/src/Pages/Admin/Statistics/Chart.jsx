import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Datas
const dataAccesses = [
  { mes: "Jan", Acessos: 400 },
  { mes: "Fev", Acessos: 350 },
  { mes: "Mar", Acessos: 300 },
  { mes: "Abr", Acessos: 250 },
  { mes: "Mai", Acessos: 200 },
  { mes: "Jun", Acessos: 1540 },
];

const dataSubscribers = [
  { tipo: "Free", value: 240 },
  { tipo: "Premium", value: 120 },
  { tipo: "Empresarial", value: 60 },
];

const colors = ["#8884d8", "#82ca9d", "#ffc658"];

const Chart = ({ tab }) => {
  if (tab === "monthly-accesses") {
    return (
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer>
          <LineChart
            data={dataAccesses}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="mes" stroke="#000" />
            <YAxis stroke="#000" />
            <Tooltip />
            <Legend
              align="center"
              wrapperStyle={{
                padding: "10px 0 0 4rem ",
                userSelect: "none",
              }}
            />
            <Line
              type="monotone"
              dataKey="Acessos"
              stroke="#8884d8"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else if (tab === "subscribers") {
    return (
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Tooltip />
            <Legend
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{
                userSelect: "none",
                fontSize: "14px",
                paddingTop: "1rem",
              }}
            />
            <Pie
              data={dataSubscribers}
              dataKey="value"
              nameKey="tipo"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {dataSubscribers.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    return <p style={{ textAlign: "center" }}>Selecione uma aba</p>;
  }
};

export default Chart;
