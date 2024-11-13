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

  // var ws;
  // var apiKey = "ca178ecd89b12f332a53661d953491a5";
  // ws = new WebSocket("ws://technest.ddns.net:8001/ws");


  // ws.onopen = function (event) {
  //   ws.send(apiKey);
  // };

  // ws.onmessage = async function (event) {
  //   console.log(event.data);
  // };

  while (currentTime <= endDate) {
    const timestamp = currentTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const x = Math.random();
    data.push({ timestamp, x });

    currentTime = new Date(currentTime.getTime() + intervalMinutes * 60 * 1000);
  }
  return data;
}

function App() {
  const [data, setData] = useState(generateRandomData());
  const [mqttData, setMqttData] = useState([]);

  useEffect(() => {
    const client = mqtt.connect("ws://54.153.176.0:9001");
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
      try {
        const parsedMessage = JSON.parse(message.toString());
        const timestamp = new Date("2024-02-14T07:00:00Z").toLocaleTimeString(
          "en-GB",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

        const newData = { timestamp, x: 20 };

        // Update data state with new MQTT message
        const interval = setInterval(() => {
          setData((prevData) => [...prevData, newData]);
          setMqttData((prevMessages) => [...prevMessages, parsedMessage]);
        }, 1000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error parsing MQTT message:", error);
      }
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
