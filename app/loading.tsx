export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden">
      <div className="h-full w-full animate-[loading_1.2s_ease-in-out_infinite] bg-gradient-to-r from-sky via-brand to-sky bg-[length:200%_100%]" />
      <style>{`
        @keyframes loading {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
