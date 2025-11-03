import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Prevent TypeScript errors in Next.js hot reload
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export default async function connectDB() {
  if (cached.conn) {
    // ✅ Already connected
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      ssl: true, // ✅ Important for Atlas
      serverSelectionTimeoutMS: 10000, // Prevent long hangs
      connectTimeoutMS: 10000,
    };

    console.log('⏳ Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongooseInstance) => {
      console.log('✅ MongoDB Connected');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ MongoDB Connection Failed:', err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
