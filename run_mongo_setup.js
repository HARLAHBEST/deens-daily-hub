const mongoose = require('mongoose');

async function runSetup() {
  try {
    // Relying on node --env-file=.env.local for loading env vars
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined. Please run with --env-file=.env.local");
    }

    // The user's env has deen_hub but the script requested deens_daily_hub.
    let uri = process.env.MONGODB_URI;
    if (uri.includes('/deen_hub')) {
      uri = uri.replace('/deen_hub', '/deens_daily_hub');
    }
    
    console.log(`Connecting to MongoDB...`);
    // Connect to the DB
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    console.log("Connected. Creating collections and indexes...");

    // Create collections (Mongoose db object is the native MongoDB driver db object)
    const collections = ['invoices', 'items', 'sales', 'expenses'];
    
    for (const name of collections) {
      try {
        await db.createCollection(name);
        console.log(`Created collection: ${name}`);
      } catch (err) {
        if (err.codeName === 'NamespaceExists') {
          console.log(`Collection ${name} already exists.`);
        } else {
          console.error(`Error creating collection ${name}:`, err);
        }
      }
    }

    // Connect to specific collections
    const invoices = db.collection('invoices');
    const items = db.collection('items');
    const sales = db.collection('sales');
    const expenses = db.collection('expenses');

    // Invoices indexes
    await invoices.createIndex({ invoiceId: 1 }, { unique: true });
    await invoices.createIndex({ date: -1 });
    console.log("Created indexes for invoices");

    // Items indexes
    await items.createIndex({ uid: 1 }, { unique: true });
    await items.createIndex({ invoiceId: 1 });
    await items.createIndex({ status: 1 });
    await items.createIndex({ category: 1 });
    await items.createIndex({ description: 'text' });
    await items.createIndex({ lot: 1 });
    console.log("Created indexes for items");

    // Sales indexes
    await sales.createIndex({ uid: 1 });
    await sales.createIndex({ date: -1 });
    await sales.createIndex({ invoiceId: 1 });
    await sales.createIndex({ platform: 1 });
    console.log("Created indexes for sales");

    // Expenses indexes
    await expenses.createIndex({ date: -1 });
    await expenses.createIndex({ category: 1 });
    console.log("Created indexes for expenses");

    console.log("✅ Schema + indexes created");

  } catch (err) {
    console.error("Error setting up schema:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runSetup();
