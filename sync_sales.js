const mongoose = require('mongoose');

// Use the URI from .env.local
const MONGODB_URI = "mongodb+srv://alabizakariyyah22_db_user:YZuWQkZDjTl2Oi1c@cluster0.basupng.mongodb.net/deen_hub";

const ItemSchema = new mongoose.Schema({}, { strict: false });
const SaleSchema = new mongoose.Schema({}, { strict: false });

async function sync() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
    const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);

    const soldItems = await Item.find({ status: { $in: ['Sold', 'Past Sold'] } });
    console.log(`Found ${soldItems.length} sold items in Inventory`);

    for (const item of soldItems) {
      const uid = item.uid || `${item.invoiceId}|${item.lot}`;
      const exists = await Sale.findOne({ $or: [{ uid: uid }, { lot: item.lot, description: item.description }] });

      if (!exists) {
        const cost = item.bidPrice || item.cost || 0;
        const sellingPrice = item.soldPrice || (cost * 1.5);
        const profit = sellingPrice - cost;
        const margin = cost > 0 ? (profit / cost) * 100 : 0;

        await Sale.create({
          id: Date.now() + Math.floor(Math.random() * 1000),
          uid: uid,
          lot: item.lot,
          invoiceId: item.invoiceId || "SYNC",
          description: item.description,
          category: item.category || "Other",
          cost: cost,
          sellingPrice: sellingPrice,
          profit: profit,
          margin: margin,
          date: item.soldDate || item.date || new Date().toISOString().slice(0, 10),
          platform: 'Marketplace',
          notes: 'Auto-sync from Inventory'
        });
        console.log(`Created sale record for: ${item.description}`);
      }
    }

    console.log('Sync process completed successfully');
  } catch (err) {
    console.error('Sync Error:', err);
  } finally {
    process.exit(0);
  }
}

sync();
