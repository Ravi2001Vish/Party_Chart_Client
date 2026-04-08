import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import RecordForm from "../components/Record_form";

export default function EditRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("ID:", id);

      const res = await API.get(`/${id}`);
      console.log("DATA:", res.data);

      setRecord(res.data);
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
    }
  };

  fetchData();
}, [id]);

  return (
    <div style={{ padding: 20 }}>
      <h2>✏️ Edit Record</h2>

      {record && (
        <RecordForm
          initialData={record}
          onSuccess={() => navigate("/")}
        />
      )}
    </div>
  );
}