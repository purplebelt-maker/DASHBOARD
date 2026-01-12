# Netlify Environment Variables Setup Guide

## Required Environment Variables

You need to set the following environment variables in Netlify for the Kalshi API integration to work:

### 1. **KALSHI_API_KEY_ID** (Required)
- Your Kalshi API Key ID
- Example: `E8edb99d-7708-49d7-ab1b-d4be8ada9a70`

### 2. **KALSHI_PRIVATE_KEY** (Required)
- Your Kalshi RSA Private Key
- Must include the full key with BEGIN and END markers
- Format:
  ```
  -----BEGIN RSA PRIVATE KEY-----
  MIIEpQIBAAKCAQEA...
  ... (full key content) ...
  -----END RSA PRIVATE KEY-----
  ```

### 3. **NEXT_PUBLIC_KALSHI_API_BASE_URL** (Optional)
- Default: `https://api.elections.kalshi.com/trade-api/v2`
- Only set this if you need to use a different API endpoint

### 4. **NEXT_PUBLIC_API_REFRESH_INTERVAL** (Optional)
- Default: `60000` (60 seconds)
- Refresh interval in milliseconds for auto-updating market data

---

## How to Add Environment Variables in Netlify

### Step 1: Access Netlify Dashboard
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Log in to your account
3. Select your site (the DASHBOARD project)

### Step 2: Navigate to Site Settings
1. Click on **Site settings** (or go to: Site → Site settings)
2. In the left sidebar, click on **Environment variables**

### Step 3: Add Environment Variables
1. Click the **Add a variable** button
2. For each variable, enter:
   - **Key**: The variable name (e.g., `KALSHI_API_KEY_ID`)
   - **Value**: The variable value
   - **Scopes**: Select where it applies:
     - ✅ **All scopes** (recommended) - applies to all deployments
     - Or select specific scopes (Production, Deploy previews, Branch deploys)

### Step 4: Add Each Variable

#### Variable 1: KALSHI_API_KEY_ID
- **Key**: `KALSHI_API_KEY_ID`
- **Value**: Your API Key ID (from your .env.local file)
- **Scopes**: All scopes

#### Variable 2: KALSHI_PRIVATE_KEY
- **Key**: `KALSHI_PRIVATE_KEY`
- **Value**: Your full RSA private key including:
  ```
  -----BEGIN RSA PRIVATE KEY-----
  [paste your full key here]
  -----END RSA PRIVATE KEY-----
  ```
- **Important**: 
  - Copy the ENTIRE key including BEGIN and END lines
  - Keep all newlines as they are
  - **Scopes**: All scopes

#### Variable 3: NEXT_PUBLIC_KALSHI_API_BASE_URL (Optional)
- **Key**: `NEXT_PUBLIC_KALSHI_API_BASE_URL`
- **Value**: `https://api.elections.kalshi.com/trade-api/v2`
- **Scopes**: All scopes
- **Note**: Only add this if you want to override the default

#### Variable 4: NEXT_PUBLIC_API_REFRESH_INTERVAL (Optional)
- **Key**: `NEXT_PUBLIC_API_REFRESH_INTERVAL`
- **Value**: `60000`
- **Scopes**: All scopes
- **Note**: Only add this if you want to change the refresh interval

### Step 5: Save and Redeploy
1. After adding all variables, click **Save** (if there's a save button)
2. Go to **Deploys** tab
3. Click **Trigger deploy** → **Deploy site** to redeploy with the new environment variables

---

## Important Notes

### ⚠️ Security
- **Never commit** `.env.local` to Git (it's already in `.gitignore`)
- Environment variables in Netlify are encrypted and secure
- Only people with site access can see environment variables

### 🔄 After Adding Variables
- **You MUST redeploy** for the variables to take effect
- Existing deployments won't have access to new variables
- Go to **Deploys** → **Trigger deploy** → **Deploy site**

### 📝 Private Key Format
When adding `KALSHI_PRIVATE_KEY` in Netlify:
- You can paste it as a multi-line string
- Netlify will preserve the newlines
- Make sure to include the BEGIN and END markers

### ✅ Verification
After redeploying, check:
1. Go to your deployed site
2. Open browser DevTools (F12) → Network tab
3. Check if `/api/kalshi/markets` returns data (not errors)
4. If you see authentication errors, double-check the variable names and values

---

## Quick Checklist

- [ ] Added `KALSHI_API_KEY_ID`
- [ ] Added `KALSHI_PRIVATE_KEY` (with full key including BEGIN/END)
- [ ] (Optional) Added `NEXT_PUBLIC_KALSHI_API_BASE_URL`
- [ ] (Optional) Added `NEXT_PUBLIC_API_REFRESH_INTERVAL`
- [ ] Redeployed the site
- [ ] Verified the API is working on the deployed site

---

## Troubleshooting

### Issue: "Kalshi API credentials not configured"
- **Solution**: Make sure both `KALSHI_API_KEY_ID` and `KALSHI_PRIVATE_KEY` are set
- Redeploy after adding variables

### Issue: "Invalid signature" or authentication errors
- **Solution**: 
  - Check that `KALSHI_PRIVATE_KEY` includes the BEGIN and END markers
  - Make sure the private key is complete (not truncated)
  - Verify the API Key ID matches the private key

### Issue: Variables not working after adding
- **Solution**: 
  - Redeploy the site (variables only apply to new deployments)
  - Check that variable names match exactly (case-sensitive)
  - Verify you selected the correct scopes

---

## Need Help?

If you encounter issues:
1. Check Netlify deployment logs for error messages
2. Verify variable names match exactly (case-sensitive)
3. Ensure you redeployed after adding variables
4. Check that the private key format is correct

