module.exports = (sequelize, DataTypes) => {
  const Randonne = sequelize.define('Randonne', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    regionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    praticable: {
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

  Randonne.associate = (models) => {
    Randonne.belongsTo(models.Prestation, {
      foreignKey: 'prestationId',
      as: 'prestation'
    });
  }

  return Randonne;
};