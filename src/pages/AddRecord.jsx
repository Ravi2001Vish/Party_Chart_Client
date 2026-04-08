import { useNavigate } from "react-router-dom";
import RecordForm from "../components/Record_form";

export default function AddRecord() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 2}}>
      <h2>➕ Add Record</h2>

      <RecordForm onSuccess={() => navigate("/")} />
    </div>
  );
}