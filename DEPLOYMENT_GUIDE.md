# Deployment Guide: Node.js Backend to cPanel

This guide will help you deploy your Node.js backend to cPanel hosting.

## Prerequisites

1. cPanel hosting account with Node.js support
2. Chapa API keys (secret and public)
3. FTP/SFTP access to your hosting account
4. Domain or subdomain for your API

## Step 1: Prepare Files for Deployment

All the necessary files are already in your `backend` directory:
- `server.js` - Main server file
- `package.json` - Dependencies and scripts
- `services/chapaService.js` - Chapa integration
- `public/close.html` - WebView closing page
- `.env` - Environment variables (you'll recreate this on the server)

## Step 2: Update Environment Variables

Before deploying, you need to update the Chapa API keys in your `.env` file:

```
CHAPA_SECRET_KEY=your_actual_secret_key_here
CHAPA_PUBLIC_KEY=your_actual_public_key_here
```

**Important**: Never commit your actual API keys to version control. Keep them secure.

## Step 3: Upload Files to cPanel

### Option A: Using cPanel File Manager
1. Log in to your cPanel
2. Go to File Manager
3. Navigate to your desired directory (usually `public_html` or a subdirectory)
4. Upload all files from your `backend` folder:
   - `server.js`
   - `package.json`
   - `services/` folder
   - `public/` folder
   - `.env` file (with your actual keys)

### Option B: Using FTP/SFTP
1. Connect to your hosting using an FTP client
2. Navigate to your desired directory
3. Upload all files from your `backend` folder

## Step 4: Set Up Node.js Application in cPanel

1. Log in to your cPanel
2. Scroll down to the "Software" section
3. Click on "Setup Node.js App"
4. Click "Create Application"
5. Fill in the form:
   - **Node.js Version**: Select the latest stable version available
   - **Application Mode**: Production
   - **Application Root**: Path where you uploaded files (e.g., `/home/username/public_html/api`)
   - **Application URL**: Subdomain or domain where you want the API (e.g., `api.yourdomain.com`)
   - **Application Startup File**: `server.js`
6. Click "Create"

## Step 5: Install Dependencies

After creating the application:
1. In the Node.js app interface, you'll see your application
2. Click on "Run NPM Install" to install all dependencies
3. Wait for the installation to complete

## Step 6: Configure Environment Variables

1. In the Node.js app interface, scroll to the "Environment Variables" section
2. Add your Chapa API keys:
   - Key: `CHAPA_SECRET_KEY`, Value: `your_secret_key`
   - Key: `CHAPA_PUBLIC_KEY`, Value: `your_public_key`
3. Click "Add" for each variable

## Step 7: Start the Application

1. In the Node.js app interface, click "Start App"
2. Wait for the application to start
3. You should see a green indicator when it's running

## Step 8: Test Your Deployment

Visit your API endpoint to verify it's working:
- `https://yourdomain.com/` - Should return API information
- `https://yourdomain.com/health` - Should return health status
- `https://yourdomain.com/close-webview` - Should show the close page

## Step 9: Update Frontend Configuration

Update your React Native app to use the new API URL:

In `PricingPlanApp/services/paymentService.ts`, change:
```javascript
const API_BASE_URL = 'http://192.168.1.7:5000/api';
```

To your deployed URL:
```javascript
const API_BASE_URL = 'https://yourdomain.com/api';
```

## Troubleshooting

### Common Issues:

1. **Application won't start**:
   - Check error logs in cPanel Node.js interface
   - Ensure all environment variables are set
   - Verify dependencies installed correctly

2. **404 Errors**:
   - Check Application URL in cPanel setup
   - Ensure routes are correctly defined in server.js

3. **CORS Issues**:
   - Update CORS configuration in server.js if needed
   - Add your frontend domain to allowed origins

4. **Chapa Integration Issues**:
   - Verify API keys are correct
   - Check that return URLs match your domain

### Checking Logs:

1. In cPanel Node.js interface, click "Logs" to view application logs
2. Check for any error messages
3. Look for startup errors or runtime exceptions

## Security Considerations

1. **API Keys**: Never expose your Chapa secret key in client-side code
2. **HTTPS**: Ensure your API is served over HTTPS
3. **Rate Limiting**: Consider implementing rate limiting for public endpoints
4. **Input Validation**: Validate all inputs in your API endpoints

## Updating Your Application

To update your application after changes:

1. Upload new files via FTP/SFTP or File Manager
2. In cPanel Node.js interface, click "Restart App"
3. If you changed dependencies, click "Run NPM Install" again

## Support

If you encounter issues:
1. Check the official cPanel documentation
2. Contact your hosting provider support
3. Review Node.js application logs
4. Verify all steps in this guide were followed correctly