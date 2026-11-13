import { MongoClient } from 'mongodb';

let client;
let clientPromise;
let indexesEnsured = false;

const getClientPromise = () => {
  const uri = process.env.mongodb_MONGODB_URI;

  if (!uri) {
    throw new Error('mongodb_MONGODB_URI não definido nas variáveis de ambiente.');
  }

  if (clientPromise) return clientPromise;

  // Desiste rápido se o cluster estiver fora do ar (o padrão do driver é 30s,
  // mais que o tempo máximo da função na Vercel).
  const options = { serverSelectionTimeoutMS: 4000, connectTimeoutMS: 4000 };

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  // Se a conexão falhar, não guarda a promessa rejeitada: a próxima chamada
  // tenta conectar de novo (senão a instância ficaria "presa" na falha).
  clientPromise.catch(() => {
    clientPromise = null;
    if (process.env.NODE_ENV === 'development') global._mongoClientPromise = null;
  });

  return clientPromise;
};

export async function getDb(dbName) {
  const promise = getClientPromise();
  const c = await promise;
  return c.db(dbName);
}

export async function ensureIndexes(db) {
  if (indexesEnsured) return;

  try {
    const rateLimits = db.collection('contact_rate_limits');
    const submissions = db.collection('contact_submissions');

    await rateLimits.createIndex(
      { type: 1, key: 1, day: 1 },
      { unique: true, background: true }
    ).catch(() => {});

    await rateLimits.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, background: true }
    ).catch(() => {});

    await submissions.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: 60 * 60 * 24 * 90, background: true }
    ).catch(() => {});

    indexesEnsured = true;
  } catch {
  }
}
