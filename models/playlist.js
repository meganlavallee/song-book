module.exports = (sequelize, data) => {
  const Playlist = sequelize.define("Playlist", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};

// selectAll(cb) {
//     sequelize.selectAll('song', res => cb(res));
//   },
//   insertOne(value, cb) {
//     sequelize.insertOne('song', 'name', 'score', res => cb(res), value);
//   },
//   updateOne(id, value, cb) {
//     sequelize.updateOne('song', 'name', 'score', value, 'id', id, res => cb(res));
//   },
