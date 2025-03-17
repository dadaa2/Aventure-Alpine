module.exports = (sequelize, DataTypes) => {
    const Prestation = sequelize.define('Prestation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        unique: true,
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
      }
    });
  
    return Users;
  }