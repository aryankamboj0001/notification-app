import AllNotifications from "./pages/AllNotifications";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Campus Notification System
      </h1>

      <AllNotifications />
    </div>
  );
}

export default App;