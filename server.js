////////////////////////////////////////////////////////////////////
// VARIABLE DECLARATIONS
const express = require('express');
const request = require('request');
const querystring = require('querystring');
const exphbs = require('express-handlebars');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const PORT = process.env.PORT || 5070;

////////////////////////////////////////////////////////////////////
// MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

////////////////////////////////////////////////////////////////////
// TEMPLATES
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

////////////////////////////////////////////////////////////////////
// HTML ROUTES
app.get('/', (req, res) => res.render('index'));
app.get('/callback', (req, res) => res.render('new'));

////////////////////////////////////////////////////////////////////
// SPOTIFY API
const client_id = '';
const client_secret = '';
const redirect_uri =
  process.env.REDIRECT_URI || 'http://localhost:5070/callback';
const credentials = {
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
};
const scopes = ['playlist-modify-public', 'playlist-modify-private'];

const spotifyApi = new SpotifyWebApi(credentials);
const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
console.log(authorizeURL);
app.get('/login', (req, res) => res.redirect(authorizeURL));

app.listen(PORT, () =>
  console.log(
    `Listening on http://localhost:${PORT}. Go to /login to initiate authentication flow.`
  )
);
