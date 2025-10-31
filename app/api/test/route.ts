import { NextResponse } from 'next/server'

export async function GET() {
    // 自定义状态码
    const o = {
        message: 'Hello World'
        status: 502
    }
    return NextResponse.json({ message: 'Hello World' }, { status: 502 })
}