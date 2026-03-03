import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

// Read role from JWT stored in localStorage
function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null; // expects "ADMIN" or "STUDENT"
  } catch (e) {
    return null;
  }
}

export default function Users() {
  const [users, setUsers] = useState([]);

  // Tabs: "create" | "list"
  const [activeTab, setActiveTab] = useState("create");

  // Create User States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  const userRole = useMemo(() => getRoleFromToken(), []);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Fetch Users (Admin only)
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log("Fetch users failed:", err?.response?.status, err);
    }
  };

  useEffect(() => {
    if (userRole === "ADMIN") fetchUsers();
  }, [userRole]);

  // Create User (Admin only)
  const createUser = async () => {
    try {
      await api.post("/api/admin/users", {
        fullName,
        email,
        password,
        role,
      });

      alert("User Created Successfully!");

      // Clear fields
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("STUDENT");

      // Switch to list view + refresh
      setActiveTab("list");
      fetchUsers();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Error creating user";
      alert(msg);
      console.log(err);
    }
  };

  // --- Simple styling ---
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#121212",
      color: "#fff",
      padding: "30px 16px",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    },
    card: {
      maxWidth: "860px",
      margin: "0 auto",
      background: "#1b1b1b",
      border: "1px solid #2a2a2a",
      borderRadius: "14px",
      padding: "18px",
      boxShadow: "0 0 24px rgba(0,0,0,0.35)",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
      marginBottom: "14px",
    },
    badge: {
      padding: "6px 10px",
      borderRadius: "999px",
      background: "#2a2a2a",
      border: "1px solid #3a3a3a",
      fontSize: "12px",
    },
    logoutBtn: {
      padding: "10px 14px",
      background: "#2a2a2a",
      color: "white",
      border: "1px solid #3a3a3a",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 600,
    },
    nav: {
      display: "flex",
      gap: "10px",
      background: "#151515",
      border: "1px solid #2a2a2a",
      padding: "10px",
      borderRadius: "12px",
      marginBottom: "16px",
    },
    tabBtn: (active) => ({
      padding: "10px 14px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 700,
      border: active ? "1px solid #2f6fed" : "1px solid #2a2a2a",
      background: active ? "#2f6fed" : "#1b1b1b",
      color: "white",
    }),
    sectionTitle: { margin: "12px 0 10px", fontSize: "22px" },
    muted: { color: "#bdbdbd" },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #3a3a3a",
      background: "#101010",
      color: "#fff",
      outline: "none",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #3a3a3a",
      background: "#101010",
      color: "#fff",
      outline: "none",
    },
    primaryBtn: {
      padding: "10px 14px",
      background: "#2f6fed",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 700,
    },
    secondaryBtn: {
      padding: "10px 14px",
      background: "#2a2a2a",
      color: "white",
      border: "1px solid #3a3a3a",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 700,
    },
    hr: { borderColor: "#2a2a2a", margin: "16px 0" },
    tableWrap: {
      overflowX: "auto",
      border: "1px solid #2a2a2a",
      borderRadius: "12px",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "left",
      padding: "12px",
      borderBottom: "1px solid #2a2a2a",
      background: "#161616",
      fontSize: "13px",
      letterSpacing: "0.3px",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #222",
      fontSize: "14px",
    },
  };

  // If not logged in
  if (!localStorage.getItem("token")) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Not logged in</h2>
          <p style={styles.muted}>Please login first.</p>
          <button
            style={styles.primaryBtn}
            onClick={() => (window.location.href = "/")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // STUDENT VIEW (different page)
  if (userRole !== "ADMIN") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.topBar}>
            <div style={styles.badge}>
              Role: <b>{userRole || "UNKNOWN"}</b>
            </div>
            <button style={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </div>

          <h2 style={styles.sectionTitle}>Student Dashboard 👨‍🎓</h2>
          <p style={styles.muted}>
            You are logged in as <b>STUDENT</b>. Admin features are not available.
          </p>

          <div style={{ marginTop: 14 }}>
            <p style={styles.muted}>(Next step) We can add student features:</p>
            <ul style={{ color: "#d6d6d6", lineHeight: 1.7 }}>
              <li>View profile</li>
              <li>Courses / attendance</li>
              <li>Update password</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN VIEW
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topBar}>
          <div style={styles.badge}>
            Role: <b>{userRole || "UNKNOWN"}</b>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>

        <h2 style={styles.sectionTitle}>Admin Panel</h2>
        <p style={styles.muted}>Create users and manage the portal.</p>

        {/* NAV BAR / TABS */}
        <div style={styles.nav}>
          <button
            style={styles.tabBtn(activeTab === "create")}
            onClick={() => setActiveTab("create")}
          >
            Create User
          </button>

          <button
            style={styles.tabBtn(activeTab === "list")}
            onClick={() => {
              setActiveTab("list");
              fetchUsers();
            }}
          >
            View Users
          </button>
        <button
        style={styles.tabBtn(activeTab === "profile")}
        onClick={() => setActiveTab("profile")}
        >
        My Profile
        </button>
        </div>


        {/* TAB CONTENT */}
        {activeTab === "profile" && (
            <div>
                <h3 style={{ margin: "6px 0 10px" }}>My Profile</h3>

                <div style={{ display: "grid", gap: "10px" }}>
                <div style={styles.badge}>
                    <span style={{ color: "#bdbdbd" }}>Email:</span>{" "}
                    <b>{JSON.parse(atob(localStorage.getItem("token").split(".")[1]))?.email || "N/A"}</b>
                </div>

                <div style={styles.badge}>
                    <span style={{ color: "#bdbdbd" }}>Role:</span>{" "}
                    <b>{userRole || "N/A"}</b>
                </div>
                </div>
            </div>
            )}
        {activeTab === "create" && (
          <div>
            <h3 style={{ margin: "6px 0 10px" }}>Create User</h3>

            <div style={styles.row}>
              <input
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                style={styles.select}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: "10px" }}>
              <button style={styles.primaryBtn} onClick={createUser}>
                Create
              </button>
              <button style={styles.secondaryBtn} onClick={() => {
                setFullName("");
                setEmail("");
                setPassword("");
                setRole("STUDENT");
              }}>
                Clear
              </button>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: "6px 0 10px" }}>All Users</h3>
              <button style={styles.secondaryBtn} onClick={fetchUsers}>
                Refresh
              </button>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={styles.td}>{u.id}</td>
                      <td style={styles.td}>{u.fullName}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{u.role}</span>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td style={styles.td} colSpan="4">
                        <span style={styles.muted}>No users found.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}