module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define('Article', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mainPicture: {
        type: DataTypes.STRING(512)
      },
      contentArticle: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: { model: "Users", key: "id" },
        allowNull: false,
      }
    });
  
    Article.associate = (models) => {
      Article.hasMany(models.Commentary, {
        onDelete: "cascade",
        foreignKey: 'articleId',
        as: 'commentaries',
      });
      Article.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author',
      });
    }
    return Article;
  }
