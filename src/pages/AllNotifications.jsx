import { useEffect, useState } from "react";
import { getNotifications } from "../services/api";

function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const notificationsPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      const data = await getNotifications();

      if (data.notifications) {
        setNotifications(data.notifications);
      }
    }

    fetchData();
  }, []);

  const priorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (priorityMap[b.Type] !== priorityMap[a.Type]) {
      return priorityMap[b.Type] - priorityMap[a.Type];
    }

    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  const filteredNotifications =
    filter === "All"
      ? sortedNotifications
      : sortedNotifications.filter(
          (item) => item.Type === filter
        );

  const indexOfLast = currentPage * notificationsPerPage;
  const indexOfFirst = indexOfLast - notificationsPerPage;

  const currentNotifications =
    filteredNotifications.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages = Math.ceil(
    filteredNotifications.length /
      notificationsPerPage
  );

  const markAsRead = (id) => {
    localStorage.setItem(id, "read");

    setNotifications([...notifications]);
  };

  const isRead = (id) => {
    return localStorage.getItem(id) === "read";
  };

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
          marginBottom: "20px",
        }}
      >
        Priority Inbox
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => setFilter("All")}>
          All
        </button>

        <button
          onClick={() =>
            setFilter("Placement")
          }
        >
          Placement
        </button>

        <button
          onClick={() => setFilter("Result")}
        >
          Result
        </button>

        <button
          onClick={() => setFilter("Event")}
        >
          Event
        </button>
      </div>

      {currentNotifications.map((item) => (
        <div
          key={item.ID}
          onClick={() =>
            markAsRead(item.ID)
          }
          style={{
            border: "1px solid #444",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: isRead(item.ID)
              ? "#2d3748"
              : "#1a1a2e",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          {!isRead(item.ID) && (
            <p
              style={{
                color: "red",
                fontWeight: "bold",
              }}
            >
              ● Unread
            </p>
          )}

          <h3
            style={{
              color:
                item.Type === "Placement"
                  ? "#4CAF50"
                  : item.Type === "Event"
                  ? "#2196F3"
                  : "#FF9800",
            }}
          >
            {item.Type}
          </h3>

          <p>{item.Message}</p>

          <small>{item.Timestamp}</small>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllNotifications;