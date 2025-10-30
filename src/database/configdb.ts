import 'dotenv/config';

const poolConfig = {
  max: 2,
  min: 0,
  acquire: 30000,
  idle: 0,
  evict: 8000
};

export const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: process.env.DB_DIALECT || 'postgres',
  pool: poolConfig
};


const productionConfig = {
  use_env_variable: 'DATABASE_URL', 
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  pool: poolConfig
};

export default {
  development: dbConfig,
  production: productionConfig
};