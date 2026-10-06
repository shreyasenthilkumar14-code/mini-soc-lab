import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";
function App() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchAlerts = () => {
      fetch("http://127.0.0.1:5000/api/alerts")
        .then((response) => response.json())
        .then((data) => {
          setAlerts(data);
          setLastUpdated(new Date());
        })
        .catch((error) => {
          console.error("Failed to fetch alerts:", error);
        });
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 10000);

    return () => clearInterval(interval);
  }, []);

  const critical = alerts.filter(
    (alert) => alert.severity === "CRITICAL"
  ).length;

  const high = alerts.filter(
    (alert) => alert.severity === "HIGH"
  ).length;

  const medium = alerts.filter(
    (alert) => alert.severity === "MEDIUM"
  ).length;

  const filteredAlerts =
    filter === "ALL"
      ? alerts
      : alerts.filter((alert) => alert.severity === filter);

  const chartData = [
  {
    severity: "Critical",
    count: critical,
  },
  {
    severity: "High",
    count: high,
  },
  {
    severity: "Medium",
    count: medium,
  },
];

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>Mini SOC</h1>
          <p>Security Operations Monitoring Dashboard</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>

          <div>
            <strong>Monitoring Active</strong>

            {lastUpdated && (
              <small>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </small>
            )}
          </div>
        </div>
      </header>

      <main>

        {/* Statistics */}
        <section className="cards">

          <div className="card">
            <span>Total Alerts</span>
            <strong>{alerts.length}</strong>
          </div>

          <div className="card critical">
            <span>Critical</span>
            <strong>{critical}</strong>
          </div>

          <div className="card high">
            <span>High</span>
            <strong>{high}</strong>
          </div>

          <div className="card medium">
            <span>Medium</span>
            <strong>{medium}</strong>
          </div>

        </section>
        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h2>Alert Severity Distribution</h2>
              <p>Current security events by severity</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis
  dataKey="severity"
  tick={{ fill: "#8994aa", fontSize: 12 }}
  axisLine={{ stroke: "#26314a" }}
  tickLine={false}
/>

<YAxis
  allowDecimals={false}
  tick={{ fill: "#8994aa", fontSize: 12 }}
  axisLine={{ stroke: "#26314a" }}
  tickLine={false}
/>

<Tooltip
  contentStyle={{
    backgroundColor: "#111a2e",
    border: "1px solid #26314a",
    borderRadius: "8px",
    color: "#ffffff",
  }}
  labelStyle={{ color: "#ffffff" }}
/>
                <Bar
  dataKey="count"
  name="Alerts"
  fill="#4f8cff"
  radius={[6, 6, 0, 0]}
/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>


        {/* Alerts */}
        <section className="panel">

          <div className="panel-header">

            <div>
              <h2>Active Security Alerts</h2>
              <p>Recent events detected by the monitoring engine</p>
            </div>

            <span className="alert-count">
              {filteredAlerts.length} alerts
            </span>

          </div>


          {/* Filters */}
          <div className="filters">

            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((level) => (

              <button
                key={level}
                className={
                  filter === level
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter(level)}
              >
                {level}
              </button>

            ))}

          </div>


          {/* Alert Table */}
          <div className="table">

            <div className="table-header">
              <span>Severity</span>
              <span>Detection</span>
              <span>Source</span>
              <span>Status</span>
            </div>


            {filteredAlerts.map((alert, index) => (

              <div
                className="table-row"
                key={index}
                onClick={() => setSelectedAlert(alert)}
              >

                <span>

                  <span
                    className={`badge ${alert.severity.toLowerCase()}`}
                  >
                    {alert.severity}
                  </span>

                </span>


                <span>
                  {alert.event}
                </span>


                <span className="source">

                  {alert.source_ip ||
                    alert.source_user ||
                    alert.file ||
                    "N/A"}

                </span>


                <span className="open">
                  {alert.status}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* Investigation Panel */}
        {selectedAlert && (

          <section className="panel details">

            <div className="panel-header">

              <div>
                <h2>Alert Investigation</h2>
                <p>Security event details</p>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>

            </div>
            <div className="status-controls">
  <label>Incident Status</label>

  <div className="status-buttons">
    {["Open", "Investigating", "Resolved"].map((status) => (
      <button
        key={status}
        className={
          selectedAlert.status === status
            ? "status-button active"
            : "status-button"
        }
        onClick={() => {
          const alertIndex = alerts.indexOf(selectedAlert);

          fetch(
            `http://127.0.0.1:5000/api/alerts/${alertIndex}/status`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: status,
              }),
            }
          )
            .then((response) => response.json())
            .then((updatedAlert) => {
              setAlerts((currentAlerts) =>
                currentAlerts.map((alert, index) =>
                  index === alertIndex ? updatedAlert : alert
                )
              );

              setSelectedAlert(updatedAlert);
            })
            .catch((error) => {
              console.error(
                "Failed to update alert status:",
                error
              );
            });
        }}
      >
        {status}
      </button>
    ))}
  </div>
</div>

            <div className="details-grid">

              <div>
                <label>Severity</label>
                <strong>
                  {selectedAlert.severity}
                </strong>
              </div>


              <div>
                <label>Detection</label>
                <strong>
                  {selectedAlert.event}
                </strong>
              </div>


              <div>
                <label>Source</label>
                <strong>
                  {selectedAlert.source_ip ||
                    selectedAlert.source_user ||
                    "N/A"}
                </strong>
              </div>


              <div>
                <label>Status</label>
                <strong>
                  {selectedAlert.status}
                </strong>
              </div>


              {selectedAlert.failed_attempts && (

                <div>
                  <label>Failed Attempts</label>
                  <strong>
                    {selectedAlert.failed_attempts}
                  </strong>
                </div>

              )}


              {selectedAlert.command && (

                <div>
                  <label>Command</label>
                  <strong>
                    {selectedAlert.command}
                  </strong>
                </div>

              )}


              {selectedAlert.file && (

                <div>
                  <label>Modified File</label>
                  <strong>
                    {selectedAlert.file}
                  </strong>
                </div>

              )}


              <div>
                <label>Recommended Action</label>
                <strong>
                  {selectedAlert.recommended_action}
                </strong>
              </div>


              <div>
                <label>Timestamp</label>
                <strong>
                  {selectedAlert.timestamp}
                </strong>
              </div>

            </div>

          </section>

        )}

      </main>


      <footer>
        Mini SOC Lab • Detection & Incident Monitoring
      </footer>

    </div>
  );
}

export default App;