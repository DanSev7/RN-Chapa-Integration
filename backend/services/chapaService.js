const axios = require('axios');

class ChapaService {
  constructor() {
    // Store the secret key
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: 'https://api.chapa.co/v1',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Initialize a payment transaction with Chapa
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} - Payment response from Chapa
   */
  async initializePayment(paymentData) {
    try {
      // Generate a unique transaction reference
      const tx_ref = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Ensure amount is a string
      const amount = typeof paymentData.amount === 'number' ? 
        paymentData.amount.toString() : 
        paymentData.amount;
      
      // Prepare payment data for Chapa
      const data = {
        amount: amount,
        currency: 'ETB',
        email: paymentData.email || 'user@example.com',
        first_name: paymentData.firstName || 'User',
        last_name: paymentData.lastName || 'Customer',
        tx_ref: tx_ref,
        callback_url: 'https://api.ethiotechleaders.com/api/webhook/chapa',
        return_url: 'https://api.ethiotechleaders.com/close-webview' // Updated to point to our close page
      };

      console.log('Sending data to Chapa API:', data);
      console.log("Return_url",data.return_url);

      // Make direct HTTP request to Chapa
      const response = await this.client.post('/transaction/initialize', data);
      
      console.log('Chapa API response:', response.data);
      
      // Return the response along with our transaction reference and checkout URL
      return {
        success: true,
        tx_ref: tx_ref,
        checkout_url: response.data.data.checkout_url,
        ...response.data
      };
    } catch (error) {
      console.error('Chapa initialization error:', error.response?.data || error.message);
      throw new Error(`Failed to initialize payment: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  /**
   * Verify a payment transaction with Chapa
   * @param {string} tx_ref - Transaction reference
   * @returns {Promise<Object>} - Verification response from Chapa
   */
  async verifyPayment(tx_ref) {
    try {
      // Make direct HTTP request to Chapa to verify payment
      const response = await this.client.get(`/transaction/verify/${tx_ref}`);
      return response.data;
    } catch (error) {
      console.error('Chapa verification error:', error.response?.data || error.message);
      throw new Error(`Failed to verify payment: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }
}

module.exports = ChapaService;