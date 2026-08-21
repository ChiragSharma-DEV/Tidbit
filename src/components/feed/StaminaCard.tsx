'use client';

import { useState, useRef, useEffect } from 'react';
import { Quote, BookOpen, Clock, Sparkles, CheckCircle } from 'lucide-react';
import { StaminaGate } from '@/types';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface StaminaCardProps {
  card: {
    _id: string;
    conceptKey: string;
    order: number;
    gate: StaminaGate;
    content: any; // Projected content
  };
  isActive: boolean;
}

export default function StaminaCard({ card, isActive }: StaminaCardProps) {
  const { gate, content, order } = card;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reset scroll progress when active card or gate changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [isActive, gate]);

  const handleScroll = () => {
    if (containerRef.current && gate === 'long') {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable > 0) {
        setScrollProgress((scrollTop / totalScrollable) * 100);
      }
    }
  };

  // Helper to render variants
  const renderShort = () => {
    const { headline, summary, takeaway } = content;
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[400px] text-center p-6 space-y-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl relative overflow-hidden border border-primary/20">
        {/* Quote symbol background */}
        <Quote className="absolute top-8 left-8 w-24 h-24 text-primary/10 -rotate-12 pointer-events-none" />
        <Quote className="absolute bottom-8 right-8 w-24 h-24 text-secondary/10 rotate-180 pointer-events-none" />

        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          Concept {order} • Bite-sized
        </span>

        {headline && (
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug max-w-xl z-10">
            {headline}
          </h2>
        )}

        <p className="text-lg sm:text-xl text-muted font-medium max-w-lg leading-relaxed italic z-10">
          "{summary}"
        </p>

        {takeaway && (
          <div className="flex items-center gap-2 text-sm text-secondary font-semibold border-t border-border pt-4 z-10 w-full max-w-xs justify-center">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Takeaway: {takeaway}</span>
          </div>
        )}
      </div>
    );
  };

  const renderMedium = () => {
    const { summary, explanation, bullets, example } = content;
    return (
      <Card variant="bordered" className="w-full min-h-[450px] flex flex-col justify-between overflow-hidden shadow-md hover:shadow-lg transition-shadow border-primary/30">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-border flex flex-row justify-between items-center">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/20 px-2.5 py-1 rounded-full">
              Concept {order}
            </span>
            <CardTitle className="text-xl font-bold mt-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              Progressive Focus
            </CardTitle>
          </div>
          <span className="text-xs text-muted flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5" /> ~1-2 min read
          </span>
        </CardHeader>
        <CardContent className="p-6 space-y-6 flex-1">
          <p className="text-lg font-semibold text-foreground border-l-4 border-primary pl-4 py-1">
            {summary}
          </p>

          <p className="text-base text-muted leading-relaxed">
            {explanation}
          </p>

          {bullets && bullets.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted">
              {bullets.map((b: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {example && (
            <div className="bg-input rounded-xl p-4 border border-input-border">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
                Example Context:
              </span>
              <p className="text-sm font-mono text-input-text bg-background/50 p-2.5 rounded border border-border whitespace-pre-wrap">
                {example}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderLong = () => {
    const { title, introduction, content: bodyContent, takeaways } = content;
    return (
      <Card variant="bordered" className="w-full h-full max-h-[550px] flex flex-col overflow-hidden shadow-lg border-primary/40 relative">
        {/* Top Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-border z-20">
          <div 
            className="h-full bg-primary transition-all duration-100" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <CardHeader className="bg-gradient-to-r from-primary/15 via-secondary/5 to-transparent p-6 border-b border-border flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/20 px-2.5 py-1 rounded-full">
                Concept {order}
              </span>
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/20 px-2.5 py-1 rounded-full">
                Deep stamina axis
              </span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {title}
            </CardTitle>
          </div>
          <div className="text-xs text-muted flex items-center gap-1 font-semibold whitespace-nowrap bg-background p-1.5 rounded-lg border border-border">
            <BookOpen className="w-3.5 h-3.5 text-primary" /> ~3-5 min read
          </div>
        </CardHeader>

        {/* Scroll Isolation Container */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-behavior-contain p-6 space-y-6 touch-action: pan-y"
          style={{ scrollbarWidth: 'thin' }}
        >
          {introduction && (
            <p className="text-base sm:text-lg font-medium text-foreground italic leading-relaxed">
              {introduction}
            </p>
          )}

          <div className="prose prose-sm max-w-none text-muted leading-relaxed text-base whitespace-pre-wrap">
            {bodyContent}
          </div>

          {takeaways && takeaways.length > 0 && (
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-5 border border-primary/10 mt-6">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-success" />
                Key Learnings
              </h4>
              <ul className="space-y-2">
                {takeaways.map((t: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2 text-muted">
                    <span className="text-success font-bold">✔</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className={`w-full max-w-3xl mx-auto transition-all duration-500 transform ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-40 pointer-events-none'}`}>
      {gate === 'short' && renderShort()}
      {gate === 'medium' && renderMedium()}
      {gate === 'long' && renderLong()}
    </div>
  );
}
