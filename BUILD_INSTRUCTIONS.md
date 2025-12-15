# Build Instructions for Pricing Plan App

This guide explains how to build your React Native app for production after deploying your backend.

## Prerequisites

1. Deployed backend (following DEPLOYMENT_GUIDE.md)
2. Expo account (free at https://expo.dev/)
3. EAS CLI installed globally:
   ```bash
   npm install -g eas-cli
   ```

## Step 1: Update API Configuration

Before building, update the API URL in your frontend:

1. Open `PricingPlanApp/config/environment.ts`
2. Update the production `apiUrl` to your deployed backend URL:
   ```typescript
   const ENV = {
     development: {
       apiUrl: 'http://192.168.1.6:5000/api', // Local development server
     },
     production: {
       apiUrl: 'https://your-deployed-domain.com/api', // Production API
     },
   };
   ```

## Step 2: Login to Expo

```bash
cd PricingPlanApp
eas login
```

## Step 3: Configure Build Settings

Run the configuration wizard:
```bash
eas build:configure
```

This will create an `eas.json` file with default build profiles.

## Step 4: Update eas.json (if needed)

The configuration wizard should create this file, but if you need to customize it, here's a sample:

```json
{
  "cli": {
    "version": ">= 2.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Step 5: Build for Development (Optional)

For testing builds locally:
```bash
eas build --profile development --platform android
```

Or for iOS:
```bash
eas build --profile development --platform ios
```

## Step 6: Build for Production

### Android Build

```bash
eas build --profile production --platform android
```

### iOS Build

```bash
eas build --profile production --platform ios
```

## Step 7: Submit to App Stores (Optional)

### Google Play Store

```bash
eas submit --platform android
```

### Apple App Store

```bash
eas submit --platform ios
```

## Environment-Specific Configurations

### Development
- API URL: `http://192.168.1.6:5000/api`
- Debugging enabled
- Development client

### Production
- API URL: `https://your-deployed-domain.com/api`
- Optimized builds
- Production signing keys

## Payment Integration in Production

Your app implements a secure, WebView-based payment flow:

1. **Frontend**: React Native app sends payment requests to your backend
2. **Backend**: Node.js server communicates with Chapa's API
3. **Payment Processing**: Chapa checkout is displayed in a WebView within the app
4. **Success Handling**: After payment, Chapa redirects to `/close-webview` which serves a special page that communicates back to the app
5. **Redirection**: The WebView sends a `PAYMENT_SUCCESS` message to the React Native app, which then shows a success popup

## Troubleshooting

### Common Build Issues

1. **Build fails with dependency issues**:
   - Run `npm install` to ensure all dependencies are installed
   - Check that all native dependencies are compatible

2. **API connection issues**:
   - Verify your deployed backend is running
   - Check that the API URL in `environment.ts` is correct
   - Ensure CORS is configured properly on your backend

3. **Asset loading issues**:
   - Make sure all images and assets are in the correct directories
   - Verify asset paths in your components

4. **Signing key issues**:
   - For Android, you can let Expo handle this or provide your own keystore
   - For iOS, you'll need to configure provisioning profiles

### Checking Build Logs

```bash
eas build:list
eas build:log <build-id>
```

## Post-Build Steps

1. Download the built APK/AAB (Android) or IPA (iOS)
2. Test the app thoroughly, especially the payment flow
3. Update your app stores with the new version
4. Monitor crash reports and user feedback

## Updating Your App

To release updates:

1. Make your code changes
2. Update the version number in `app.json`:
   ```json
   {
     "expo": {
       "version": "1.0.1"  // Increment this
     }
   }
   ```
3. Run a new build:
   ```bash
   eas build --profile production --platform all
   ```
4. Submit to app stores

## Best Practices

1. **Version Control**: Always commit your changes before building
2. **Testing**: Test on multiple devices and OS versions, especially the complete payment flow
3. **Backup**: Keep backups of successful builds
4. **Documentation**: Document changes for each release
5. **Monitoring**: Set up crash reporting and analytics

## Support

If you encounter issues:
1. Check the Expo documentation
2. Review build logs for specific error messages
3. Consult the Expo forums or community
4. Verify all steps in this guide were followed correctly