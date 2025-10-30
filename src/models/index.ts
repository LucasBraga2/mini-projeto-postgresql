import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import configObject from '../database/configdb';

const env = process.env.NODE_ENV || 'development';
let sequelize: Sequelize;

if (env === 'production') {
  const config = configObject.production;
  
  if (!config.use_env_variable || !process.env[config.use_env_variable]) {
    throw new Error('A variável de ambiente (ex: DATABASE_URL) não está definida para produção.');
  }
  
  sequelize = new Sequelize(process.env[config.use_env_variable]!);

} else {
  const config = configObject.development;

  if (!config.database || !config.user || !config.password || !config.host) {
    throw new Error('A configuração do banco de dados de desenvolvimento está incompleta.');
  }

  sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect as 'postgres',
    pool: config.pool,
    logging: false, // Desativa os logs de query SQL no console
  });
}

const db: { [key: string]: any; sequelize?: Sequelize; Sequelize?: typeof Sequelize; } = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      (file.slice(-3) === '.ts' || file.slice(-3) === '.js')
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file)).default;
    if (model && typeof model.initialize === 'function') {
      model.initialize(sequelize);
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;