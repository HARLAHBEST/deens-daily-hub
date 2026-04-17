import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import { ItemModel } from '@/models/Item';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    let sales = [];
    let expenses = [];
    
    if (body.ddh9_sales) {
      try { sales = JSON.parse(body.ddh9_sales); } catch (e) {}
    }
    
    if (body.ddh9_expenses) {
      try { expenses = JSON.parse(body.ddh9_expenses); } catch (e) {}
    }

    await dbConnect();
    const dbItems = await ItemModel.find({});

    let csvData = 'Data Source,Date,Description,Cost/Amount,Sale Price,Profit,Category\n';

    sales.forEach((s: any) => {
      const desc = s.desc ? s.desc.replace(/"/g, '""') : '';
      csvData += `Sale (Local),${s.date || 'N/A'},"${desc}",${s.cost || 0},${s.sp || 0},${s.profit || 0},"${s.cat || ''}"\n`;
    });

    expenses.forEach((e: any) => {
      const desc = e.desc ? e.desc.replace(/"/g, '""') : '';
      csvData += `Expense (Local),${e.date || 'N/A'},"${desc}",${e.amount || 0},0,-${e.amount || 0},"${e.cat || ''}"\n`;
    });

    dbItems.forEach((it: any) => {
      const desc = it.desc ? it.desc.replace(/"/g, '""') : '';
      csvData += `Inventory (Cloud DB),${it.date || 'N/A'},"${desc}",${it.cost || 0},0,0,"${it.cat || ''}"\n`;
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
