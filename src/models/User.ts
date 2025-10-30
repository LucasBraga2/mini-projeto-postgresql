import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async isValidPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
        hooks: {
          beforeCreate: async (user: User) => {
            if (user.password) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
        },
      }
    );
  }

  public static associate(models: any) {
    this.hasMany(models.Movie, {
      foreignKey: 'userId',
      as: 'movies',
      onDelete: 'CASCADE', 
    });
  }
}

export default User;