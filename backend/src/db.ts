import mongoose from 'mongoose';

export async function connectDB() {
  const MONGO_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!MONGO_URI) {
    console.error('❌ Error: DATABASE_URL no está definida en las variables de entorno.');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}
