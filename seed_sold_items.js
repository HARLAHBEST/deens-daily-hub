const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://alabizakariyyah22_db_user:YZuWQkZDjTl2Oi1c@cluster0.basupng.mongodb.net/deens_daily_hub";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to deens_daily_hub');

  const Item = mongoose.connection.db.collection('items');
  const Sale = mongoose.connection.db.collection('sales');

  const items = await Item.aggregate([{ $sample: { size: 50 } }]).toArray();
  console.log(`Found ${items.length} items in Stock. Marking 50 as Sold...`);

  for (let i = 0; i < Math.min(items.length, 50); i++) {
    const it = items[i];
    const cost = it.bidPrice || it.cost || 0;
    const sp = cost * 1.6;
    const profit = sp - cost;
    const date = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10);

    await Item.updateOne({ _id: it._id }, { 
      $set: { 
        status: 'Sold', 
        soldPrice: sp, 
        soldDate: date 
      } 
    });

    await Sale.insertOne({
      id: Date.now() + Math.floor(Math.random() * 1000),
      uid: it.uid,
      lot: it.lot,
      invoiceId: it.invoiceId,
      description: it.description,
      category: it.category,
      cost: cost,
      bidPrice: cost,
      sellingPrice: sp,
      profit: profit,
      margin: cost > 0 ? (profit / cost) * 100 : 0,
      date: date,
      platform: 'Facebook',
      notes: 'Initial seed sync'
    });
  }

  console.log('Seeded 50 sales successfully.');
  process.exit(0);
}

seed();
