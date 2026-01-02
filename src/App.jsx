import React, { useState, useRef, useEffect } from 'react';
import { Info, Brain, Briefcase, TrendingUp, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const DunningKrugerExplorer = () => {
  const [competence, setCompetence] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  // Approximate Dunning-Kruger curve data points
  // x: Competence (0-100), y: Confidence (0-100)
  const getConfidence = (x) => {
    // A simplified mathematical approximation of the curve
    // Peak at ~15, Valley at ~40, Steady rise to ~100
    if (x < 20) return 50 + (x * 2.5); // Steep rise to Mount Stupid
    if (x < 45) return 100 - ((x - 20) * 3); // Steep drop to Valley of Despair
    return 25 + ((x - 45) * 1.2); // Gradual rise (Slope of Enlightenment)
  };

  // Generate path for the curve
  const generatePath = () => {
    let path = `M 0 ${100 - 50}`; // Start
    for (let i = 1; i <= 100; i++) {
      const y = getConfidence(i);
      path += ` L ${i * 8} ${300 - (y * 2.5)}`; // Scale x by 8, y by 2.5
    }
    return path;
  };

  const currentConfidence = getConfidence(competence);
  
  // Calculate marker position
  const markerX = competence * 8;
  const markerY = 300 - (currentConfidence * 2.5);

  const handleInteraction = (clientX) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      let x = clientX - rect.left;
      // Clamp x between 0 and graph width (800)
      x = Math.max(0, Math.min(x, 800));
      const newCompetence = Math.round(x / 8);
      setCompetence(newCompetence);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleInteraction(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleInteraction(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      handleInteraction(e.touches[0].clientX);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  // Determine current stage
  const getStage = (comp) => {
    if (comp < 22) return {
      name: "Peak of 'Mount Stupid'",
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      psych: "Cognitive Bias: The individual lacks the metacognitive ability to recognize their own incompetence.",
      hr: "Risk: High confidence but low skill leads to reckless errors. Requires careful supervision and structured feedback to reveal knowledge gaps.",
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />
    };
    if (comp < 45) return {
      name: "Valley of Despair",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
      psych: "Realization: Awareness of incompetence sets in. Confidence plummets as they realize how much they don't know.",
      hr: "Risk: Burnout or quitting. Needs mentorship, reassurance, and validation of progress to prevent disengagement.",
      icon: <HelpCircle className="w-6 h-6 text-orange-600" />
    };
    if (comp < 80) return {
      name: "Slope of Enlightenment",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      psych: "Growth: Competence increases, and realistic confidence begins to return.",
      hr: "Strategy: Provide challenging projects with autonomy. The employee is becoming reliable and self-correcting.",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />
    };
    return {
      name: "Plateau of Sustainability",
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      psych: "Mastery: Confidence is now accurately aligned with high competence. Intuitive understanding.",
      hr: "Strategy: Leadership potential. Use them as mentors. Warning: May have trouble understanding why beginners struggle (Curse of Knowledge).",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />
    };
  };

  const stage = getStage(competence);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans text-slate-800">
      
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-400" />
              The Dunning-Kruger Effect
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Interactive analysis for HR & Psychology professionals
            </p>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-xs font-mono bg-slate-800 px-3 py-1 rounded text-indigo-300">
               CONFIDENCE(competence)
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          
          <div className="mb-6 bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-3 items-start">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-800">
              <strong>Instructions:</strong> Drag the dot along the curve or click anywhere on the graph to simulate an employee's journey from novice to expert. Observe how their confidence fluctuates relative to their actual competence.
            </p>
          </div>

          {/* Graph Container */}
          <div className="relative w-full aspect-[16/7] bg-white border-b border-l border-slate-300 mb-8 select-none shadow-inner rounded-sm"
               ref={svgRef}
               onMouseDown={handleMouseDown}
               onTouchStart={handleTouchStart}
               onMouseMove={handleMouseMove}
               onTouchMove={handleTouchMove}>
            
            {/* Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10" 
                 style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

            {/* Labels */}
            <div className="absolute -left-12 top-1/2 -rotate-90 text-xs font-bold text-slate-400 tracking-widest">CONFIDENCE</div>
            <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 tracking-widest">COMPETENCE (Wisdom)</div>

            {/* Stage Labels on Graph */}
            <div className="absolute top-[10%] left-[15%] text-[10px] md:text-xs font-bold text-red-300 -translate-x-1/2 text-center pointer-events-none">Mount<br/>Stupid</div>
            <div className="absolute bottom-[20%] left-[38%] text-[10px] md:text-xs font-bold text-orange-300 -translate-x-1/2 text-center pointer-events-none">Valley of<br/>Despair</div>
            <div className="absolute top-[30%] right-[5%] text-[10px] md:text-xs font-bold text-green-300 -translate-x-1/2 text-center pointer-events-none">Plateau of<br/>Sustainability</div>

            <svg className="w-full h-full overflow-visible pointer-events-none" viewBox="0 0 800 300">
              {/* The Curve */}
              <defs>
                <linearGradient id="gradientCurve" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={`${generatePath()} V 300 H 0 Z`} fill="url(#gradientCurve)" />
              <path d={generatePath()} fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Interactive Marker */}
              <circle cx={markerX} cy={markerY} r="8" fill="white" stroke="#4f46e5" strokeWidth="3" className="shadow-lg cursor-pointer" />
              <circle cx={markerX} cy={markerY} r="16" fill="#4f46e5" className="animate-ping opacity-20" />
              
              {/* Dashed guidelines */}
              <line x1={markerX} y1={markerY} x2={markerX} y2={300} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
              <line x1={0} y1={markerY} x2={markerX} y2={markerY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
            </svg>

          </div>

          {/* Dynamic Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            
            {/* Stage Summary */}
            <div className={`col-span-1 md:col-span-2 p-6 rounded-lg border-l-8 transition-colors duration-300 ${stage.bgColor} ${stage.borderColor}`}>
              <div className="flex items-center gap-3 mb-2">
                {stage.icon}
                <h2 className={`text-xl font-bold ${stage.color}`}>{stage.name}</h2>
              </div>
              <div className="flex justify-between text-sm mt-2 text-slate-600 font-mono">
                 <span>Competence: {competence}%</span>
                 <span>Confidence: {Math.round(currentConfidence)}%</span>
              </div>
            </div>

            {/* Psychology Card */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-700">Psychological Perspective</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {stage.psych}
              </p>
            </div>

            {/* HR Card */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <Briefcase className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-slate-700">HR Management Strategy</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {stage.hr}
              </p>
            </div>

          </div>

        </div>
        
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-200">
           © 2025 HR/Psychology Interactive Tools • Based on the work of David Dunning and Justin Kruger (1999)
        </div>

      </div>
    </div>
  );
};

export default DunningKrugerExplorer;