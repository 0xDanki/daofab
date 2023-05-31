import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const ChildTable = ({ selectedParentChildData, parentId, parentData }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const filteredChildData = selectedParentChildData.filter((child) => child.parentId === parentId);

  // Find the corresponding parent for the current child
  const parent = parentData.find((parent) => parent.id === parentId);

  return (
    <div>
      <h2>Child Transactions for Parent ID: {selectedParentChildData[0]?.parentId}</h2>
      {/* {parent && (
        <div>
          <p>Sender: {parent.sender}</p>
          <p>Receiver: {parent.receiver}</p>
          <p>Total Amount: {parent.totalAmount}</p>
        </div>
      )} */}
      <table>
        <thead>
          <tr>
            <th>Child ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Total Amount</th>
            <th>Paid Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredChildData.map((child) => (
            <tr key={child.id}>
              <td>{child.id}</td>
              <td>{parent.sender}</td>
              <td>{parent.receiver}</td>
              <td>{parent.totalAmount}</td>
              <td>{child.paidAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default ChildTable;
