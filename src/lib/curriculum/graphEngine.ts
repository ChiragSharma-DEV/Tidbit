import { StudentLearningPath } from '@/lib/db/models/LearningPath';
import { NicheProgress } from '@/types';
import mongoose from 'mongoose';

/**
 * Get or create the student's generic (course-less) learning path progress
 */
export async function getStudentNicheProgress(studentId: string) {
  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  let path = await StudentLearningPath.findOne({
    studentId: studentObjectId,
    courseId: null,
  });

  if (!path) {
    path = await StudentLearningPath.create({
      studentId: studentObjectId,
      courseId: null,
      currentNodeId: 'niche-root',
      completedNodes: [],
      skippedNodes: [],
      branchHistory: [],
      suggestedPath: [],
      nicheProgress: [],
    });
  }

  return path;
}

/**
 * Returns the current active node index and cards viewed for each selected niche
 */
export async function getUnlockedNodes(studentId: string, selectedNiches: string[]) {
  const path = await getStudentNicheProgress(studentId);
  const progressMap: Record<string, { nodeIndex: number; cardsViewed: number }> = {};

  const existingProgress = path.nicheProgress || [];

  for (const nicheId of selectedNiches) {
    const entry = existingProgress.find((p) => p.nicheId === nicheId);
    if (entry) {
      progressMap[nicheId] = {
        nodeIndex: entry.nodeIndex,
        cardsViewed: entry.cardsViewed,
      };
    } else {
      // Default to start of curriculum
      progressMap[nicheId] = {
        nodeIndex: 0,
        cardsViewed: 0,
      };
    }
  }

  return progressMap;
}

/**
 * Increments cardsViewed for a niche. If cardsViewed reaches totalCardsInNode,
 * unlocks the next node (nodeIndex + 1) and resets cardsViewed.
 */
export async function advanceNodeProgress(
  studentId: string,
  nicheId: string,
  totalCardsInNode: number
) {
  const path = await getStudentNicheProgress(studentId);
  if (!path.nicheProgress) {
    path.nicheProgress = [];
  }

  let entryIndex = path.nicheProgress.findIndex((p) => p.nicheId === nicheId);
  let entry: NicheProgress;

  if (entryIndex === -1) {
    entry = {
      nicheId,
      nodeIndex: 0,
      cardsViewed: 0,
    };
    path.nicheProgress.push(entry);
    entryIndex = path.nicheProgress.length - 1;
  } else {
    entry = path.nicheProgress[entryIndex];
  }

  // Increment cards viewed
  entry.cardsViewed += 1;

  let unlockedNext = false;
  let oldIndex = entry.nodeIndex;

  if (entry.cardsViewed >= totalCardsInNode) {
    entry.nodeIndex += 1;
    entry.cardsViewed = 0;
    unlockedNext = true;
  }

  // Mark modified explicitly because it's a nested array
  path.markModified('nicheProgress');
  await path.save();

  return {
    unlockedNext,
    oldIndex,
    newIndex: entry.nodeIndex,
    cardsViewed: entry.cardsViewed,
  };
}
