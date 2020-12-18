// Requiring Modles
const db = require("../models");

// Routes
module.exports = function (app) {

    // GET Route
    app.get("/api/posts", function (req, res) {
        const query = {};
        if (req.query.song_id) {
            query.otherID = req.query.otherID;
        }
        // Join to Include All Routes
        db.Post.findAll({
            where: query,
            include: [db.Author],
        }).then(function (dbPost) {
            res.json(dbPost);
        });
    });
};

// GET Route for Single Song
app.get("/api/posts/:id", function (req, res) {
    //   Including Author
    db.Post.findOne({
        where: {
            id: req.params.id,
        },
        include: [db.Author],
    }).then(function (dbPost) {
        console.log(dbPost);
        res.json(dbPost);
    });
});

// POST Route for Saving
app.post("/api/posts", function (req, res) {
    db.Post.create(req.body).then(function (dbPost) {
        res.json(dbPost);
    });
});


// PUT Routes for Updating
app.put("/api/posts", function (req, res) {
    db.Post.update(req.body, {
        where: {
            id: req.body.id,
        },
    }).then(function (dbPost) {
        res.json(dbPost);
    });
});

// Route for Reading Songs
// Route for Create Songs
// Route for Inc
// Route for Dec
