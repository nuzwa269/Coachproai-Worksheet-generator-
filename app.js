const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const skills = require('../skills');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Generate worksheet (AI placeholder)
app.post('/api/generate', async (req, res) => {
  const { type, difficulty } = req.body;
  // Placeholder: Use skills.generate_phonics_worksheet
  const worksheet = await skills.generate_phonics_worksheet(type, difficulty);
  res.json(worksheet);
});

// Generate PDF
app.post('/api/pdf', async (req, res) => {
  const { worksheet } = req.body;
  // Placeholder: Use skills.generate_pdf_worksheet
  const pdfBuffer = await skills.generate_pdf_worksheet(worksheet);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
});

// Serve icons
app.get('/api/icons/:icon', (req, res) => {
  const iconName = req.params.icon;
  res.sendFile(`${__dirname}/../example_data/icons/${iconName}`);
});

app.listen(4001, () => {
  console.log('Backend running on port 4001');
});
