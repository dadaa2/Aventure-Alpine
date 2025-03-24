module.exports = (sequelize, DataTypes) => {
    const Ski = sequelize.define('Ski', {
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
      sportId: {
        type: DataTypes.INTEGER,
        references: { model: "Sports", key: "id" },
        onDelete: "CASCADE",
      },
    });

    Ski.associate = (models) => {
      Ski.belongsTo(models.Sport, { foreignKey: "sportId", as: "sport" });
    };

    return Ski;
};