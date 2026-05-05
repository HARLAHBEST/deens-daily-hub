import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SaleModel } from '@/models/Sale';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const params = new URL(request.url).searchParams;
    const limit = Math.min(Number(params.get('limit') || 200), 1000);
    const projection = { uid: 1, date: 1, lot: 1, description: 1, category: 1, invoiceId: 1, bidPrice: 1, sellingPrice: 1, profit: 1, platform: 1 };
    const sales = await SaleModel.find({}).sort({ date: -1 }).limit(limit).select(projection).lean();
    return NextResponse.json(sales);
  } catch (error) {
    console.error('GET /api/sales error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newSale = await SaleModel.create(body);
    return NextResponse.json(newSale);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updatedSale = await SaleModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    return NextResponse.json(updatedSale);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    await SaleModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
