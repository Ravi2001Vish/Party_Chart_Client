import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import "../App.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [party, setParty] = useState("all");
const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("user"); // user remove
  navigate("/login"); // login page pe bhejo
};

  // 🔄 Fetch Data
const fetchData = async () => {
  try {
    setLoading(true); // 👈 start loader

    const res = await API.get("/");

    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    let apiData = res.data;

    if (user && user.allowedParties) {
      apiData = apiData.filter((item) =>
        user.allowedParties.includes(item.party)
      );
    }

    setData(apiData);
    setFiltered(apiData);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false); // 👈 loader stop
  }
};

  const handleExport = () => {
  const exportData = filtered.map((d) => ({
    Route: d.route,
    Party: d.party,
    Seal: d.sealedChalan,
    GPS: d.gps,
    Low: d.low,
    Medium: d.medium,
    High: d.high,
    Not_Verified: d.good,
    Status: d.status,
    "Created Date": d.createdAt
      ? new Date(d.createdAt).toLocaleString()
      : "N/A"
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Summary");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  saveAs(fileData, "Data_Summary.xlsx");
};

  useEffect(() => {
    fetchData();
  }, []);

  // 🔧 Normalize Date (remove time)
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // 🔥 GROUP SAME ROUTE
 const groupByRoute = (data) => {
  const map = {};

  data.forEach((d) => {
    const key = d.route;

    if (!map[key]) {
      map[key] = {
        ...d,
        sealedChalan: Number(d.sealedChalan) || 0,
        gps: Number(d.gps) || 0,
        low: Number(d.low) || 0,
        medium: Number(d.medium) || 0,
        high: Number(d.high) || 0,
        good:Number(d.good) ||0
      };
    } else {
      map[key].sealedChalan += Number(d.sealedChalan) || 0;
      map[key].gps += Number(d.gps) || 0;
      map[key].low += Number(d.low) || 0;
      map[key].medium += Number(d.medium) || 0;
      map[key].high += Number(d.high) || 0;
      map[key].good += Number(d.good) || 0;

      // latest created date
      if (new Date(d.createdAt) > new Date(map[key].createdAt)) {
        map[key].createdAt = d.createdAt;
      }
    }
  });

  return Object.values(map);
};

  // 🔥 FILTER (Party + Date + Group)
  useEffect(() => {
    let temp = [...data];

    // Party filter
    if (party !== "all") {
      temp = temp.filter(d => d.party === party);
    }

    // From date
    if (fromDate) {
      temp = temp.filter(d =>
        normalizeDate(d.createdAt) >= normalizeDate(fromDate)
      );
    }

    // To date
    if (toDate) {
      temp = temp.filter(d =>
        normalizeDate(d.createdAt) <= normalizeDate(toDate)
      );
    }

    // 🔥 GROUP SAME ROUTE
    setFiltered(groupByRoute(temp));

  }, [party, data, fromDate, toDate]);

  const parties = [...new Set(data.map(d => d.party))];

  // ✏️ Edit
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/delete/${id}`);

      const updated = data.filter(item => item._id !== id);
      setData(updated);

    } catch (err) {
      console.error(err);
    }
  };
const handleClear = () => {
  setParty("all");
  setFromDate("");
  setToDate("");
};

  // 📊 Chart Data
  const labels = filtered.map(d => d.route);

  const sealData = {
    labels,
    datasets: [
      {
        label: "Seal",
        data: filtered.map(d => d.sealedChalan),
        backgroundColor: "#3b82f6"
      },
      {
        label: "GPS",
        data: filtered.map(d => d.gps),
        backgroundColor: "#10b981"
      }
    ]
  };

  const riskData = {
    labels,
    datasets: [
      {
        label: "Low",
        data: filtered.map(d => d.low),
        backgroundColor: "#22c55e"
      },
      {
        label: "Medium",
        data: filtered.map(d => d.medium),
        backgroundColor: "#f59e0b"
      },
      {
        label: "High",
        data: filtered.map(d => d.high),
        backgroundColor: "#ef4444"
      }
    ]
  };
  
if (loading) {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div className="loader"></div>
    </div>
  );
}
  return (
    
    <div className="dashboard-container">

      <h2>🚚 Logistics Monitoring Dashboard</h2>
  <button className="btn-logout" onClick={handleLogout}>
    Logout
  </button>
      {/* 🔽 FILTER */}
      <div className="filter-box">

  <div className="filter-group">
    <select value={party} onChange={(e) => setParty(e.target.value)}>
      <option value="all">All Party</option>
      {parties.map((p, i) => (
        <option key={i}>{p}</option>
      ))}
    </select>

    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />

    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </div>

  <div className="filter-actions">
    <button className="btn-add" onClick={() => navigate("/add")}>
      <FaPlus /> Add Record
    </button>

    <button className="btn-clear" onClick={handleClear}>
      Clear
    </button>
  </div>

</div>

      {/* 📊 CHART */}
      <div className="grid">

  <div className="card">
    <h3 style={{ fontSize: "14px" }}>Seal & GPS Chalan Status</h3>
    <Bar
      data={sealData}
      options={{
        plugins: {
          legend: {
            labels: {
              font: {
                size: 8   // 👈 legend font small
              }
            }
          },
          datalabels: {
            color: "white",
            anchor: "end",
            align: "top",
            font: {
              size: 8   // 👈 data labels small
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 8   // 👈 x-axis font
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 8   // 👈 y-axis font
              }
            }
          }
        }
      }}
    />
  </div>

  <div className="card">
    <h3 style={{ fontSize: "14px" }}>Risk Factor</h3>
    <Bar
      data={riskData}
      options={{
        plugins: {
          legend: {
            labels: {
              font: {
                size: 8
              }
            }
          },
          datalabels: {
            color: "white",
            formatter: (v) => (v > 0 ? v : ""),
            font: {
              size: 8
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: { size: 8 }
            }
          },
          y: {
            stacked: true,
            ticks: {
              font: { size: 8 }
            }
          }
        }
      }}
    />
  </div>

</div>

      {/* 📋 TABLE */}
      
      <div className="table-container">
        <button className="btn-export" onClick={handleExport}>
  Export Excel
</button>
        <h3>📋 Data Summary</h3>

        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Party</th>
              <th>Seal</th>
              <th>GPS</th>
             <th>Not verified</th> 
              <th>Low</th>
              <th>Medium</th>
              <th>High</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <tr key={d._id}>
                <td>{d.route}</td>
                <td>{d.party}</td>
                <td>{d.sealedChalan}</td>
                <td>{d.gps}</td>
  <td><span className="badge high" style={{ color: 'white',  fontWeight:'600'}}>{d.good}</span></td> 
                <td><span className="badge low">{d.low}</span></td>
                <td><span className="badge medium">{d.medium}</span></td>
                <td><span className="badge high">{d.high}</span></td>

                <td>
                  <span className={`badge ${d.status === "VERIFIED" ? "verify" : "notverify"}`}>
                    {d.status}
                  </span>
                </td>

                <td>
                  {d.createdAt
                    ? new Date(d.createdAt).toLocaleString()
                    : "N/A"}
                </td>

                <td className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEdit(d._id)}>
                    <FaEdit />
                  </button>

                  <button className="btn-delete" onClick={() => handleDelete(d._id)}>
                    <FaTrash />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}