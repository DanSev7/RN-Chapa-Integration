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

## Chapa Integration

To use the Chapa payment gateway, you'll need to:

1. Sign up for a merchant account at [Chapa](https://chapa.co/)
2. Obtain your public and secret keys from the dashboard
3. Update the `.env` file with your keys:
   ```
   CHAPA_SECRET_KEY=your_secret_key_here
   CHAPA_PUBLIC_KEY=your_public_key_here
   ```

## Usage

1. Start both the frontend and backend servers
2. Open the app in Expo Go on your device or emulator
3. Navigate to the "Pricing" tab
4. Select a plan and fill in your payment details
5. The app will communicate with the backend to initialize the Chapa payment
6. Payment is processed in a WebView within the app
7. After successful payment, you'll see a success popup

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
1. Update the API URL in `PricingPlanApp/services/paymentService.ts`
2. Build the app for your target platforms:
   ```bash
   # For Android
   npx expo build:android
   
   # For iOS
   npx expo build:ios
   ```

## Customization

You can customize the pricing plans by modifying:
- `PricingPlanApp/app/(tabs)/pricing.tsx` - Plan details and pricing
- `PricingPlanApp/components/PricingCard.tsx` - Card styling and layout

## Learn More

To learn more about the technologies used:

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Chapa Developer Documentation](https://developer.chapa.co/)