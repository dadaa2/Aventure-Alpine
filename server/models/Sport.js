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
      Sport.hasMany(models.Ski, {
        onDelete: "CASCADE",
        foreignKey: 'sportId',
        as: 'skis',
      });
      Sport.hasMany(models.Escalade, {
        onDelete: "CASCADE",
        foreignKey: 'sportId',
        as: 'escalades',
      });
      Sport.hasMany(models.Randonnee, {
        onDelete: "CASCADE",
        foreignKey: 'sportId',
        as: 'randonnees',
      });
    }
  
    return Sport;
  }