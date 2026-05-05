import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ExpenseModel } from '@/models/Expense';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const params = new URL(request.url).searchParams;
    const limit = Math.min(Number(params.get('limit') || 200), 1000);
    const projection = { description: 1, amount: 1, date: 1, category: 1, paymentMethod: 1 };
    const expenses = await ExpenseModel.find({}).sort({ date: -1 }).limit(limit).select(projection).lean();
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('GET /api/expenses error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newExpense = await ExpenseModel.create(body);
    return NextResponse.json(newExpense);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    return NextResponse.json(updatedExpense);
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
    await ExpenseModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
