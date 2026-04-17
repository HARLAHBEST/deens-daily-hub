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
    const inv = formData.get('inv') as string;
    const desc = formData.get('desc') as string;
    const cat = formData.get('cat') as string;
    const cost = Number(formData.get('cost'));
    const bid = Number(formData.get('bid')) || 0;
    const itotal = Number(formData.get('itotal')) || cost;
    const lot = formData.get('lot') as string || Math.random().toString(36).substring(2, 8).toUpperCase();
    
    let uid = formData.get('uid') as string;
    if (!uid) {
      uid = `${inv}|${lot}`;
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
      inv,
      date,
      itotal,
      desc,
      bid,
      cost,
      cat,
      image: imageUrl
    });

    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error('Error creating item:', error);
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
