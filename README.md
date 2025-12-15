# Pricing Plan App with Chapa Payment Integration

This is a React Native application with a Node.js backend that demonstrates a pricing plan selection interface with Chapa payment gateway integration.

## Features

- Three-tier pricing plan UI
- React Native frontend built with Expo
- Node.js backend with Express
- Chapa payment gateway integration
- TypeScript support
- WebView-based payment processing
- Modern, responsive UI

## Project Structure

```
├── PricingPlanApp/          # React Native frontend
│   ├── app/                 # Application screens
│   ├── components/          # Reusable UI components
│   ├── services/            # API service files
│   └── ...                  # Other frontend files
├── backend/                 # Node.js backend
│   ├── services/            # Business logic
│   ├── server.js            # Main server file
│   └── ...                  # Other backend files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Chapa merchant account

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd PricingPlanApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Chapa keys to the `.env` file

4. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Chapa Integration Logic

Our application implements a secure, WebView-based payment flow that keeps users within the app during the payment process. Here's how it works:

### 1. Frontend Payment Initialization

When a user selects a pricing plan and submits their payment details, the app makes a request to our backend:

```typescript
// PricingPlanApp/services/paymentService.ts
export const initializePayment = async (paymentData: {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  plan: string;
}) => {
  try {
    const response = await apiClient.post('/payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment initialization error:', error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data) {
        const data = axiosError.response.data as { error?: string };
        throw new Error(data.error || 'Failed to initialize payment');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};
```

### 2. Backend Chapa Integration

The backend receives the payment request and communicates with Chapa's API:

```javascript
// backend/services/chapaService.js
async initializePayment(paymentData) {
  try {
    // Generate a unique transaction reference
    const tx_ref = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Prepare payment data for Chapa
    const data = {
      amount: paymentData.amount.toString(),
      currency: 'ETB',
      email: paymentData.email,
      first_name: paymentData.firstName,
      last_name: paymentData.lastName,
      tx_ref: tx_ref,
      callback_url: 'https://api.ethiotechleaders.com/api/webhook/chapa',
      return_url: 'https://api.ethiotechleaders.com/close-webview'
    };

    // Make direct HTTP request to Chapa
    const response = await this.client.post('/transaction/initialize', data);
    
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
```

### 3. WebView Payment Processing

The frontend receives the checkout URL and displays it in a WebView:

```typescript
// PricingPlanApp/app/index.tsx
const handlePaymentSubmit = async () => {
  // ... validation code ...
  
  try {
    const response = await initializePayment({
      amount: selectedPlan.amount,
      email: paymentData.email,
      firstName: paymentData.firstName,
      lastName: paymentData.lastName,
      plan: selectedPlan.title,
    });

    if (response.success) {
      // Show Chapa checkout in WebView
      if (response.data.checkout_url) {
        setWebViewUrl(response.data.checkout_url);
        setShowPaymentForm(false);
        setShowWebView(true);
        resetPaymentForm();
      }
    }
  } catch (error) {
    Alert.alert('Payment Error', (error as Error).message || 'An unexpected error occurred');
  }
};
```



## Payment Success Popup and Redirection

### Success Popup Handling

After a successful payment, Chapa redirects to our `close-webview` endpoint, which serves a special HTML page that communicates with the WebView:

```html
<!-- backend/public/close.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Payment Complete</title>
  <!-- ... styling ... -->
</head>
<body>
  <div class="container">
    <div class="success-icon">✓</div>
    <h2>Payment Successful!</h2>
    <p>Your payment has been processed successfully. Thank you for your purchase.</p>
    <p>Returning to the app...</p>
    <button id="closeButton">
      <span class="loading"></span>Returning to App
    </button>
  </div>
  
  <script>
    function closeWindow() {
      // Try to close the WebView
      try {
        window.close();
      } catch (e) {
        console.log('Could not close window automatically');
      }
      
      // Notify the parent app that payment is complete
      try {
        window.ReactNativeWebView.postMessage('PAYMENT_SUCCESS');
      } catch (e) {
        console.log('Could not send message to parent app');
      }
    }
    
    // Try to close automatically after 1 second
    setTimeout(closeWindow, 1000);
  </script>
</body>
</html>
```

### WebView Communication

The React Native app listens for messages from the WebView to handle the success state:

```typescript
// PricingPlanApp/app/index.tsx
// Handle messages from WebView
const handleWebViewMessage = (event: any) => {
  try {
    const data = event.nativeEvent.data;
    console.log('Received message from WebView:', data);
    
    if (data === 'PAYMENT_SUCCESS') {
      // Close the WebView and show success popup
      closeWebView();
      setShowSuccessPopup(true);
      
      // Automatically close the success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
  } catch (error) {
    console.error('Error handling WebView message:', error);
  }
};

// Handle WebView navigation state changes
const handleWebViewNavigationStateChange = (navState: any) => {
  // Check if we've reached the close-webview page
  if (navState.url && navState.url.includes('/close-webview')) {
    console.log('Detected close-webview page, sending success message');
    // Close the WebView and show success popup
    closeWebView();
    setShowSuccessPopup(true);
    
    // Automatically close the success popup after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  }
};
```

### Backend Route for Close-WebView

The backend has a dedicated route to serve the close-webview page:

```javascript
// backend/server.js
// Route to serve the close-webview page
app.get('/close-webview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'close.html'));
});
```

## API Endpoints

- `POST /api/payment` - Initialize a payment
- `GET /api/verify/:tx_ref` - Verify a payment
- `POST /api/webhook/chapa` - Receive payment notifications from Chapa
- `GET /health` - Health check endpoint
- `GET /close-webview` - WebView closing page

## Deployment

### Backend Deployment

The backend can be deployed to cPanel hosting. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Frontend Deployment

For production release:
1. Update the API URL in `PricingPlanApp/config/environment.ts`
2. Build the app for your target platforms:
   ```bash
   # For Android
   npx expo build:android
   
   # For iOS
   npx expo build:ios
   ```

## Customization

You can customize the pricing plans by modifying:
- `PricingPlanApp/app/index.tsx` - Plan details and pricing
- `PricingPlanApp/components/PricingCard.tsx` - Card styling and layout

## Learn More

To learn more about the technologies used:

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Chapa Developer Documentation](https://developer.chapa.co/)