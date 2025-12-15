# Chapa Payment Integration Technical Summary

## Overview

This document provides a technical overview of how the React Native app integrates with the Chapa payment gateway using a WebView-based approach that keeps users within the app during the payment process.

## Key Components

### 1. Frontend (React Native with Expo)
- **Entry Point**: `PricingPlanApp/app/index.tsx`
- **Payment Service**: `PricingPlanApp/services/paymentService.ts`
- **Environment Config**: `PricingPlanApp/config/environment.ts`

### 2. Backend (Node.js with Express)
- **Main Server**: `backend/server.js`
- **Chapa Service**: `backend/services/chapaService.js`
- **Success Page**: `backend/public/close.html`

## Payment Flow

### Step 1: User Interaction
1. User selects a pricing plan
2. User fills in payment details (email, name)
3. App validates input and calls `initializePayment()` service

### Step 2: Backend Processing
```typescript
// Frontend service call
const response = await apiClient.post('/payment', paymentData);
```

```javascript
// Backend route handler
app.post('/api/payment', async (req, res) => {
  const { amount, email, firstName, lastName, plan } = req.body;
  const paymentResponse = await chapaService.initializePayment(paymentData);
  res.json({ success: true, data: paymentResponse });
});
```

### Step 3: Chapa API Communication
```javascript
// Chapa service integration
const data = {
  amount: amount.toString(),
  currency: 'ETB',
  email: paymentData.email,
  first_name: paymentData.firstName,
  last_name: paymentData.lastName,
  tx_ref: tx_ref,
  callback_url: 'https://api.ethiotechleaders.com/api/webhook/chapa',
  return_url: 'https://api.ethiotechleaders.com/close-webview'
};

const response = await this.client.post('/transaction/initialize', data);
```

### Step 4: WebView Display
```typescript
// Frontend receives checkout URL and displays in WebView
if (response.data.checkout_url) {
  setWebViewUrl(response.data.checkout_url);
  setShowWebView(true);
}
```

### Step 5: Payment Completion
1. User completes payment on Chapa's secure page
2. Chapa redirects to `return_url` (our `/close-webview` endpoint)
3. Server serves `close.html` which communicates with WebView

### Step 6: Success Notification
```html
<!-- close.html sends message to React Native app -->
<script>
  window.ReactNativeWebView.postMessage('PAYMENT_SUCCESS');
</script>
```

```typescript
// Frontend handles the message
const handleWebViewMessage = (event: any) => {
  if (event.nativeEvent.data === 'PAYMENT_SUCCESS') {
    closeWebView();
    setShowSuccessPopup(true);
  }
};
```

## Security Considerations

1. **API Keys**: Stored securely in environment variables, never in client code
2. **HTTPS**: All communication uses HTTPS in production
3. **Input Validation**: Both frontend and backend validate payment data
4. **Transaction References**: Unique, server-generated transaction IDs

## Error Handling

1. **Network Errors**: Caught and displayed to user with helpful messages
2. **Validation Errors**: Chapa's validation errors are passed through to the UI
3. **Server Errors**: Backend errors are logged and returned as user-friendly messages

## WebView Communication Methods

The integration uses two complementary methods to ensure reliable communication:

1. **Post Message API**: JavaScript interface between WebView and React Native
2. **Navigation State Monitoring**: Detects when WebView reaches specific URLs

## Configuration

### Development Environment
```typescript
// config/environment.ts
const ENV = {
  development: {
    apiUrl: 'http://192.168.1.6:5000/api', // Local development server
  },
  production: {
    apiUrl: 'https://api.ethiotechleaders.com/api', // Production API
  },
};
```

### Chapa Configuration
```javascript
// .env file
CHAPA_SECRET_KEY=your_secret_key
CHAPA_PUBLIC_KEY=your_public_key
```

## Key Benefits of This Approach

1. **Seamless User Experience**: No external browser redirects
2. **Secure**: API keys never exposed to client-side code
3. **Reliable**: Multiple communication methods between WebView and app
4. **Maintainable**: Clear separation of concerns between frontend and backend
5. **Scalable**: Easy to add new payment methods or features