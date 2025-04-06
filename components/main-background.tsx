export default function MainBackground() {
  return (
    <>
      {/* Enhanced star background with better opacity and size variation */}
      <div 
        className="absolute inset-0 bg-[url('/stars.svg')] bg-repeat opacity-60 pointer-events-none"
        style={{ backgroundSize: "200px 200px" }}
      />

      {/* Enhanced gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-900/20 via-purple-800/5 to-transparent pointer-events-none blur-2xl opacity-40" />
      <div className="absolute top-1/3 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-900/10 via-blue-800/5 to-transparent pointer-events-none blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/80 to-transparent pointer-events-none" />
      
      {/* Subtle animated light dots in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-purple-500/30 animate-pulse-glow" />
        <div className="absolute top-3/4 left-1/3 h-1.5 w-1.5 rounded-full bg-blue-500/30 animate-pulse-glow animate-delay-1000" />
        <div className="absolute top-1/3 right-1/4 h-2 w-2 rounded-full bg-pink-500/30 animate-pulse-glow animate-delay-2000" />
        <div className="absolute bottom-1/4 right-1/3 h-1.5 w-1.5 rounded-full bg-blue-500/30 animate-pulse-glow animate-delay-1500" />
      </div>
    </>
  );
} 