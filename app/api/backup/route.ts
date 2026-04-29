import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import { ItemModel } from '@/models/Item';
import { SaleModel } from '@/models/Sale';
import { ExpenseModel } from '@/models/Expense';

export async function POST() {
  try {
    await dbConnect();

    // Fetch everything from Cloud DB
    const [items, sales, expenses] = await Promise.all([
      ItemModel.find({}),
      SaleModel.find({}),
      ExpenseModel.find({})
    ]);

    let csvData = 'Source,Date,Description,Cost/Amount,Sale Price,Profit,Category,Platform/Payment\n';

    sales.forEach((s: any) => {
      const d = s.description ? s.description.replace(/"/g, '""') : '';
      csvData += `Sale,${s.date || 'N/A'},"${d}",${s.bidPrice || 0},${s.sellingPrice || 0},${s.profit || 0},"${s.category || ''}","${s.platform || ''}"\n`;
    });

    expenses.forEach((e: any) => {
      const d = e.description ? e.description.replace(/"/g, '""') : '';
      csvData += `Expense,${e.date || 'N/A'},"${d}",${e.amount || 0},0,-${e.amount || 0},"${e.category || ''}","${e.paymentMethod || ''}"\n`;
    });

    items.forEach((it: any) => {
      const d = it.description ? it.description.replace(/"/g, '""') : '';
      csvData += `Inventory,${it.date || 'N/A'},"${d}",${it.cost || 0},0,0,"${it.category || ''}",N/A\n`;
    });

    const finalBuffer = Buffer.from(csvData, 'utf-8');
    const dateStr = new Date().toISOString().split('T')[0];

    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary keys are missing! You must RESTART your terminal (npm run dev) so Next.js can load the newly created .env.local file.');
    }

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Cloudinary Upload Timed Out. Next.js might be missing your .env.local keys. Please restart your dev server.'));
      }, 15000);

      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: 'raw', 
          folder: 'deen_hub/backups',
          public_id: `Ledger_${dateStr}_${Date.now()}.csv`
        },
        (error, result) => {
          clearTimeout(timeout);
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(finalBuffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
    
  } catch (error: any) {
    console.error('CSV Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
