import "./App.css";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
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
  const [mqttData, setMqttData] = useState([]);

  useEffect(() => {
    const client = mqtt.connect("ws://54.153.176.0:9001");
    console.log("hello", client);
    const topic = "test/topic";

    client.on("connect", () => {
      console.log("Connected to MQTT broker");

      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${topic}`);
        } else {
          console.error("Subscription error:", err);
        }
      });
    });

    client.on("message", (topic, message) => {
      setMqttData((prevMessages) => [
        ...prevMessages,
        JSON.parse(message.toString()),
      ]);
    });

    // Cleanup function to disconnect on component unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        alignItems: "center",
      }}
    >
      {mqttData.map((data, index) => (
        <div key={index}>
          <p>{data.msg}</p>
        </div>
      ))}
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
