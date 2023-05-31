const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());

// Endpoint to fetch parent transactions
app.get('/api/parents', (req, res) => {
    const parentData = JSON.parse(fs.readFileSync('parent.json'));
    const { page = 1, pageSize = 2, sort = 'id' } = req.query;
  
    // Apply sorting
    parentData.data.sort((a, b) => {
      if (a[sort] < b[sort]) return -1;
      if (a[sort] > b[sort]) return 1;
      return 0;
    });
  
    // Calculate pagination offsets
    const offset = (page - 1) * pageSize;
    const paginatedData = parentData.data.slice(offset, offset + parseInt(pageSize));
  
    res.json(paginatedData);
  });  

  app.get('/api/child', (req, res) => {
    const childData = JSON.parse(fs.readFileSync('child.json'));
    const parentId = req.query.parentId;
  
    // Filter the child data by parent ID if parentId is provided
    const filteredChildData = parentId ? childData.data.filter((child) => child.parentId === parentId) : childData.data;
  
    // Sort the child data by ID
    const sortedChildData = filteredChildData.sort((a, b) => a.id - b.id);
  
    res.json(sortedChildData);
  });  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
