import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import connectDB from '@/lib/db/mongoose';
import NicheCurriculum from '@/lib/db/models/NicheCurriculum';
import User from '@/lib/db/models/User';
import { getStudentNicheProgress } from '@/lib/curriculum/graphEngine';
import { DEFAULT_CURRICULA } from '@/lib/curriculum/seedData';
import { ApiResponse } from '@/types';

/**
 * GET /api/curriculum/roadmap
 * Returns the student's selected niches and the status of all curriculum nodes
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

    await connectDB();

    // Auto-seed default curriculum trees if none exist
    const count = await NicheCurriculum.countDocuments();
    if (count === 0) {
      console.log('Seeding default niche curricula...');
      await NicheCurriculum.insertMany(DEFAULT_CURRICULA);
    }

    // Fetch user and selected niches
    const user = await User.findById(session.user.id).lean();
    const selectedNiches = (user as any)?.learningProfile?.selectedNiches || [];

    // Fetch curricula
    const curricula = await NicheCurriculum.find().lean();

    // Fetch student's progress
    const progressPath = await getStudentNicheProgress(session.user.id);
    const nicheProgressList = progressPath.nicheProgress || [];

    // Map curricula with status per node
    const formattedRoadmaps = curricula.map((curriculum) => {
      const nicheId = curriculum.nicheId;
      const isSelected = selectedNiches.includes(nicheId);
      const progress = nicheProgressList.find((p) => p.nicheId === nicheId) || {
        nodeIndex: 0,
        cardsViewed: 0,
      };

      const nodesWithStatus = curriculum.nodes.map((node, index) => {
        let status: 'completed' | 'active' | 'locked' = 'locked';

        if (isSelected) {
          if (index < progress.nodeIndex) {
            status = 'completed';
          } else if (index === progress.nodeIndex) {
            status = 'active';
          } else {
            status = 'locked';
          }
        } else {
          // If not selected, all are locked
          status = 'locked';
        }

        return {
          id: node.id,
          title: node.title,
          description: node.description,
          estimatedTime: node.estimatedTime,
          totalCards: node.cards.length,
          cardsViewed: index === progress.nodeIndex && isSelected ? progress.cardsViewed : 0,
          status,
          isLast: index === curriculum.nodes.length - 1,
        };
      });

      return {
        nicheId: curriculum.nicheId,
        title: curriculum.title,
        nodes: nodesWithStatus,
        isSelected,
        currentNodeIndex: isSelected ? progress.nodeIndex : -1,
      };
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        selectedNiches,
        roadmaps: formattedRoadmaps,
      },
    });
  } catch (error) {
    console.error('Error fetching roadmap data:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to retrieve roadmap data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/curriculum/roadmap
 * Saves user's selected niches and initializes progress
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
    const { selectedNiches } = body as { selectedNiches: string[] };

    if (!Array.isArray(selectedNiches)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'selectedNiches must be an array of strings' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update selected niches on user profile
    await User.findByIdAndUpdate(session.user.id, {
      $set: {
        'learningProfile.selectedNiches': selectedNiches,
      },
    });

    // Ensure StudentLearningPath is initialized and contains niche progress entries
    const path = await getStudentNicheProgress(session.user.id);
    if (!path.nicheProgress) {
      path.nicheProgress = [];
    }

    for (const nicheId of selectedNiches) {
      const hasProgress = path.nicheProgress.some((p) => p.nicheId === nicheId);
      if (!hasProgress) {
        path.nicheProgress.push({
          nicheId,
          nodeIndex: 0,
          cardsViewed: 0,
        });
      }
    }

    path.markModified('nicheProgress');
    await path.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Selected niches saved successfully',
      data: { selectedNiches },
    });
  } catch (error) {
    console.error('Error saving selected niches:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to save selected niches' },
      { status: 500 }
    );
  }
}
