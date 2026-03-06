import { MongoClient } from 'mongodb';

const uri = process.env.mongodb_MONGODB_URI;

let client;
let clientPromise;

if (!uri) {
  throw new Error('mongodb_MONGODB_URI não definido nas variáveis de ambiente.');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(dbName) {
  const c = await clientPromise;
  return c.db(dbName);
}

export async function ensureIndexes(db) {
  const rateLimits = db.collection('contact_rate_limits');
  const submissions = db.collection('contact_submissions');

  await rateLimits.createIndex(
    { type: 1, key: 1, day: 1 },
    { unique: true, background: true }
  );

  await rateLimits.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, background: true }
  );

  await submissions.createIndex(
    { createdAt: 1 },
    { background: true }
  );
}
