# Deployment Checklist

This checklist ensures you've completed all necessary steps for deploying your Pricing Plan App.

## Backend Deployment (cPanel)

- [ ] Update Chapa API keys in `.env` file
- [ ] Upload all backend files to cPanel
- [ ] Set up Node.js application in cPanel
- [ ] Install dependencies using "Run NPM Install"
- [ ] Configure environment variables in cPanel
- [ ] Start the application
- [ ] Test API endpoints (`/`, `/health`, `/close-webview`)

## Frontend Preparation

- [ ] Update API URL in `config/environment.ts` for production
- [ ] Test app with new API URL
- [ ] Commit all changes to version control

## Production Build

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to Expo: `eas login`
- [ ] Configure build settings: `eas build:configure`
- [ ] Update `eas.json` if needed
- [ ] Run production build:
  - Android: `eas build --profile production --platform android`
  - iOS: `eas build --profile production --platform ios`

## Post-Build Actions

- [ ] Download built APK/AAB (Android) or IPA (iOS)
- [ ] Test the app thoroughly on physical devices
- [ ] Submit to app stores if needed
- [ ] Update documentation with new version information

## Final Verification

- [ ] Verify payment flow works with deployed backend
- [ ] Confirm WebView integration functions correctly
- [ ] Test success popup appears after payment
- [ ] Ensure app returns to home screen after payment
- [ ] Check error handling and user feedback

## Security Review

- [ ] Confirm Chapa secret key is not exposed in client-side code
- [ ] Verify HTTPS is used for all API communications
- [ ] Check that environment variables are properly secured
- [ ] Review CORS configuration on backend

## Monitoring Setup

- [ ] Set up crash reporting
- [ ] Configure analytics
- [ ] Establish logging for backend
- [ ] Create monitoring alerts for critical services

---

**Note**: Make sure to complete each step in order and verify success before moving to the next step.