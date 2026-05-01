import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  // Handle field blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });

    let error = '';
    if (field === 'email') {
      error = validateEmail(email);
    } else if (field === 'password') {
      error = validatePassword(password);
    }

    setErrors({ ...errors, [field]: error });
  };

  // Handle field change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors({ ...errors, email: validateEmail(value) });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors({ ...errors, password: validatePassword(value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    // Submit only if no errors
    if (!emailError && !passwordError) {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();

        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard or home
        window.location.href = '/';
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ ...errors, submit: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Google Login
  const handleGoogleCallback = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      if (credential) {
        // Decode JWT to extract user information
        const decoded = jwtDecode(credential);
        console.log('Google login successful:', decoded);

        setLoading(true);

        // Send credential to your backend
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credential })
          }
        );

        if (!response.ok) {
          throw new Error(`Backend error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Backend response:', data);

        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard or home
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Google callback error:', error);
      setErrors({ ...errors, google: `Login failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setErrors({ ...errors, google: 'Google login failed. Please try again.' });
  };

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-linear-to-br from-slate-50 to-slate-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Sign In</h2>
        <p className="text-gray-600 text-center mb-8">Welcome back to MyStore</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Submit Error */}
          {errors.submit && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{errors.submit}</p>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${touched.email && errors.email
                ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
                }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${touched.password && errors.password
                ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
                : 'border-gray-300 focus:ring-amber-500 focus:border-transparent'
                }`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg mt-6"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Error */}
        {errors.google && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">
            {errors.google}
          </p>
        )}

        {/* Google Login Component */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleCallback}
            onError={handleGoogleError}
            size="large"
            text="signin_with"
            theme="outline"
          />
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account? <span className="text-amber-500 font-semibold cursor-pointer hover:underline">Sign Up</span>
        </p>
      </div>
    </main>
  );
}

export default Login;