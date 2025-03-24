module.exports = (sequelize, DataTypes) => {
    const Escalade = sequelize.define('Escalade', {
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
      sportId: {
        type: DataTypes.INTEGER,
        references: { model: "Sports", key: "id" },
        onDelete: "CASCADE",
      },
    });

    Escalade.associate = (models) => {
      Escalade.belongsTo(models.Sport, { foreignKey: "sportId", as: "sport" });
    };

    return Escalade;
};