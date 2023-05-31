import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChildTable from './ChildTable';

function App() {
  const [parents, setParents] = useState([]);
  const [childData, setChildData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [sort, setSort] = useState('id');
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParentChildData, setSelectedParentChildData] = useState([]);
  const navigate = useNavigate(); // Move the useNavigate hook here

  useEffect(() => {
    fetchParents();
    fetchChildData();
  }, [page, pageSize, sort]);

  const fetchParents = async () => {
    const response = await fetch(
      `http://localhost:3001/api/parents?page=${page}&pageSize=${pageSize}&sort=${sort}`
    );
    const data = await response.json();
    setParents(data);
  };

  const fetchChildData = async () => {
    const response = await fetch('http://localhost:3001/api/child');
    const childData = await response.json();
  
    // Add parent properties to child objects
    const childDataWithParent = childData.map((child) => {
      const parent = parents.find((parent) => parent.id === child.parentId);
      if (parent) {
        return {
          ...child,
          sender: parent.sender,
          receiver: parent.receiver,
          totalAmount: parent.totalAmount,
        };
      }
      return child; // If parent is not found, return the original child object
    });
  
    setChildData(childDataWithParent);
  };  

  const calculateTotalPaidAmount = (parentId) => {
    const childPayments = childData.filter((child) => child.parentId === parentId);
    const totalPaidAmount = childPayments.reduce((sum, child) => sum + child.paidAmount, 0);

    const handleCellClick = async () => {
      if (selectedParentId === parentId) {
        // If the same parent ID is clicked again, deselect it
        setSelectedParentId(null);
        setSelectedParentChildData([]);
      } else {
        setSelectedParentId(parentId);

        // Fetch child data for the selected parent ID
        const response = await fetch(`http://localhost:3001/api/child?parentId=${parentId}`);
        const data = await response.json();
        setSelectedParentChildData(data);

        navigate(`/child-table?parentId=${parentId}`);
      }
    };

    return (
      <td onClick={handleCellClick} className="clickable-cell">
        {totalPaidAmount}
      </td>
    );
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
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
      <Routes>
        <Route
          path="/"
          element={
            <div>
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
                      {calculateTotalPaidAmount(parent.id)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                  Previous Page
                </button>
                <button onClick={handleNextPage}>Next Page</button>
              </div>
            </div>
          }
        />
        <Route
          path="/child-table"
          element={<ChildTable selectedParentChildData={selectedParentChildData} parentId={selectedParentId} parentData={parents} />}
        />
      </Routes>
    </div>
  );
}

export default App;
