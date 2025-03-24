module.exports = (sequelize, DataTypes) => {
    const Sport = sequelize.define('Sport', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    
    Sport.associate = (models) => {
      Sport.hasMany(models.Prestation, {
        onDelete: "CASCADE",
        foreignKey: 'sportId',
        as: 'prestations',
      });
    }
  
    return Sport;
  }