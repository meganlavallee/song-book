const express = require('express');
const db = require('../models');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const client_id = '42f8eb8e9e1c44fd9bac8098675676da';
const client_secret = 'c472d0cc3b4a443c8aa3fb3371dd6297';
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
router.get('/playlists', (req, res) => res.render('new'));
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
    res.redirect('/playlists');
  } catch (err) {
    console.log('\noops! #1\n\n', err);
  }
};

const getArtistId = async name => {
  try {
    const data = await spotifyApi.searchArtists(name);
    return data.body.artists.items[0].id;
  } catch (err) {
    console.log('\noops! #2\n\n', err);
  }
};

const getRecommendations = async artistIds => {
  try {
    const data = await spotifyApi.getRecommendations({
      min_energy: 0.4,
      min_danceability: 0.4,
      seed_artists: artistIds,
      min_popularity: 50,
    });
    return data;
  } catch (err) {
    console.log('\noops! #3\n\n', err);
  }
};

const getArtistName = async id => {
  try {
    const data = await spotifyApi.getArtist(id);
    return data;
  } catch (err) {
    console.log('\noops! #4\n\n', err);
  }
};

const getRelated = async id => {
  try {
    const data = await spotifyApi.getArtistRelatedArtists(id);
    return data;
  } catch (err) {
    console.log('\noops! #5\n\n', err);
  }
};

const getArtistByAlbum = async albumId => {
  try {
    const data = await spotifyApi.getAlbum(albumId);
    return data.body.artists[0].name;
  } catch (err) {
    console.log('\noops! #6\n\n', err);
  }
};

const generatePlaylistContainer = async title => {
  try {
    let generatedPlaylist = spotifyApi.createPlaylist(title, {
      description: 'Playlist created using SongBook!',
      public: true,
    });
    return generatedPlaylist;
  } catch (err) {
    console.error(err);
  }
};

const addTracksToPlaylist = async (playlist, tracks) => {
  spotifyApi.addTracksToPlaylist(playlist, tracks).then(
    function (data) {
      console.log('Added tracks to playlist!');
    },
    function (err) {
      console.log('Something went wrong!', err);
    }
  );
};

const getImage = async playlist => {
  const playlistImage = await fetch(`v1/playlists/${playlist}/images`, {
    method: 'GET',
    headers: { Authorization: 'Bearer' + token },
  });
  return playlistImage;
};

//////////////////////////////////////////////////////////////////////////////////////////////
//STILL NOT FUNCTIONAL
// const renderPlaylist = async (userName) => {
//   spotifyApi.getUserPlaylists(userName)
//     .then(function (data) {
//       console.log('Retrieved playlists', data.body);
//       // let readData = JSON.stringify(data);

//     }, function (err) {
//       console.log('Something went wrong!', err);
//     });
// }

router.post('/api/db/playlists', async function (req, res) {
  try {
    await db.Playlist.create(req.body);
    res.json({ msg: 'Success!' });
  } catch (err) {
    res.status(500).end();
  }
});

////////////////////////////////////////////////////////////////////
// API ROUTES
let currentTracks = '';

router.get('/api/playlists/:name', async (req, res) => {
  const id = await getArtistId(req.params.name);
  const {
    body: { artists },
  } = await getRelated(id);
  // console.log(artists);
  const idArr = artists.map(i => i.id);
  const newArr = [id, ...idArr.slice(0, 4)];
  // console.log(newArr);
  const { body } = await getRecommendations(newArr);
  currentTracks = body;
  // const playlistContainer = await generatePlaylistContainer('Testing 2');
  // const playlistID = playlistContainer.body.id;
  const playlistInfo = await Promise.all(
    body.tracks.map(
      async i => `${i.name} -- ${await getArtistByAlbum(i.album.id)}`
    ) // <-----------
  );
  // const tracksToPlaylist = await Promise.all(
  //   body.tracks.map(async i => `spotify:track:${i.id}`) // <-----------
  // );
  // addTracksToPlaylist(playlistID, tracksToPlaylist);
  res.json(playlistInfo);
  // console.log(playlistInfo);
  // console.log(body.tracks.map(i => i.album));
  // const { body } = await getAlbumInfo('64nbgEEIcY4g1ElVLONJ0w');
  // console.log(body.artists[0].name);
});

router.post('/api/playlists', async (req, res) => {
  const { body } = await generatePlaylistContainer(req.body.name);
  console.log(currentTracks);
  const tracksArr = currentTracks.tracks.map(i => `spotify:track:${i.id}`);
  const fullPlaylist = await addTracksToPlaylist(body.id, tracksArr);
  res.json(body);
});

module.exports = router;
