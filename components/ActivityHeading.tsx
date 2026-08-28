type Theme = "light" | "dark";

export default function ActivityHeading({
  theme = "light",
}: {
  theme?: Theme;
}) {
  const isDark = theme === "dark";
  return (
    <div className="mb-3 flex items-center gap-2">
      <span
        className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}
      >
        Activity
      </span>
      <span className="h-2.5 w-2.5 animate-blink rounded-full bg-[#23a55a]" />
    </div>
  );
}
