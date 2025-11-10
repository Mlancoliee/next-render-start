import { NextResponse } from 'next/server'

export async function GET() {
    // 自定义状态码
    // 调用api/test1
    const res = await fetch('http://localhost:3000/api/test1');
    const data = await res.json();
    return NextResponse.json({ message: 'Hello World' }, { status: 403 })
}