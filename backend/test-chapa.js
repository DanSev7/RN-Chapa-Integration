require('dotenv').config();
const axios = require('axios');

console.log('Testing Chapa API integration...');

// Create axios instance with default config
const client = axios.create({
  baseURL: 'https://api.chapa.co/v1',
  headers: {
    'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

console.log('Client initialized successfully');
console.log('Secret Key:', process.env.CHAPA_SECRET_KEY ? 'Loaded' : 'Not loaded');

// Test data
const data = {
  amount: '100',
  currency: 'ETB',
  email: 'user@gmail.com',
  first_name: 'User',
  last_name: 'Customer',
  tx_ref: `test_${Date.now()}`,
  callback_url: 'http://192.168.1.7:5000/api/webhook/chapa',
  return_url: 'http://192.168.1.7:8081'
};

console.log('Test data prepared:', data);

// Try to initialize payment
client.post('/transaction/initialize', data)
  .then(response => {
    console.log('Chapa API initialize SUCCESS:', response.data);
  })
  .catch(error => {
    console.error('Chapa API initialize error:', error.response?.data || error.message);
  });