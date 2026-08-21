'use client';

import { BookOpen, RefreshCw, CheckCircle } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface RefresherCardProps {
  card: {
    _id: string;
    type: 'refresher';
    content: {
      title: string;
      summary: string;
      keyTakeaway: string;
      bulletPoints: string[];
    };
  };
  isActive: boolean;
}

export default function RefresherCard({ card, isActive }: RefresherCardProps) {
  const { content } = card;
  const { title, summary, keyTakeaway, bulletPoints } = content;

  return (
    <div className={`w-full max-w-3xl mx-auto transition-all duration-500 transform ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-40 pointer-events-none'}`}>
      <Card variant="bordered" className="w-full min-h-[450px] flex flex-col justify-between overflow-hidden shadow-md border-warning/40 bg-warning/5">
        <CardHeader className="bg-gradient-to-r from-warning/15 to-transparent p-6 border-b border-warning/20 flex flex-row justify-between items-center">
          <div>
            <span className="text-xs font-bold text-warning-foreground bg-warning/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Refresher Card
            </span>
            <CardTitle className="text-xl font-bold mt-2 flex items-center gap-2 text-foreground">
              <RefreshCw className="w-5 h-5 text-warning" />
              {title}
            </CardTitle>
          </div>
          <span className="text-xs text-muted flex items-center gap-1 font-semibold bg-background p-1.5 rounded-lg border border-border">
            <BookOpen className="w-3.5 h-3.5 text-warning" /> Reinforcing Concept
          </span>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 flex-1">
          <p className="text-lg font-medium text-foreground border-l-4 border-warning pl-4 py-1 italic leading-relaxed">
            "{summary}"
          </p>

          {bulletPoints && bulletPoints.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Key Points to Remember:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted">
                {bulletPoints.map((bp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {keyTakeaway && (
            <div className="bg-warning/10 rounded-xl p-4 border border-warning/20 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-warning flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-warning-foreground uppercase tracking-wider block mb-0.5">
                  Core Takeaway:
                </span>
                <p className="text-sm font-medium text-foreground">
                  {keyTakeaway}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
