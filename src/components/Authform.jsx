import { useState } from 'react';

export default function AuthForm({ type, onSubmit }) {
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', email: '', phone: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      {type === 'signup' && (
        <>
          <input name="name" placeholder="Name" onChange={handleChange} className="input" />
          <input name="age" placeholder="Age" type="number" onChange={handleChange} className="input" />
          <select name="gender" onChange={handleChange} className="input">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
        </>
      )}
      <input name="email" placeholder="Email" type="email" onChange={handleChange} className="input" />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} className="input" />
      <button type="submit" className="btn">{type === 'signup' ? 'Sign Up' : 'Login'}</button>
    </form>
  );
}