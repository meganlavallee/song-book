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
app.get('/callback', (req, res) => setToken(req, res));

////////////////////////////////////////////////////////////////////
// SPOTIFY API
const client_id = '42f8eb8e9e1c44fd9bac8098675676da';
const client_secret = '690c3c6879944badb2f97b1cb09f0f7e';
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

const setToken = async (req, res) => {
  try {
    const { body } = await spotifyApi.authorizationCodeGrant(req.query.code);
    spotifyApi.setAccessToken(body.access_token);
    res.render('new');
    getArtistId('Elvis');
  } catch (err) {
    console.log('\noopsie!\n\n' + err);
  }
};

const getArtistId = async name => {
  const data = await spotifyApi.searchArtists(name);
  console.log(data.body.artists.items.map(i => `${i.name} -- ${i.id}`));
};

app.listen(PORT, () =>
  console.log(
    `Listening on http://localhost:${PORT}. Go to /login to initiate authentication flow.`
  )
);

// playlist create method
// app.get('/create', (req, res) => {
//   spotifyApi
//     .createPlaylist('Testing 2', { 'description': 'This is also a test', 'public': true })
//     .then(function (data) {
//       console.log('Created playlist!');
//     }, function (err) {
//       console.log('Something went wrong!', err);
//     });
// })