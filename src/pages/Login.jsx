import AuthForm from '../components/Authform';

export default function Login() {
  const handleLogin = async (form) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) alert(data.error || 'Login failed');
    else {localStorage.setItem('token', data.token) 
      console.log(data.token);
    };
    console.log("login successful");
    
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}