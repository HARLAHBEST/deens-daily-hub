import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ReferralCustomerModel, ReferralLogModel } from '@/models/Referral';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const params = new URL(request.url).searchParams;
    const limit = Math.min(Number(params.get('limit') || 200), 2000);
    const customers = await ReferralCustomerModel.find({}).sort({ joined: -1 }).limit(limit).lean();
    const log = await ReferralLogModel.find({}).sort({ date: -1 }).limit(limit).lean();
    return NextResponse.json({ customers, log });
  } catch (error) {
    console.error('GET /api/referrals error:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { type, data } = await request.json();
    if (type === 'customer') {
      const newCustomer = await ReferralCustomerModel.create(data);
      return NextResponse.json(newCustomer);
    } else if (type === 'log') {
      const newLog = await ReferralLogModel.create(data);
      return NextResponse.json(newLog);
    }
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const { type, id, data } = await request.json();
    if (type === 'customer') {
      const updated = await ReferralCustomerModel.findByIdAndUpdate(id, data, { returnDocument: 'after' });
      return NextResponse.json(updated);
    }
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    if (type === 'customer') {
      await ReferralCustomerModel.findByIdAndDelete(id);
    } else if (type === 'log') {
      await ReferralLogModel.findByIdAndDelete(id);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
