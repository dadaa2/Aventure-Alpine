const sequelizeBcrypt = require('sequelize-bcrypt');

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
      roleId: {
        type: DataTypes.INTEGER,
        references: { model: "Roles", key: "id" },
        allowNull: false,
        defaultValue: 1, 
        // 1 = user, 2 = editor, 3 = admin, 
      },
    });
    
    sequelizeBcrypt(User, {
      fields: ['password'], // Champ à hasher
      rounds: 10, // Nombre de rounds pour le sel (équivalent à genSalt(10))
      // La fonction compare sera automatiquement ajoutée comme "comparePassword"
    });
    
    User.associate = (models) => {
      User.hasMany(models.Article, {
        onDelete: "cascade",
        foreignKey: 'userId',
        as: 'articles',
      });
      User.hasMany(models.Commentary, {
        onDelete: "cascade",
        foreignKey: 'userId',
        as: 'commentaries',
      });
      User.hasMany(models.Book, {
        onDelete: "cascade",
        foreignKey: 'userId',
        as: 'bookings',
      });
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role',
      });
    }
    return User;
  }