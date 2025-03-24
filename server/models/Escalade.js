module.exports = (sequelize, DataTypes) => {
  const Escalade = sequelize.define('Escalade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ascentionTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
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

  Escalade.associate = (models) => {
    // Une escalade appartient à une prestation
    Escalade.belongsTo(models.Prestation, {
      foreignKey: 'prestationId',
      as: 'prestation'
    });
  }

  return Escalade;
};