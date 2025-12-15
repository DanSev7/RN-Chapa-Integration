const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const ChapaService = require('./services/chapaService');

const app = express();
// Use process.env.PORT for cPanel, fallback to 5000 for local development
const PORT = process.env.PORT || 5000;

// Initialize Chapa service
const chapaService = new ChapaService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chapa Payment Gateway API', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Chapa Payment Gateway',
    timestamp: new Date().toISOString()
  });
});

// Payment route
app.post('/api/payment', async (req, res) => {
  try {
    const { amount, email, firstName, lastName, plan } = req.body;
    
    // Validate required fields
    if (!amount || !email || !firstName || !lastName || !plan) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, email, firstName, lastName, plan' 
      });
    }
    
    // Create payment data object
    const paymentData = {
      amount,
      email,
      firstName,
      lastName,
      plan
    };
    
    // Initialize payment with Chapa
    const paymentResponse = await chapaService.initializePayment(paymentData);
    
    res.json({
      success: true,
      message: 'Payment initialized successfully',
      data: paymentResponse
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while processing the payment' 
    });
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the close-webview page
app.get('/close-webview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'close.html'));
});

// Webhook endpoint for Chapa to send payment notifications
app.post('/api/webhook/chapa', async (req, res) => {
  try {
    console.log('Webhook received:', req.body);
    
    // Extract transaction reference and status
    const { tx_ref, status } = req.body;
    
    if (tx_ref && status) {
      // Verify the payment with Chapa
      const verification = await chapaService.verifyPayment(tx_ref);
      
      console.log(`Payment ${status} for transaction ${tx_ref}`, verification);
      
      // If payment is successful, you might want to update user's plan in your database
      if (status === 'success') {
        console.log('Payment successful for transaction:', tx_ref);
        // Here you would typically update the user's subscription in your database
      }
    }
    
    // Send success response to Chapa
    res.json({ 
      success: true, 
      message: 'Webhook received successfully' 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing the webhook' 
    });
  }
});

// Verification endpoint for checking payment status
app.get('/api/verify/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    if (!tx_ref) {
      return res.status(400).json({ 
        error: 'Transaction reference is required' 
      });
    }
    
    // Verify payment with Chapa
    const verification = await chapaService.verifyPayment(tx_ref);
    
    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while verifying the payment' 
    });
  }
});

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  // Bind to all network interfaces to allow connections from other devices
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Accessible at http://localhost:${PORT}`);
    console.log(`Accessible on network at 192.168.1.6:${PORT}`);
  });
}

// Export app for testing or importing in other files
module.exports = app;