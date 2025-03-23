module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define('Roles', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roleName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      roleDescription: {
        type: DataTypes.STRING,
      },
    });
  
    return Roles;
  }