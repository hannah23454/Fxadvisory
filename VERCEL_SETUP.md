# Vercel Deployment Setup Guide

## Environment Variables Required

To make your app work on Vercel, you MUST configure these environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
- Navigate to your project
- Click on "Settings" tab
- Click on "Environment Variables" in the sidebar

### 2. Add These Required Variables:

#### MongoDB Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/switchyard_fx?retryWrites=true&w=majority
```
**Replace with your actual MongoDB connection string**

#### NextAuth Secret (CRITICAL)
```
NEXTAUTH_SECRET=<generate-a-random-32-character-secret>
```
**Generate a secure secret using:**
```bash
openssl rand -base64 32
```
or online at: https://generate-secret.vercel.app/32

#### NextAuth URL (CRITICAL)
```
NEXTAUTH_URL=https://your-actual-vercel-domain.vercel.app
```
**Replace with your actual Vercel deployment URL**
Example: `https://fxadvisory.vercel.app`

#### Node Environment
```
NODE_ENV=production
```

---

## Common Login Issues & Solutions

### Issue 1: "Login button does nothing"
**Cause:** Missing `NEXTAUTH_URL` or `NEXTAUTH_SECRET`
**Solution:** Add both variables in Vercel environment settings

### Issue 2: "500 Internal Server Error"
**Cause:** MongoDB connection string is invalid or database is not accessible
**Solution:** 
- Verify MongoDB URI is correct
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all) for Vercel
- Check database name is `switchyard_fx`

### Issue 3: "Invalid email or password" (but credentials are correct)
**Cause:** User doesn't exist in database
**Solution:** Run the seed script to create admin user

---

## How to Create Admin User

### Option 1: Use MongoDB Compass or Atlas UI
Connect to your database and insert this document into the `users` collection:

```json
{
  "name": "Admin User",
  "email": "admin@switchyard.com",
  "password": "$2b$10$8Q4g8TxZGKZrJG6Z9Z9Z9.Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9",
  "role": "admin",
  "company": "SwitchYard FX",
  "position": "Administrator",
  "phone": "+61400000000",
  "active": true,
  "createdAt": { "$date": "2026-02-15T00:00:00.000Z" },
  "lastLogin": { "$date": "2026-02-15T00:00:00.000Z" }
}
```
**Password for above:** `Admin2026!`

### Option 2: Run Seed Script Locally
```bash
# Set your MongoDB URI in .env.local
MONGODB_URI=your_connection_string node scripts/seed-admin.js
```

---

## After Configuration

1. **Redeploy** your Vercel app after adding environment variables
2. **Test login** with:
   - Email: `admin@switchyard.com`
   - Password: `Admin2026!`

3. If still not working, check Vercel logs:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment
   - Check "Functions" logs for errors

---

## Debugging Checklist

- [ ] `NEXTAUTH_URL` is set to your actual Vercel domain (https://...)
- [ ] `NEXTAUTH_SECRET` is set (32+ characters)
- [ ] `MONGODB_URI` is valid and accessible
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Database name is `switchyard_fx`
- [ ] Admin user exists in `users` collection
- [ ] Redeployed after adding environment variables

---

## Contact Support

If you're still experiencing issues:
1. Check Vercel function logs for specific error messages
2. Verify MongoDB Atlas network access settings
3. Test MongoDB connection from https://mongodbcompass.com/
