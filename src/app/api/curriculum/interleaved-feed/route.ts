import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import connectDB from '@/lib/db/mongoose';
import NicheCurriculum from '@/lib/db/models/NicheCurriculum';
import User from '@/lib/db/models/User';
import StudentProgress from '@/lib/db/models/StudentProgress';
import Enrollment from '@/lib/db/models/Enrollment';
import Course from '@/lib/db/models/Course';
import { getUnlockedNodes, advanceNodeProgress } from '@/lib/curriculum/graphEngine';
import { generateInterleavedQueue } from '@/lib/curriculum/interleavingEngine';
import { ApiResponse, StaminaGate } from '@/types';

/**
 * GET /api/curriculum/interleaved-feed
 * Returns interleaved feed cards for the student's selected niches
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const gate = (searchParams.get('gate') || 'short') as StaminaGate;

    await connectDB();

    // Fetch user and selected niches
    const user = await User.findById(session.user.id).lean();
    const selectedNiches = (user as any)?.learningProfile?.selectedNiches || [];

    if (selectedNiches.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: [],
        message: 'No niches selected. Please select a learning niche first.',
      });
    }

    // Get active progress node details for all selected niches
    const unlockedMap = await getUnlockedNodes(session.user.id, selectedNiches);

    // Fetch curricula documents for selected niches
    const curricula = await NicheCurriculum.find({
      nicheId: { $in: selectedNiches },
    }).lean();

    const curriculaMap = curricula.reduce((map, curr) => {
      map[curr.nicheId] = curr;
      return map;
    }, {} as Record<string, any>);

    // Build the interleaved round-robin feed cards sequence
    const interleavedQueue = generateInterleavedQueue(
      selectedNiches,
      unlockedMap,
      curriculaMap,
      gate
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: interleavedQueue,
    });
  } catch (error) {
    console.error('Error generating interleaved feed:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to retrieve interleaved feed' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/curriculum/interleaved-feed
 * Updates card completion and checks if node milestone is completed (awards XP)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { nicheId, cardId } = body as { nicheId: string; cardId: string };

    if (!nicheId || !cardId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'nicheId and cardId are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Fetch curriculum details to check node constraints
    const curriculum = await NicheCurriculum.findOne({ nicheId }).lean();
    if (!curriculum) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Niche curriculum not found' },
        { status: 404 }
      );
    }

    // 2. Fetch the active progress node for this user
    const unlockedMap = await getUnlockedNodes(session.user.id, [nicheId]);
    const progress = unlockedMap[nicheId];
    if (!progress) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Progress tracker not found' },
        { status: 404 }
      );
    }

    const activeNode = curriculum.nodes[progress.nodeIndex];
    if (!activeNode) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { unlockedNext: false, completedNiche: true },
        message: 'Niche curriculum already fully mastered.',
      });
    }

    const totalCardsInNode = activeNode.cards.length;

    // 3. Advance card count and check if node index is completed
    const result = await advanceNodeProgress(session.user.id, nicheId, totalCardsInNode);

    let milestonePayload = null;

    if (result.unlockedNext) {
      // Award +100 XP to student progress
      let studentProgress = await StudentProgress.findOne({ studentId: session.user.id });

      if (!studentProgress) {
        // Fallback: search any course enrollment
        const enrollment = await Enrollment.findOne({ studentId: session.user.id });
        let targetCourseId = enrollment?.courseId;

        if (!targetCourseId) {
          const anyCourse = await Course.findOne();
          targetCourseId = anyCourse?._id;
        }

        if (targetCourseId) {
          studentProgress = await StudentProgress.create({
            studentId: session.user.id,
            courseId: targetCourseId,
            completedModules: [],
            completedChapters: [],
            assessmentScores: [],
            gamification: {
              totalXP: 0,
              level: 1,
              currentStreak: 1,
              longestStreak: 1,
              lastActivityDate: new Date(),
              badges: [],
              dailyChallengeCompleted: false,
              weeklyGoal: { target: 10, current: 0, type: 'modules' },
            },
          });
        }
      }

      if (studentProgress) {
        if (!studentProgress.gamification) {
          studentProgress.gamification = {
            totalXP: 0,
            level: 1,
            currentStreak: 1,
            longestStreak: 1,
            lastActivityDate: new Date(),
            badges: [],
            dailyChallengeCompleted: false,
            weeklyGoal: { target: 10, current: 0, type: 'modules' },
          };
        }
        studentProgress.gamification!.totalXP += 100;
        studentProgress.gamification!.level = Math.floor(
          Math.sqrt(studentProgress.gamification!.totalXP / 100)
        );
        studentProgress.gamification!.lastActivityDate = new Date();
        await studentProgress.save();
      }

      const nextNode = curriculum.nodes[result.newIndex];

      milestonePayload = {
        nicheId,
        nicheTitle: curriculum.title,
        nodeTitle: activeNode.title,
        nodeIndex: result.oldIndex,
        xpReward: 100,
        nextNodeTitle: nextNode?.title,
      };
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        unlockedNext: result.unlockedNext,
        cardsViewed: result.cardsViewed,
        totalCardsInNode,
        milestone: milestonePayload,
      },
    });
  } catch (error) {
    console.error('Error completing curriculum card:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to record card progress' },
      { status: 500 }
    );
  }
}
