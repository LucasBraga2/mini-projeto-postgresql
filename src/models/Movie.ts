import { Model, DataTypes, Sequelize } from 'sequelize';

class Movie extends Model {
  public id!: string;
  public title!: string;
  public director?: string;
  public genre?: string;
  public releaseYear?: number;
  public userId!: string; 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        director: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        genre: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        releaseYear: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users', 
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'movies',
      }
    );
  }

  public static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default Movie;