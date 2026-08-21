import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import connectDB from '@/lib/db/mongoose';
import FeedCard from '@/lib/db/models/FeedCard';
import { processQuizResult } from '@/lib/curriculum/activeRecallRouter';
import { ApiResponse } from '@/types';

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
    const { courseId, cardId, selectedOptionId } = body;

    if (!courseId || !cardId || !selectedOptionId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing courseId, cardId, or selectedOptionId' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch the FeedCard to get the quiz payload
    const card = await FeedCard.findById(cardId);
    if (!card || !card.activeRecallQuiz) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Feed card or quiz payload not found' },
        { status: 404 }
      );
    }

    const quiz = card.activeRecallQuiz;
    const selectedOption = quiz.options.find(opt => opt.id === selectedOptionId);

    if (!selectedOption) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Selected option not found in quiz options' },
        { status: 400 }
      );
    }

    const isCorrect = selectedOption.isCorrect;

    // Call processQuizResult
    const result = await processQuizResult(
      session.user.id,
      courseId,
      card.conceptKey,
      isCorrect,
      quiz
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error submitting active recall quiz:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to process quiz submission' },
      { status: 500 }
    );
  }
}
