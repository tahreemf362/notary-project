# Project-Nos Frontend Integration Guide

## Backend Setup Completed ✅

The backend has been successfully set up with:
- Authentication system with email verification
- Role-based access control (User, Notary, Admin)
- Email service for verification and password reset
- Four main API routes: /auth, /admin, /join, /evidence

## Frontend Integration

### 1. Install Required Dependencies

```bash
cd frontend
npm install axios react-router-dom
```

### 2. Setup Environment Variables

Create `.env` file in frontend directory:
```bash
cp .env.example .env
```

Add:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Wrap App with AuthProvider

Update `main.jsx`:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 4. Update App.jsx with Routes

```jsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute, AdminRoute, NotaryRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Dashboard from './Pages/Dashboard';
import About from './Pages/About';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<About />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoute>{/* Admin Pages */}</AdminRoute>} />
        
        {/* Notary Routes */}
        <Route path="/join/*" element={<NotaryRoute>{/* Join Pages */}</NotaryRoute>} />
        
        {/* Evidence Routes */}
        <Route path="/evidence/*" element={<ProtectedRoute>{/* Evidence Pages */}</ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
```

### 5. Using Auth in Components

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, hasRole, isAuthenticated } = useAuth();

  // Check if user is logged in
  if (!isAuthenticated()) {
    return <div>Please login</div>;
  }

  // Check user role
  if (hasRole('admin')) {
    return <div>Admin Panel</div>;
  }

  // Display user info
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 6. Update Login Component

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 7. Update Signup Component

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        required
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      >
        <option value="user">User</option>
        <option value="notary">Notary</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### 8. Update Navbar Component

```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated, hasRole } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      
      {isAuthenticated() ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/evidence">Evidence</Link>
          
          {hasRole(['notary', 'admin']) && (
            <Link to="/join">Notary</Link>
          )}
          
          {hasRole('admin') && (
            <Link to="/admin">Admin</Link>
          )}
          
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Setup MongoDB

- Install MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` in `.env`

### 3. Configure Email Service

Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Update email settings (Gmail example):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### 4. Start Backend Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints Available

### Authentication (`/api/auth`)
- `POST /signup` - Register user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user
- `GET /verify-email/:token` - Verify email
- `POST /resend-verification` - Resend verification
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password

### Admin (`/api/admin`) - Admin Only
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id/role` - Update user role
- `PUT /users/:id/status` - Activate/deactivate user
- `PUT /notary/:id/verify` - Verify notary
- `DELETE /users/:id` - Delete user
- `GET /stats` - Get statistics

### Join (`/api/join`)
- `POST /notary` - Apply to become notary
- `GET /notary/status` - Get notary status
- `PUT /notary/credentials` - Update credentials

### Evidence (`/api/evidence`)
- `POST /` - Create evidence
- `GET /` - Get all evidence
- `GET /:id` - Get evidence by ID
- `PUT /:id` - Update evidence
- `PUT /:id/assign` - Assign notary
- `PUT /:id/notarize` - Complete notarization
- `DELETE /:id` - Delete evidence

## Testing

### Create Admin User (MongoDB)

```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin", isEmailVerified: true } }
)
```

### Test API with curl

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Next Steps

1. ✅ Backend is ready
2. ✅ Auth context created
3. ✅ Protected routes ready
4. 🔄 Update Login/Signup forms
5. 🔄 Update Navbar with auth
6. 🔄 Create Dashboard page
7. 🔄 Create Admin panel
8. 🔄 Create Evidence management pages

All the backend infrastructure is ready to use!
