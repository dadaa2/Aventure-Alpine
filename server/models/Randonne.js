module.exports = (sequelize, DataTypes) => {
    const Randonnee = sequelize.define('Randonnee', {
      regionName: {
        type: DataTypes.STRING,
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
      },
      sportId: {
        type: DataTypes.INTEGER,
        references: { model: "Sports", key: "id" },
        onDelete: "CASCADE",
      },
    });

    Randonnee.associate = (models) => {
      Randonnee.belongsTo(models.Sport, { foreignKey: "sportId", as: "sport" });
    };

    return Randonnee;
};