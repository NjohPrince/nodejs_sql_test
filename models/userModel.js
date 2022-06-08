module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [1, 255],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
  });

  User.beforeCreate(function (user, options) {
    user.email = user.email.toLowerCase();
  });

  User.beforeUpdate(function (user, options) {
    user.email = user.email.toLowerCase();
  });

  return User;
};
