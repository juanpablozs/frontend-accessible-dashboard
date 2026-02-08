import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { authApi } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import './LoginForm.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      // Focus first error field
      const firstErrorField = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      firstErrorField?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({ username, password });
      login(response.user);
      navigate('/tickets');
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to A11yFirst</h1>
          <p>Sign in to access your support tickets</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {generalError && (
            <div className="error-summary" role="alert" tabIndex={-1}>
              <h2 className="error-summary-title">Login Error</h2>
              <p>{generalError}</p>
            </div>
          )}

          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            required
            autoComplete="username"
            autoFocus
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <div className="login-hint">
            <p>
              <strong>Hint:</strong> Any non-empty username and password will work for this demo.
            </p>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="login-button">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
