import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ChildTable() {
    const { parentId } = useParams();
  const [childData, setChildData] = useState([]);

  useEffect(() => {
    const fetchChildData = async () => {
        const response = await fetch(`http://localhost:3001/api/child/${parentId}`);
        const data = await response.json();
        setChildData(data);
      };      
  
    fetchChildData();
  }, [parentId]);

  return (
    <div>
      <h2>Child Transactions (Parent ID: {parentId})</h2>
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
          {childData.map((child) => (
            <tr key={child.id}>
              <td>{child.id}</td>
              <td>{child.sender}</td>
              <td>{child.receiver}</td>
              <td>{child.totalAmount}</td>
              <td>{child.paidAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChildTable;