# jestinpeace
Tisbert x NPP Performance Website
This is a stateless application to enable monitoring of votes for Jest in Peace performance.
It connects to Restream.io through OAuth, then opens a websocket to monitor the chat.

## API
There is a basic Flask app running in the background. All this app does is forward requests to exchange access tokens. Not going to bother with refreshing this token as the lifespan of this program is basically an hour anyways.

## WEB
A basic create-react-app application with a login and monitoring page.

## Environment Variables
There are a few environment variables necessary to get this application working:
- CLIENT_ID / REACT_APP_CLIENT_ID: The ID of the Restream.io application.
- CLIENT_SECRET: The secret for the application.
- REACT_APP_REDIRECT_URI: The redirect URI for the application.
- REACT_APP_CSRF: A random token to prevent CSRF attacks.
