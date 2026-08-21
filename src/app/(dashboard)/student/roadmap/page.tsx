'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spinner, Button } from '@/components/ui';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DuolingoRoadmap from '@/components/roadmap/DuolingoRoadmap';
import { ArrowLeft, Brain, Edit2, Play, Sparkles, BookOpen, Star, Check } from 'lucide-react';

interface NicheRoadmap {
  nicheId: string;
  title: string;
  isSelected: boolean;
  currentNodeIndex: number;
  nodes: Array<{
    id: string;
    title: string;
    description: string;
    estimatedTime: number;
    totalCards: number;
    cardsViewed: number;
    status: 'completed' | 'active' | 'locked';
    isLast: boolean;
  }>;
}

const AVAILABLE_NICHES = [
  { id: 'ai', title: 'Artificial Intelligence', desc: 'Basics of AI, Machine Learning, Neural Networks, and LLMs.' },
  { id: 'psychology', title: 'Psychology', desc: 'Foundations of mind sciences, cognitive biases, and heuristics.' },
  { id: 'marketing', title: 'Marketing Strategy', desc: '4 Ps mix, search engine marketing SEO/SEM, and branding.' },
];

export default function StudentRoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<NicheRoadmap[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [activeNicheId, setActiveNicheId] = useState<string>('');
  const [isEditingNiches, setIsEditingNiches] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/curriculum/roadmap');
      const json = await res.json();

      if (json.success && json.data) {
        const list: NicheRoadmap[] = json.data.roadmaps || [];
        setRoadmaps(list);

        const selected = json.data.selectedNiches || [];
        setSelectedNiches(selected);

        // Select the first selected niche tab as active
        if (selected.length > 0) {
          setActiveNicheId(selected[0]);
          setIsEditingNiches(false);
        } else {
          setIsEditingNiches(true);
        }
      }
    } catch (err) {
      console.error('Failed to load roadmap data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNicheToggle = (nicheId: string) => {
    setSelectedNiches((prev) =>
      prev.includes(nicheId) ? prev.filter((id) => id !== nicheId) : [...prev, nicheId]
    );
  };

  const handleSaveNiches = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/curriculum/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedNiches }),
      });
      const json = await res.json();

      if (json.success) {
        await fetchRoadmapData();
      }
    } catch (err) {
      console.error('Failed to save selected niches:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Niche Selection Onboarding View
  if (isEditingNiches) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <div className="space-y-3 text-center">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl">
            <Brain className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Select Your Study Niches</h1>
          <p className="text-muted text-base max-w-md mx-auto">
            Choose one or more fields of interest. Tidbit AI will build an interleaved curriculum path linking these domains.
          </p>
        </div>

        <div className="grid gap-6">
          {AVAILABLE_NICHES.map((niche) => {
            const isChecked = selectedNiches.includes(niche.id);
            return (
              <div
                key={niche.id}
                onClick={() => handleNicheToggle(niche.id)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 select-none ${isChecked
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                    : 'border-border bg-card hover:border-primary/40'
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-1 transition-colors ${isChecked ? 'bg-primary border-primary text-white' : 'border-muted-foreground/35 bg-background'
                    }`}
                >
                  {isChecked && <Check className="w-4 h-4 stroke-[3px]" />}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-foreground">{niche.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{niche.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-end pt-4">
          {roadmaps.some((r) => r.isSelected) && (
            <Button
              variant="ghost"
              onClick={() => setIsEditingNiches(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSaveNiches}
            disabled={selectedNiches.length === 0 || isSaving}
            className="px-8 bg-primary hover:bg-primary/95 text-white"
            leftIcon={isSaving ? <Spinner size="sm" /> : <Sparkles className="w-4 h-4" />}
          >
            {isSaving ? 'Building Paths...' : 'Build My Curriculum'}
          </Button>
        </div>
      </div>
    );
  }

  const activeRoadmap = roadmaps.find((r) => r.nicheId === activeNicheId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Roadmap Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Link href="/student">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              Curriculum Roadmap
            </h1>
            <p className="text-sm text-muted">Track your node progression along the depth-axis path</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingNiches(true)}
            leftIcon={<Edit2 className="w-4 h-4" />}
          >
            Change Niches
          </Button>
          <Link href="/student/feed?feedType=niche">
            <Button
              size="sm"
              className="bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10"
              leftIcon={<Play className="w-4 h-4" />}
            >
              Study Feed
            </Button>
          </Link>
        </div>
      </div>

      {/* Interleaved Active Banner */}
      <Card variant="bordered" className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-primary/25">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-md">
              <Star className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Studying: {roadmaps.filter(r => r.isSelected).map(r => r.title).join(' + ')}</h2>
              <p className="text-xs text-muted">
                Tidbit interleaved these niches into a single, unified smart learning feed.
              </p>
            </div>
          </div>
          <Link href="/student/feed?feedType=niche">
            <Button className="bg-primary text-white hover:bg-primary/90" rightIcon={<Play className="w-4 h-4" />}>
              Open Niche Feed
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Niche Tabs and Roadmap Rendering */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Niche Tabs Selection List */}
        <div className="space-y-3">
          <span className="text-xs font-black text-muted uppercase tracking-wider block px-1">
            Active Niche Tracks
          </span>
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {roadmaps
              .filter((r) => r.isSelected)
              .map((roadmap) => {
                const isActive = roadmap.nicheId === activeNicheId;
                const completedCount = roadmap.nodes.filter((n) => n.status === 'completed').length;
                const totalNodes = roadmap.nodes.length;
                const pct = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

                return (
                  <button
                    key={roadmap.nicheId}
                    onClick={() => setActiveNicheId(roadmap.nicheId)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 shrink-0 ${isActive
                        ? 'bg-card border-primary ring-1 ring-primary/40 shadow-sm'
                        : 'bg-card/50 border-border hover:border-muted-foreground/30'
                      }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`font-bold text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {roadmap.title}
                      </span>
                      <span className="text-[10px] text-muted font-bold bg-muted px-2 py-0.5 rounded-full">
                        {pct}% done
                      </span>
                    </div>
                    {/* Compact progress bar */}
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Vertical Duolingo Roadmap Column */}
        <div className="md:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-md relative min-h-[500px]">
          <div className="text-center border-b border-border pb-4 mb-6">
            <h3 className="text-xl font-bold text-foreground">{activeRoadmap?.title} Roadmap</h3>
            <p className="text-xs text-muted mt-1">Click nodes to view syllabus concepts & masteries</p>
          </div>
          {activeRoadmap && activeRoadmap.nodes.length > 0 ? (
            <DuolingoRoadmap nodes={activeRoadmap.nodes} nicheTitle={activeRoadmap.title} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BookOpen className="w-12 h-12 text-muted mb-4 animate-bounce" />
              <p className="text-muted">No roadmap found for this niche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
