'use client';

import { useState, useRef, useEffect } from 'react';
import { Lock, Check, Award, Clock, BookOpen, AlertCircle, X, Sparkles } from 'lucide-react';

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  totalCards: number;
  cardsViewed: number;
  status: 'completed' | 'active' | 'locked';
  isLast: boolean;
}

interface DuolingoRoadmapProps {
  nodes: RoadmapNode[];
  nicheTitle: string;
}

export default function DuolingoRoadmap({ nodes, nicheTitle }: DuolingoRoadmapProps) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 300, height: 600 });

  // Compute position offsets for the Duolingo snake pattern (zigzag)
  const getOffsetClass = (index: number) => {
    const pattern = index % 4;
    if (pattern === 0) return 'translate-x-0'; // Center
    if (pattern === 1) return '-translate-x-14'; // Left
    if (pattern === 2) return 'translate-x-0'; // Center
    return 'translate-x-14'; // Right
  };

  // Calculate coordinates to draw connecting SVG line
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth || 300;
      const totalHeight = nodes.length * 150;
      setSvgDimensions({
        width: containerWidth,
        height: totalHeight,
      });
    }
  }, [nodes]);

  // Generate SVG path coordinates
  const getSvgPath = () => {
    const center = svgDimensions.width / 2;
    let path = '';

    nodes.forEach((_, idx) => {
      const y = idx * 150 + 60; // center of node
      let x = center;
      const pattern = idx % 4;

      if (pattern === 1) {
        x = center - 56;
      } else if (pattern === 3) {
        x = center + 56;
      }

      if (idx === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevY = (idx - 1) * 150 + 60;
        const prevPattern = (idx - 1) % 4;
        let prevX = center;

        if (prevPattern === 1) {
          prevX = center - 56;
        } else if (prevPattern === 3) {
          prevX = center + 56;
        }

        // Draw a smooth Bezier curve between points
        const controlY1 = prevY + 50;
        const controlY2 = y - 50;
        path += ` C ${prevX} ${controlY1}, ${x} ${controlY2}, ${x} ${y}`;
      }
    });

    return path;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto py-12 flex flex-col items-center select-none"
    >
      {/* Background Connecting SVG Line */}
      {nodes.length > 1 && (
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          style={{ width: '100%', height: `${svgDimensions.height}px` }}
        >
          {/* Unlocked / Completed Path */}
          <path
            d={getSvgPath()}
            fill="none"
            stroke="var(--color-primary, #4f46e5)"
            strokeWidth="8"
            strokeLinecap="round"
            className="opacity-20"
          />
          {/* Animated active path tracker */}
          <path
            d={getSvgPath()}
            fill="none"
            stroke="var(--color-primary, #4f46e5)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="16, 12"
            className="animate-[dash_30s_linear_infinite]"
            style={{
              animation: 'curriculum-dash 40s linear infinite',
            }}
          />
        </svg>
      )}

      {/* Vertical Nodes List */}
      <div className="space-y-[70px] z-10 w-full flex flex-col items-center">
        {nodes.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isActive = node.status === 'active';
          const isLocked = node.status === 'locked';

          return (
            <div
              key={node.id}
              className={`relative flex flex-col items-center justify-center transform transition-transform hover:scale-105 active:scale-95 cursor-pointer ${getOffsetClass(
                index
              )}`}
              onClick={() => setSelectedNode(node)}
            >
              {/* Outer Circular Button Ring */}
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg relative border-4 ${
                  isCompleted
                    ? 'bg-success text-white border-success/40'
                    : isActive
                    ? 'bg-primary text-white border-primary/30 animate-pulse shadow-primary/30'
                    : 'bg-muted text-muted-foreground border-muted-foreground/20'
                }`}
              >
                {/* Glow ring for active node */}
                {isActive && (
                  <div className="absolute inset-[-8px] rounded-full border-2 border-primary/50 animate-ping opacity-75" />
                )}

                {/* Node Center Icon */}
                {node.isLast ? (
                  <Award className={`w-10 h-10 ${isActive ? 'animate-bounce' : ''}`} />
                ) : isCompleted ? (
                  <Check className="w-10 h-10 stroke-[3px]" />
                ) : isLocked ? (
                  <Lock className="w-8 h-8 opacity-65" />
                ) : (
                  <div className="text-2xl font-black">{index + 1}</div>
                )}

                {/* Micro-Progress Bar for Active Node */}
                {isActive && node.totalCards > 0 && (
                  <div className="absolute -bottom-3 bg-card text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-border text-foreground flex items-center gap-1 shadow">
                    <span>{node.cardsViewed}/{node.totalCards}</span>
                  </div>
                )}
              </div>

              {/* Node Title Display */}
              <div className="mt-3 text-center max-w-[120px]">
                <h4 className="text-xs font-black tracking-tight text-foreground line-clamp-2">
                  {node.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Styled Interactive Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative p-6 bg-gradient-to-r from-primary/10 to-transparent border-b border-border flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2.5 py-1 rounded-full">
                  {nicheTitle} Curriculum
                </span>
                <h3 className="text-xl font-bold text-foreground mt-2 flex items-center gap-2">
                  {selectedNode.isLast && <Sparkles className="w-5 h-5 text-warning animate-pulse" />}
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-muted leading-relaxed">
                {selectedNode.description}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-muted/50 p-3.5 rounded-xl border border-border">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block leading-none">Time Est.</span>
                    <span className="text-sm font-bold text-foreground">~{selectedNode.estimatedTime} mins</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 p-3.5 rounded-xl border border-border">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block leading-none">Syllabus</span>
                    <span className="text-sm font-bold text-foreground">{selectedNode.totalCards} Cards</span>
                  </div>
                </div>
              </div>

              {/* Status and Progress Info */}
              <div className="border-t border-border pt-5">
                {selectedNode.status === 'completed' && (
                  <div className="flex items-center gap-2 text-success font-semibold text-sm">
                    <Check className="w-5 h-5 stroke-[3.5px] bg-success/15 p-0.5 rounded-full" />
                    <span>You mastered this curriculum node!</span>
                  </div>
                )}

                {selectedNode.status === 'active' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-primary flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                        Currently Studying
                      </span>
                      <span className="text-foreground">
                        {Math.round((selectedNode.cardsViewed / selectedNode.totalCards) * 100)}% Complete
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(selectedNode.cardsViewed / selectedNode.totalCards) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted block mt-1">
                      Read {selectedNode.totalCards - selectedNode.cardsViewed} more cards in the feed to unlock the next node.
                    </span>
                  </div>
                )}

                {selectedNode.status === 'locked' && (
                  <div className="flex items-center gap-3 text-muted-foreground text-sm bg-muted p-4 rounded-xl border border-border">
                    <Lock className="w-5 h-5 text-muted-foreground opacity-60" />
                    <span>Prerequisites locked. Complete earlier nodes to unlock this topic.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/40 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/95 transition-all text-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Style tag to add animated dash offset */}
      <style jsx global>{`
        @keyframes curriculum-dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
}
