import React from 'react';
import api from './api/posts';
import { useEffect, useState } from 'react';

function Welcome({ LogoutSuccess }) {
  const [userTweet, setUserTweet] = useState([]);
  const [tweet, setTweet] = useState({ tweet: '' });

  const getTweets = async () => {
    const res = await api.get('/auth/tweet', {
      headers: {
        authorization: window.localStorage.getItem('token'),
      },
    });
    if (res.data.length > 1) {
      let temp = res.data.slice();
      setUserTweet(() => {
        return temp;
      });
    }
  };

  const postTweet = async () => {
    await api.post('/auth/post-tweet', tweet, {
      headers: {
        authorization: window.localStorage.getItem('token'),
      },
    });
  };

  useEffect(() => {
    getTweets();
  }, []);

  return (
    <>
      <span>WELCOME!</span>
      <button onClick={LogoutSuccess}>LOGOUT</button>
      <label>
        Add a tweet:
        <input
          type="text"
          name="username"
          id="name"
          onChange={e => setTweet({ ...tweet, tweet: e.target.value })}
          value={tweet.value}
        />
        <button onClick={postTweet}>TWEET</button>
      </label>
      <div>
        <span>
          Your tweets are :{' '}
          <ul>
            {userTweet.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </span>
      </div>
    </>
  );
}

export default Welcome;
