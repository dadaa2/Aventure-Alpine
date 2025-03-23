module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      mail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        }
      },
      pseudo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      street: {
        type: DataTypes.STRING,
      },
      zipCode: {
        type: DataTypes.INTEGER,
      },
      city: {
        type: DataTypes.STRING,
      },
    });
    
    User.associate = (models) => {
      User.hasMany(models.Articles, {
        onDelete: "cascade",
        foreignKey: 'userId',
        as: 'articles',
      });
    }
    User.associate = (models) => {
      User.hasMany(models.Commentary, {
        onDelete: "cascade",
        foreignKey: 'userId',
        as: 'commentaries',
      });
    }
    return User;
  }