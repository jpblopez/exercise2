import React, { useState } from 'react';
import api from './api/posts';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  const [details, setDetails] = useState({
    username: '',
    password: '',
    name: '',
  });
  let [result, setResult] = useState(null);
  let [error, setError] = useState(null);
  const navigate = useNavigate();

  const submitHandler = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', details);
      setResult('success');
    } catch ({
      response: {
        data: { error },
      },
    }) {
      setResult('failed');
      setError(error);
    }
  };

  return (
    <>
      {(result === null || result === 'failed') && (
        <div>
          <form onSubmit={submitHandler}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                id="name"
                onChange={e =>
                  setDetails({ ...details, username: e.target.value })
                }
                value={details.value}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                id="password"
                onChange={e =>
                  setDetails({ ...details, password: e.target.value })
                }
                value={details.value}
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                id="name"
                onChange={e => setDetails({ ...details, name: e.target.value })}
                value={details.value}
              />
            </label>
            <input type="submit" value="REGISTER" />
          </form>
        </div>
      )}
      <div>
        {result === 'success' && (
          <div>
            <span>You have successfully registered!</span>
            <button onClick={() => navigate('/login')}>
              click here to login
            </button>
          </div>
        )}
        {result === 'failed' && (
          <div>
            <span>Error is: {error} </span>
          </div>
        )}
      </div>
    </>
  );
}

export default RegistrationForm;
