import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";

function generateRandomData() {
  const startDate = new Date("2024-02-14T00:00:00Z");
  const endDate = new Date("2024-02-15T00:00:00Z");
  const intervalMinutes = 15;

  const data = [];
  let currentTime = startDate;

  while (currentTime <= endDate) {
    const timestamp = currentTime.toISOString();
    const x = Math.random();

    data.push({ timestamp, x });

    currentTime = new Date(currentTime.getTime() + intervalMinutes * 60 * 1000);
  }
  return data;
}

function App() {
  const data = generateRandomData();

  return (
    <div style={{ display: "flex", width:'100vw',justifyContent: "center" }}>
      <LineChart width={1000} height={300} data={data}>
        <CartesianGrid strokeDasharray={"3 3"} />
        <XAxis dataKey={"timestamp"} />
        <YAxis yAxisId={"left"}>
          <Label value={"mm/s"} position={"insideLeft"} angle={-90} />
        </YAxis>
        <Tooltip />
        <Legend />
        <Line
          type={"monotone"}
          dataKey={"x"}
          stroke="#8884d8"
          yAxisId={"left"}
          dot={false}
        />
      </LineChart>
    </div>
  );
}

export default App;
