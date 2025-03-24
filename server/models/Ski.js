module.exports = (sequelize, DataTypes) => {
  const Ski = sequelize.define('Ski', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    snowCondition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skiLift: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pistColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prestationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Prestations',
        key: 'id'
      }
    }
  });

  Ski.associate = (models) => {
    Ski.belongsTo(models.Prestation, {
      foreignKey: 'prestationId',
      as: 'prestation'
    });
  }

  return Ski;
};