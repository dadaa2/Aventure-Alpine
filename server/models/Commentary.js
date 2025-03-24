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
      userId: {
        type: DataTypes.UUID,
        references: { model: "Users", key: "id" },
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        references: { model: "Articles", key: "id" },
        allowNull: false,
      }
    });

    Commentary.associate = (models) => {
      Commentary.belongsTo(models.Article, {
        foreignKey: 'articleId',
        as: 'article',
        onDelete: 'CASCADE'
      });
      Commentary.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
        onDelete: 'CASCADE'
      });
    }
    return Commentary;
  }