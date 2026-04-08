import { useState, useEffect } from "react";
import API from "../api";

export default function RecordForm({ initialData, onSuccess }) {
  const [form, setForm] = useState({
    route: "",
    party: "",
    sealedChalan: 0,
    gps: 0,
    low: 0,
    good: 0,
    high: 0,
    medium: 0,
    status: "PENDING",
  });

  const [routePartyMap, setRoutePartyMap] = useState({});

  // ✅ Load existing data (edit mode)
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  // ✅ Fetch routes + parties from backend
  useEffect(() => {
    fetchRoutesAndParties();
  }, []);

  const fetchRoutesAndParties = async () => {
    try {
      const res = await API.get("/"); // 👈 make sure this returns all records
      const data = res.data;

      console.log("API DATA:", data); // debug

      const map = {};

      data.forEach((item) => {
        if (!item.route || !item.party) return;

        if (!map[item.route]) {
          map[item.route] = new Set();
        }

        map[item.route].add(item.party);
      });

      // Convert Set → Array
      const finalMap = {};
      Object.keys(map).forEach((route) => {
        finalMap[route] = Array.from(map[route]);
      });

      setRoutePartyMap(finalMap);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "route") {
      setForm({
        ...form,
        route: value,
        party: "", // reset party
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form._id) {
      await API.put(`/${form._id}`, form);
    } else {
      await API.post("/add", form);
    }

    onSuccess();
  };

  // 🎨 Styles (same as yours)
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "30px auto",
      padding: "20px",
      borderRadius: "10px",
      background: "#f9f9f9",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      marginBottom: "10px",
      color: "#333",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    label: {
      fontWeight: "400",
      marginBottom: "5px",
      color: "#333",
    },
    input: {
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "15px",
    },
    button: {
      width: "100%",
      padding: "10px",
      background: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "10px",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2 style={styles.heading}>Route Details</h2>

      {/* ✅ Route Dropdown */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Route</label>
        <select
          name="route"
          value={form.route}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Route</option>
          {Object.keys(routePartyMap).map((route) => (
            <option key={route} value={route}>
              {route}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Party Dropdown */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Party</label>
        <select
          name="party"
          value={form.party}
          onChange={handleChange}
          style={styles.input}
          disabled={!form.route}
        >
          <option value="">Select Party</option>
          {form.route &&
            routePartyMap[form.route]?.map((party) => (
              <option key={party} value={party}>
                {party}
              </option>
            ))}
        </select>
      </div>

      <h3 style={styles.heading}>Chalan & Metrics</h3>

      <div style={styles.grid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Sealed Chalan</label>
          <input
            type="number"
            name="sealedChalan"
            value={form.sealedChalan}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>GPS</label>
          <input
            type="number"
            name="gps"
            value={form.gps}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Low</label>
          <input
            type="number"
            name="low"
            value={form.low}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Medium</label>
          <input
            type="number"
            name="medium"
            value={form.medium}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Good</label>
          <input
            type="number"
            name="good"
            value={form.good}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>High</label>
          <input
            type="number"
            name="high"
            value={form.high}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="PENDING">PENDING</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="NOT VERIFIED">NOT VERIFIED</option>
        </select>
      </div>

      <button type="submit" style={styles.button}>
        Save
      </button>
    </form>
  );
}