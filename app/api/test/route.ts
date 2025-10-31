import { NextResponse } from 'next/server'

export async function GET() {
    // 返回错误
    return NextResponse.error()
}