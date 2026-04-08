import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddRecord from "./pages/AddRecord";
import EditRecord from "./pages/EditRecord";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddRecord />} />
        <Route path="/edit/:id" element={<EditRecord />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;