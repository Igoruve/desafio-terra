import { useState } from 'react';

function RecoveryPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamada al backend
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_PROD}/recover-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) setMessage('Look for your email to recover your password.');
    else setMessage(data.error || 'Error sending email.');
  };

  return (
    <div>
      <h2>Recover your password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RecoveryPassword;
