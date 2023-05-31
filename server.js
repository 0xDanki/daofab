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
    res.json(childData.data);
  });  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
