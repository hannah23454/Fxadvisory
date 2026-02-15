import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local or environment variables');
  }

  if (clientPromise) {
    return clientPromise;
  }

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

  return clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db('switchyard_fx');
}

export default getClientPromise;
