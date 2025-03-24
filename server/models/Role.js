module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
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
    
    Role.associate = (models) => {
      Role.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users',
      });
    }
  
    return Role;
  }
