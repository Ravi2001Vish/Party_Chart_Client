import React from "react";
import API from "../api";

const RecordList = ({ data, refresh, setSelected }) => {

  const handleDelete = async (id) => {
    await API.delete(`/delete/${id}`);
    refresh();
  };

  return (
    <div>
      <h3>Records</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Route</th>
            <th>Party</th>
            <th>Chalan</th>
            <th>GPS</th>
            <th>Status</th>
             
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.route}</td>
              <td>{item.party}</td>
              <td>{item.sealedChalan}</td>
              <td>{item.gps}</td>
              <td>{item.status}</td>
              
              <td>
                <button onClick={() => setSelected(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordList;