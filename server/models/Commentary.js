module.exports = (sequelize, DataTypes) => {
    const Commentary = sequelize.define('Commentary', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      commentaryBody: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    Commentary.associate = (models) => {
      Commentary.belongsTo(models.Article, {
        foreignKey: 'articleId',
        as: 'article',
        onDelete: 'CASCADE'
      });
    }
    return Commentary;
  }