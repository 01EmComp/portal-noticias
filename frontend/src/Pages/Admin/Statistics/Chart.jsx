import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { mes: "Jan", Acessos: 400 },
  { mes: "Fev", Acessos: 350 },
  { mes: "Mar", Acessos: 300 },
  { mes: "Abr", Acessos: 250 },
  { mes: "Mai", Acessos: 200 },
  { mes: "Jun", Acessos: 1540 },
];

const Chart = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="mes" stroke="#000000ff" />
          <YAxis stroke="#000000ff" />
          <Tooltip />
          <Legend
            align="center"
            wrapperStyle={{
              padding: "10px 0 0 4rem ",
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
};

export default Chart;
