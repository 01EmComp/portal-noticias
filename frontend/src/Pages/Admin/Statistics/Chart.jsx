import { useEffect, useState } from "react";

// Firebase
import { db } from "/src/Services/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

// Charts
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

// Variables and auxiliary functions
const colors = ["#8884d8", "#82ca9d", "#ffc658"];

// Convert "2025-10" → "Oct"
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const getMonthName = (key) => {
  const [year, month] = key.split("-");
  return months[parseInt(month) - 1];
};

const Chart = ({ tab }) => {
  const [monthlyAccessData, setMonthlyAccessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriberData, setSubscriberData] = useState([]);

  // Fetch subscriptionType from Firestore
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        const counts = { Free: 0, Premium: 0, Business: 0 };

        snapshot.forEach((doc) => {
          const subscription = doc.data().subscriptionType;
          if (counts[subscription] !== undefined) {
            counts[subscription]++;
          }
        });

        setSubscriberData([
          { type: "Free", value: counts.Free },
          { type: "Premium", value: counts.Premium },
          { type: "Business", value: counts.Business },
        ]);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    fetchSubscribers();
  }, []);

  // Fetch monthly accesses from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "analytics", "visitors", "monthly");
        const snapshot = await getDocs(colRef);

        const data = snapshot.docs.map((doc) => ({
          month: getMonthName(doc.id),
          accesses: doc.data().total || 0,
        }));

        // Sort by month
        const sortedData = data.sort(
          (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
        );

        setMonthlyAccessData(sortedData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading data...</p>;
  }

  if (tab === "monthly-accesses") {
    return (
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer>
          <LineChart
            data={monthlyAccessData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#000" />
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
              dataKey="accesses"
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
              data={subscriberData}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {subscriberData.map((entry, index) => (
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
    return <p style={{ textAlign: "center" }}>Select a tab</p>;
  }
};

export default Chart;
