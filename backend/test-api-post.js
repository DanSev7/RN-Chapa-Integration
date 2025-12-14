const axios = require('axios');

// Test data for the payment request
const testData = {
  amount: 100,
  email: 'test@gmail.com',
  firstName: 'Test',
  lastName: 'User',
  plan: 'Basic'
};

console.log('Testing POST request to https://api.ethiotechleaders.com/api/payment');
console.log('Test data:', testData);

// Send POST request to your API
axios.post('https://api.ethiotechleaders.com/api/payment', testData)
  .then(response => {
    console.log('\n✅ Success! Response received:');
    console.log('Status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data && response.data.data.checkout_url) {
      console.log('\n📋 Checkout URL:', response.data.data.checkout_url);
      console.log('\n🎉 API is working correctly!');
    }
  })
  .catch(error => {
    console.log('\n❌ Error occurred:');
    if (error.response) {
      // Server responded with error status
      console.log('Status:', error.response.status);
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Request was made but no response received
      console.log('No response received from server');
      console.log('Error message:', error.message);
    } else {
      // Something else happened
      console.log('Error message:', error.message);
    }
  });