import connectDB from '@/lib/db/mongoose';
import { StudentLearningPath } from '@/lib/db/models/LearningPath';
import StudentProgress from '@/lib/db/models/StudentProgress';
import mongoose from 'mongoose';

export async function processQuizResult(
  studentId: string,
  courseId: string,
  conceptKey: string,
  isCorrect: boolean,
  quizPayload: any
) {
  await connectDB();

  if (!isCorrect) {
    // Failure state: Return the refresher card payload to be injected into the feed queue
    return {
      success: true,
      isCorrect: false,
      xpAwarded: 0,
      refresherCard: quizPayload.refresherCard,
    };
  }

  // Success state:
  // 1. Grant +50 Active Recall XP to student progress gamification profile
  const progress = await StudentProgress.findOne({
    studentId: new mongoose.Types.ObjectId(studentId),
    courseId: new mongoose.Types.ObjectId(courseId),
  });

  let xpAwarded = 50;
  let newLevel = 1;

  if (progress) {
    if (!progress.gamification) {
      progress.gamification = {
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        badges: [],
        dailyChallengeCompleted: false,
        weeklyGoal: { target: 10, current: 0, type: 'modules' },
      };
    }
    
    // Add XP
    progress.gamification.totalXP += xpAwarded;
    // level = floor(sqrt(totalXP / 100))
    newLevel = Math.floor(Math.sqrt(progress.gamification.totalXP / 100));
    progress.gamification.level = newLevel;
    progress.gamification.lastActivityDate = new Date();

    progress.markModified('gamification');
    await progress.save();
  }

  // 2. Update StudentLearningPath status for current node to 'completed'
  const studentPath = await StudentLearningPath.findOne({
    studentId: new mongoose.Types.ObjectId(studentId),
    courseId: new mongoose.Types.ObjectId(courseId),
  });

  if (studentPath) {
    const nodeId = quizPayload.nodeId || conceptKey;
    if (!studentPath.completedNodes) studentPath.completedNodes = [];
    if (!studentPath.completedNodes.includes(nodeId)) {
      studentPath.completedNodes.push(nodeId);
    }
    
    // Advance currentNodeId to next node in suggested path if it matches the current node
    if (studentPath.currentNodeId === nodeId && studentPath.suggestedPath && studentPath.suggestedPath.length > 0) {
      const currIdx = studentPath.suggestedPath.indexOf(nodeId);
      if (currIdx !== -1 && currIdx < studentPath.suggestedPath.length - 1) {
        studentPath.currentNodeId = studentPath.suggestedPath[currIdx + 1];
      }
    }
    
    await studentPath.save();
  }

  return {
    success: true,
    isCorrect: true,
    xpAwarded,
    newLevel,
  };
}
