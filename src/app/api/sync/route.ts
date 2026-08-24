import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import connectDB from '@/lib/db/mongoose';
import StudentProgress from '@/lib/db/models/StudentProgress';
import { ApiResponse } from '@/types';

// In-memory fallback state store for guest/session real-time synchronization
let globalStateStore: Record<string, unknown> = {};
let lastSyncTimestamp = Date.now();

// POST /api/sync - Synchronize client state with server in real time
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { userId, state, actionType } = payload;

    lastSyncTimestamp = Date.now();

    // Update in-memory real-time sync store
    const syncKey = userId || 'guest_user';
    globalStateStore[syncKey] = {
      ...((globalStateStore[syncKey] as object) || {}),
      ...state,
      lastUpdated: lastSyncTimestamp,
      lastAction: actionType || 'state_update',
    };

    // If database connection is configured, persist to MongoDB
    try {
      const session = await getServerSession(authOptions);
      const effectiveStudentId = session?.user?.id || userId;

      if (effectiveStudentId && process.env.MONGODB_URI) {
        await connectDB();
        
        await StudentProgress.findOneAndUpdate(
          { studentId: effectiveStudentId },
          {
            $set: {
              lastAccessedAt: new Date(),
              'learningMetrics.streakDays': state.streakDays || 7,
              'learningMetrics.totalTimeSpent': state.sessionWordsRead || 0,
            },
          },
          { upsert: true, new: true }
        );
      }
    } catch (dbErr) {
      // Non-blocking DB fallback for guest mode or offline dev
      console.warn('Real-time sync DB persistence fallback active:', dbErr);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Data synchronized in real time',
      data: {
        timestamp: lastSyncTimestamp,
        syncKey,
        actionType,
        syncedState: globalStateStore[syncKey],
      },
    });
  } catch (error) {
    console.error('Real-time sync error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to synchronize data in real time' },
      { status: 500 }
    );
  }
}

// GET /api/sync?userId=xxx - Fetch latest real-time synchronized state
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'guest_user';

    const syncedData = globalStateStore[userId] || null;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        timestamp: lastSyncTimestamp,
        userId,
        state: syncedData,
      },
    });
  } catch (error) {
    console.error('Real-time fetch sync error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch synchronized data' },
      { status: 500 }
    );
  }
}
