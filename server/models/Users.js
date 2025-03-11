module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mail: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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
      //inscriptionDate: {
      //  type: DataTypes.DATE,
      //  allowNull: false,
      //},
    });
  
    return Users;
  }