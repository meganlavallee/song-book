const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
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

////////////////////////////////////////////////////////////////////
// HTML ROUTES
router.get('/', (req, res) => res.render('index'));
router.get('/callback', (req, res) => setToken(req, res));

////////////////////////////////////////////////////////////////////
// SPOTIFY API
const spotifyApi = new SpotifyWebApi(credentials);
const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
console.log(authorizeURL);
router.get('/login', (req, res) => res.redirect(authorizeURL));

const setToken = async (req, res) => {
  try {
    const { body } = await spotifyApi.authorizationCodeGrant(req.query.code);
    spotifyApi.setAccessToken(body.access_token);
    spotifyApi.setRefreshToken(body.refresh_token);
    res.render('new');
  } catch (err) {
    console.log('\noopsie!\n\n' + err);
  }
};

const getArtistId = async name => {
  const data = await spotifyApi.searchArtists(name);
  return data.body.artists.items[0].id;
};

const getReccs = async artistId => {
  const data = await spotifyApi.getRecommendations({
    min_energy: 0.7,
    min_danceability: 0.7,
    seed_artists: [artistId],
    min_popularity: 50,
  });
  return data;
};

////////////////////////////////////////////////////////////////////
// API ROUTES
router.post('/api/playlists', async (req, res) => {
  const id = await getArtistId(req.body.name);
  const {
    body: { tracks },
  } = await getReccs(id);
  console.log(tracks.map(track => track.name));
});

module.exports = router;
