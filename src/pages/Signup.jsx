import AuthForm from '../components/Authform';

export default function Signup() {
  const handleSignup = async (form) => {
    const res = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    console.log(form);
    
    const data = await res.json();
    if(res.status==201)
        alert('Success')
    if (!res.ok) alert(data.error || 'Signup failed');
    else localStorage.setItem('token', data.token);
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}