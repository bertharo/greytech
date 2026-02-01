import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { dailyTimeCommitment } = await request.json()

    if (![5, 10, 15, 20, 30].includes(dailyTimeCommitment)) {
      return NextResponse.json(
        { error: 'Invalid time commitment' },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { dailyTimeCommit: dailyTimeCommitment }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update time error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
