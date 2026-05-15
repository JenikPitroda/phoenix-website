const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/inquiry', (req, res) => {
  const { name, company, country, product, volume, message } = req.body;

  if (!name || !company || !country || !product || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.'
    });
  }

  const inquiry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name: name.trim(),
    company: company.trim(),
    country: country.trim(),
    product: product.trim(),
    volume: (volume || '').trim(),
    message: message.trim()
  };

  console.log('\n=== New Inquiry Received ===');
  console.log(`Name:     ${inquiry.name}`);
  console.log(`Company:  ${inquiry.company}`);
  console.log(`Country:  ${inquiry.country}`);
  console.log(`Product:  ${inquiry.product}`);
  console.log(`Volume:   ${inquiry.volume || 'Not specified'}`);
  console.log(`Message:  ${inquiry.message}`);
  console.log(`Time:     ${inquiry.timestamp}`);
  console.log('============================\n');

  const inquiriesFile = path.join(__dirname, 'inquiries.json');
  let inquiries = [];

  if (fs.existsSync(inquiriesFile)) {
    try {
      inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
    } catch (e) {
      inquiries = [];
    }
  }

  inquiries.push(inquiry);
  fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2));

  res.json({
    success: true,
    message: 'Thank you for your inquiry. Our team will respond within 24 hours.'
  });
});

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Phoenix International running at http://localhost:${PORT}`);
});
