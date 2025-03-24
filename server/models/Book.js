module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      startPrestation: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endPrestation: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      numberPerson: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      star: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 5
        }
      },
      commentary: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.UUID,
        references: { model: "Users", key: "id" },
        allowNull: false,
      },
      prestationId: {
        type: DataTypes.INTEGER,
        references: { model: "Prestations", key: "id" },
        allowNull: false,
      }
    });
    
    Book.associate = (models) => {
      Book.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Book.belongsTo(models.Prestation, {
        foreignKey: 'prestationId',
        as: 'prestation',
      });
    };
  
    return Book;
  }