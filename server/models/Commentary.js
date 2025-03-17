module.exports = (sequelize, DataTypes) => {
    const Commentary = sequelize.define('Commentary', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      textCommentary: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    return Commentary;
  }