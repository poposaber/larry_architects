import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactFormSchema } from '@/lib/definitions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 驗證輸入
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '無效的輸入資料', details: result.error },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = result.data;

    // 儲存至資料庫
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return NextResponse.json(
      { message: '訊息已發送成功', id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}
