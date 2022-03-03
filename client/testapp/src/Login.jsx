import React, { useState } from 'react';
import api from './api/posts';

function LoginForm({ LoginSuccess }) {
  const [details, setDetails] = useState({ username: '', password: '' });
  let [error, setError] = useState(null);

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', details);
      window.localStorage.setItem('token', res.data.token);
      LoginSuccess(res.data.token, details.username);
    } catch ({
      response: {
        data: { error },
      },
    }) {
      setError(error);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            id="name"
            onChange={e => setDetails({ ...details, username: e.target.value })}
            value={details.value}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            id="password"
            onChange={e => setDetails({ ...details, password: e.target.value })}
            value={details.value}
          />
        </label>
        <input type="submit" value="LOGIN" />
      </form>
      <span>{error}</span>
    </>
  );
}

export default LoginForm;
