const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(__dirname + '/dist'));

app.listen(PORT, () => {
  console.log('server started on http://localhost:3000');
});
