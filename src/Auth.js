import React from 'react';

export default function Auth() {

  const getAuthHref = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    const token = process.env.REACT_APP_CSRF;
    return `https://api.restream.io/login?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${token}`;
  }

  return (
    <button onClick={() => window.open(getAuthHref(), '_self')}>
      Authenticate with Restream
    </button>
  )
}
