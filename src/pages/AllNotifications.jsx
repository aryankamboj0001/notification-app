import { useEffect, useState } from "react";
import { getNotifications } from "../services/api";

function AllNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getNotifications();

      if (data.notifications) {
        setNotifications(data.notifications);
      }
    }

    fetchData();
  }, []);

  // Priority Ranking
  const priorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  // Sort by Priority then Timestamp
  const topNotifications = [...notifications]
    .sort((a, b) => {
      if (priorityMap[b.Type] !== priorityMap[a.Type]) {
        return priorityMap[b.Type] - priorityMap[a.Type];
      }

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, 10);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Priority Inbox (Top 10)
      </h2>

      {topNotifications.map((item) => (
        <div
          key={item.ID}
          style={{
            border: "1px solid #444",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#1a1a2e",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              color:
                item.Type === "Placement"
                  ? "#4CAF50"
                  : item.Type === "Event"
                  ? "#2196F3"
                  : "#FF9800",
              marginBottom: "10px",
            }}
          >
            {item.Type}
          </h3>

          <p
            style={{
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            {item.Message}
          </p>

          <small
            style={{
              color: "#bbbbbb",
            }}
          >
            {item.Timestamp}
          </small>
        </div>
      ))}
    </div>
  );
}

export default AllNotifications;