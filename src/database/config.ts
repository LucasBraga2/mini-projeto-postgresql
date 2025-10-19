import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  // Escolhe a URI do banco baseado no ambiente
  const dbUri = process.env.NODE_ENV === 'production' 
    ? process.env.MONGO_URI_CLOUD
    : process.env.MONGO_URI_LOCAL;

  if (!dbUri) {
    console.error('ERRO: MONGO_URI não definida nas variáveis de ambiente.');
    process.exit(1); // Encerra a aplicação
  }

  try {
    await mongoose.connect(dbUri);
    console.log('MongoDB conectado com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;