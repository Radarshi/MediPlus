import AuthForm from '../components/Authform';

export default function Signup() {
  const handleSignup = async (form) => {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error || 'Signup failed');
    else localStorage.setItem('token', data.token);
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}