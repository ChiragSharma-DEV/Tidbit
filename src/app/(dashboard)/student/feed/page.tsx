'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdaptiveFeed from '@/components/feed/AdaptiveFeed';
import { Spinner, Button } from '@/components/ui';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

function FeedContent() {
  const searchParams = useSearchParams();
  const feedType = searchParams.get('feedType') || 'course';
  const courseIdParam = searchParams.get('courseId');

  const [courseId, setCourseId] = useState<string | null>(courseIdParam);
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(feedType !== 'niche');

  useEffect(() => {
    if (feedType === 'niche') return;
    async function loadCourses() {
      try {
        const res = await fetch('/api/enrollments');
        const data = await res.json();
        if (data.success && data.data) {
          const validEnrollments = data.data.filter((e: any) => e.courseId !== null);
          
          if (courseIdParam) {
            const current = validEnrollments.find(
              (e: any) => e.courseId._id === courseIdParam
            );
            if (current) {
              setCourseId(courseIdParam);
              setCourseTitle(current.courseId.title);
            } else {
              const defaultId = validEnrollments[0]?.courseId?._id || null;
              setCourseId(defaultId);
              setCourseTitle(validEnrollments[0]?.courseId?.title || '');
            }
          } else {
            const defaultId = validEnrollments[0]?.courseId?._id || null;
            setCourseId(defaultId);
            setCourseTitle(validEnrollments[0]?.courseId?.title || '');
          }
        }
      } catch (err) {
        console.error('Failed to load student enrollments:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, [courseIdParam]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (feedType === 'niche') {
    return <AdaptiveFeed courseId="" courseTitle="Interleaved Niche Feed" mode="niche" />;
  }

  if (!courseId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto space-y-4">
        <BookOpen className="w-16 h-16 text-muted" />
        <h3 className="text-xl font-bold text-foreground">No Enrolled Courses Found</h3>
        <p className="text-sm text-muted">
          You must enroll in at least one course to start using the Adaptive Stamina Feed.
        </p>
        <Link href="/student/browse">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return <AdaptiveFeed courseId={courseId} courseTitle={courseTitle} mode="course" />;
}

export default function StudentFeedPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <FeedContent />
    </Suspense>
  );
}
