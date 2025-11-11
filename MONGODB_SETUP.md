# MongoDB Atlas Setup Guide

## Quick Setup (5 minutes)

Since you don't have MongoDB installed locally, use MongoDB Atlas (free cloud database):

### Step 1: Create Free MongoDB Atlas Account

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email
3. Choose the **FREE tier** (M0)

### Step 2: Create a Cluster

1. After signup, click **"Build a Database"**
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS/Google/Azure) - any region
4. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in left menu
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `project-nos-user`
5. Password: `YourSecurePassword123` (remember this!)
6. Set privileges to: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist Your IP

1. Click **"Network Access"** in left menu
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** (left menu)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://project-nos-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `/project-nos`

   Final example:
   ```
   mongodb+srv://project-nos-user:YourSecurePassword123@cluster0.xxxxx.mongodb.net/project-nos?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

Open `backend/.env` and update the `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://project-nos-user:YourSecurePassword123@cluster0.xxxxx.mongodb.net/project-nos?retryWrites=true&w=majority
```

### Step 7: Restart Backend

```bash
cd backend
npm run dev
```

You should see: "MongoDB Connected: cluster0.xxxxx.mongodb.net"

---

## Alternative: Install MongoDB Locally (Optional)

If you prefer local installation:

### Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run automatically
4. Use: `MONGODB_URI=mongodb://localhost:27017/project-nos`

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

---

## Troubleshooting

**Error: "MongoNetworkError"**
- Check your internet connection
- Verify IP whitelist in MongoDB Atlas

**Error: "Authentication failed"**
- Double-check username and password in connection string
- Ensure password doesn't contain special characters (use URL encoding)

**Error: "Database connection timeout"**
- Check if MongoDB Atlas cluster is active
- Verify connection string format

## Need Help?

The MongoDB Atlas free tier includes:
- ✅ 512 MB storage (plenty for development)
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Automatic backups
- ✅ Cloud-based (accessible anywhere)

For any issues, MongoDB Atlas has excellent documentation and support!
