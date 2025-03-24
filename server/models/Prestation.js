module.exports = (sequelize, DataTypes) => {
    const Prestation = sequelize.define('Prestation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sportId: {
        type: DataTypes.INTEGER,
        references: { model: "Sports", key: "id" },
        allowNull: false,
      }
    });
    
    Prestation.associate = (models) => {
      Prestation.belongsTo(models.Sport, {
        foreignKey: 'sportId',
        as: 'sport',
      });
      Prestation.hasMany(models.Book, {
        onDelete: "cascade",
        foreignKey: 'prestationId',
        as: 'bookings',
      });
    }
    return Prestation;
  }