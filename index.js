const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(`${__dirname}/dist`));

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`, (err) => {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server started on http://localhost:3000');
});
