import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // 自定义状态码
    console.log('Received request:', request);
    return NextResponse.json({ message: 'Hello test1' }, { status: 403 })
}