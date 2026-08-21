'use client';

import { useState } from 'react';
import { Trophy, Share2, Award, Zap, ArrowRight, Sparkles, Check } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui';

interface MilestoneCardProps {
  milestone: {
    nicheId: string;
    nicheTitle: string;
    nodeTitle: string;
    nodeIndex: number;
    xpReward: number;
    nextNodeTitle?: string;
  };
}

export default function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { nicheTitle, nodeTitle, xpReward, nextNodeTitle } = milestone;
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    setShared(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `I just mastered the "${nodeTitle}" node in ${nicheTitle} on Tidbit AI and earned +${xpReward} XP! 🚀 #TidbitAI`
      );
    }
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <Card
      variant="bordered"
      className="w-full max-w-2xl mx-auto overflow-hidden shadow-2xl border-2 border-warning/40 bg-gradient-to-b from-warning/5 via-background to-warning/10 relative"
    >
      {/* Decorative Floating Sparkles */}
      <div className="absolute top-4 left-6 text-warning/30 animate-pulse">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-6 right-6 text-warning/20 animate-bounce">
        <Sparkles className="w-10 h-10" />
      </div>

      <CardContent className="p-8 text-center flex flex-col items-center space-y-6">
        {/* Glowing Trophy Badge */}
        <div className="relative">
          <div className="absolute inset-0 bg-warning/20 rounded-full blur-xl scale-125 animate-pulse" />
          <div className="relative p-6 bg-gradient-to-br from-warning/20 to-yellow-500/30 rounded-full border border-warning/50 text-warning">
            <Trophy className="w-16 h-16 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-lg">
            <Award className="w-3.5 h-3.5" />
            <span>Mastery</span>
          </div>
        </div>

        {/* Celebratory Heading */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Milestone Mastered!
          </h2>
          <p className="text-muted max-w-md mx-auto text-base">
            Congratulations! You have successfully completed all content cards in the node:
            <span className="block font-bold text-foreground mt-1 bg-warning/10 border border-warning/20 px-3 py-1 rounded-lg">
              {nodeTitle}
            </span>
            for <span className="font-semibold text-primary">{nicheTitle}</span>.
          </p>
        </div>

        {/* XP Reward Badge */}
        <div className="bg-gradient-to-r from-warning/25 to-yellow-500/25 border border-warning/40 rounded-2xl py-3.5 px-6 shadow-md inline-flex items-center gap-3 animate-pulse">
          <Zap className="w-6 h-6 text-warning fill-warning" />
          <span className="text-2xl font-black text-warning tracking-wide">
            +{xpReward} XP REWARD
          </span>
        </div>

        {/* Sharing Panel */}
        <div className="w-full max-w-sm border-t border-border pt-6 flex flex-col items-center gap-3">
          <Button
            onClick={handleShare}
            variant={shared ? 'primary' : 'outline'}
            className={`w-full ${shared ? 'bg-success text-white hover:bg-success/90' : ''}`}
            leftIcon={shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          >
            {shared ? 'Copied to Clipboard!' : 'Share Achievement'}
          </Button>
          <span className="text-xs text-muted">
            Share this milestone path with your friends and judges
          </span>
        </div>

        {/* Next Node Preview */}
        {nextNodeTitle && (
          <div className="w-full bg-input rounded-xl p-4 border border-input-border text-left">
            <span className="text-xs font-bold text-muted uppercase tracking-widest block mb-1">
              Path Unlocked • Up Next:
            </span>
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-foreground text-sm truncate">
                {nextNodeTitle}
              </span>
              <span className="text-xs text-primary font-bold flex items-center gap-1 shrink-0">
                Next Node <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
