import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import { useLocation } from 'react-router-dom';

export default function Counter() {
  const [errorMessage, setErrorMessage] = useState('');
  const [liveVotes, setLiveVotes] = useState(0);
  const [deathVotes, setDeathVotes] = useState(0);

  const query = new URLSearchParams(useLocation().search);
  const state = query.get('state');
  const code = query.get('code');

  const resetVotes = () => {
    setLiveVotes(0);
    setDeathVotes(0);
  }

  const formConnection = (accessToken) => {
    const url = `wss://chat.api.restream.io/ws?accessToken=${accessToken}`;
    const connection = new WebSocket(url);

    connection.onerror = error => setErrorMessage(error);

    connection.onmessage = (message) => {
      const action = JSON.parse(message.data);

      if (action['action'] === 'event') {
        const text = action['payload']['eventPayload']['text'];
        if (text) {
          if (text.match(/kill/i)) {
            setDeathVotes(deathVotes => deathVotes + 1);
          }

          if (text.match(/spare/i)) {
            setLiveVotes(liveVotes => liveVotes + 1);
          }
        }
      }
    };
  }

  useEffect(() => {
    if (state !== process.env.REACT_APP_CSRF || !code) {
      console.log('There was an issue fetching the code.');
      window.open('/', '_self');
    }

    // curl -X POST -H "Content-Type: application/x-www-form-urlencoded" --user [your client id]:[your client secret] --data "grant_type=authorization_code&redirect_uri=[your redirect URI]&code=[code]" https://api.restream.io/oauth/token
    const params = {
      method: 'POST',
      body: JSON.stringify({
        'grant_type': 'authorization_code',
        'redirect_uri': process.env.REACT_APP_REDIRECT_URI,
        'code': code,
      }),
    };

    fetch(`/api/exchange`, params)
      .then(response => response.json())
      .then(json => {
        formConnection(json.accessToken);
      })
      .catch(e => {
        console.log(`Error parsing response: ${e}`);
        window.open('/', '_self');
      });
  }, [state, code]);

  return errorMessage === '' ? (
    <div className="container">
      <h1>There are {deathVotes} KILL votes.</h1>
      <h1>There are {liveVotes} LIVE votes</h1>
      <button onClick={resetVotes}>Reset Votes</button>
    </div>
  ) : (
    <div className="container">
      <h1>There was an error handling the stream chat connection. You can try logging back in.</h1>
      <Auth />
    </div>
  )
}
