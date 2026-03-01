export default function GridBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
    min-h-screen
    bg-black
    bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
    bg-size-[40px_40px]
    animate-[gridMove_5s_linear_infinite]
  "
    >
      {children}
    </div>
  );
}
