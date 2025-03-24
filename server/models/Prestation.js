module.exports = (sequelize, DataTypes) => {
    const Prestation = sequelize.define('Prestation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sportId: {
        type: DataTypes.INTEGER,
        references: { model: "Sports", key: "id" },
        allowNull: false,
      }
    });
    
    Prestation.associate = (models) => {
      // Une prestation appartient à un sport
      Prestation.belongsTo(models.Sport, {
        foreignKey: 'sportId',
        as: 'sport',
      });
      
      // Une prestation peut avoir plusieurs réservations
      Prestation.hasMany(models.Book, {
        onDelete: "cascade",
        foreignKey: 'prestationId',
        as: 'bookings',
      });
      
      // Nouvelles relations one-to-one avec les détails sportifs
      Prestation.hasOne(models.Ski, {
        onDelete: "CASCADE",
        foreignKey: 'prestationId',
        as: 'ski',
      });
      
      Prestation.hasOne(models.Randonne, {
        onDelete: "CASCADE",
        foreignKey: 'prestationId',
        as: 'randonnee',
      });
      
      Prestation.hasOne(models.Escalade, {
        onDelete: "CASCADE",
        foreignKey: 'prestationId',
        as: 'escalade',
      });
    }
    
    return Prestation;
  }