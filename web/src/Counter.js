import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import { useLocation } from 'react-router-dom';

export default function Counter() {
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState(0);

  const query = new URLSearchParams(useLocation().search);
  const state = query.get('state');
  const code = query.get('code');

  const formConnection = (accessToken) => {
    const url = `wss://chat.api.restream.io/ws?accessToken=${accessToken}`;
    const connection = new WebSocket(url);

    connection.onerror = error => setErrorMessage(error);

    connection.onmessage = (message) => {
      const action = JSON.parse(message.data);
      console.log(action);

      // if (action['action'] === 'event' && action['payload']['text']) {
      setMessages(messages => messages + 1);
      // }
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
        console.log(json);
        formConnection(json.accessToken);
      })
      .catch(e => {
        console.log(`Error parsing response: ${e}`);
        window.open('/', '_self');
      });
  }, [state, code]);

  return errorMessage === '' ? (
    <div>
      <h1>There are {messages} messages.</h1>
    </div>
  ) : (
    <div>
      <h1>There was an error handling the stream chat connection. You can try logging back in.</h1>
      <Auth />
    </div>
  )
}
