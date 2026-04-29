import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ItemModel } from '@/models/Item';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  await dbConnect();
  try {
    const items = await ItemModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const invoiceId = formData.get('invoiceId') as string || formData.get('inv') as string;
    const description = formData.get('description') as string || formData.get('desc') as string;
    const category = formData.get('category') as string || formData.get('cat') as string;
    const cost = Number(formData.get('cost'));
    const bidPrice = Number(formData.get('bidPrice')) || Number(formData.get('bid')) || 0;
    const invoiceTotal = Number(formData.get('invoiceTotal')) || Number(formData.get('itotal')) || cost;
    const lot = formData.get('lot') as string || Math.random().toString(36).substring(2, 8).toUpperCase();
    const status = formData.get('status') as string || 'In Stock';
    const soldPrice = formData.get('soldPrice') ? Number(formData.get('soldPrice')) : undefined;
    const soldDate = formData.get('soldDate') as string || undefined;
    const platform = formData.get('platform') as string || undefined;
    
    let uid = formData.get('uid') as string;
    if (!uid) {
      uid = `${invoiceId}|${lot}`;
    }
    const date = new Date().toISOString().split('T')[0];
    
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;
    
    if (imageFile && imageFile.name) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadPromise = new Promise((resolve, reject) => {
         cloudinary.uploader.upload_stream(
          { folder: 'deen_hub/items' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      
      const result: any = await uploadPromise;
      imageUrl = result.secure_url;
    }

    const newItem = await ItemModel.create({
      uid,
      lot,
      invoiceId,
      date,
      invoiceTotal,
      description,
      bidPrice,
      cost,
      category,
      image: imageUrl,
      status,
      soldPrice,
      soldDate,
      platform
    });

    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const contentType = request.headers.get('content-type') || '';
    let id: string | null = null;
    let updates: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = formData.get('id') as string;
      
      // Map fields
      const fields = ['invoiceId', 'description', 'category', 'status', 'lot', 'bidPrice', 'invoiceTotal', 'cost', 'soldPrice', 'soldDate', 'platform'];
      fields.forEach(f => {
        const val = formData.get(f);
        if (val !== null) {
          if (['bidPrice', 'invoiceTotal', 'cost', 'soldPrice'].includes(f)) {
            updates[f] = Number(val);
          } else {
            updates[f] = val;
          }
        }
      });

      const imageFile = formData.get('image') as File | null;
      if (imageFile && imageFile.name) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadPromise = new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'deen_hub/items' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        const result: any = await uploadPromise;
        updates.image = result.secure_url;
      }
    } else {
      const body = await request.json();
      const { id: bodyId, ...rest } = body;
      id = bodyId;
      updates = rest;
    }
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    const updatedItem = await ItemModel.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    await ItemModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
