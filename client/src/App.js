import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [parents, setParents] = useState([]);
  const [childData, setChildData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [sort, setSort] = useState('id');

  useEffect(() => {
    fetchParents();
    fetchChildData();
  }, [page, pageSize, sort]);

  const fetchParents = async () => {
    const response = await fetch(`http://localhost:3001/api/parents?page=${page}&pageSize=${pageSize}&sort=${sort}`);
    const data = await response.json();
    setParents(data);
  };

  const fetchChildData = async () => {
    const response = await fetch('http://localhost:3001/api/child');
    const data = await response.json();
    setChildData(data);
  };

  const calculateTotalPaidAmount = (parentId) => {
    const childPayments = childData.filter((child) => child.parentId === parentId);
    const totalPaidAmount = childPayments.reduce((sum, child) => sum + child.paidAmount, 0);
    return totalPaidAmount;
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1); // Reset page to 1 when changing the sort option
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <h1>Parent Transactions</h1>
      <div>
        <label htmlFor="sort-select">Sort by:</label>
        <select id="sort-select" value={sort} onChange={handleSortChange}>
          <option value="id">Parent ID</option>
          <option value="sender">Sender</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Parent ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Total Amount</th>
            <th>Total Paid Amount</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((parent) => (
            <tr key={parent.id}>
              <td>{parent.id}</td>
              <td>{parent.sender}</td>
              <td>{parent.receiver}</td>
              <td>{parent.totalAmount}</td>
              <td>{calculateTotalPaidAmount(parent.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous Page
        </button>
        <button onClick={handleNextPage}>
          Next Page
        </button>
      </div>
    </div>
  );
}

export default App;
