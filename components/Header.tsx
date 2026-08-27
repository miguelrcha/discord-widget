import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full">
      <div className="container-narrow flex items-center gap-2 py-6">
        <Image
          src="/icon.png"
          alt="Discord Widget"
          width={28}
          height={28}
          className="rounded-md"
        />
        <span className="text-lg font-semibold tracking-tight text-black">
          discordwidget
        </span>
      </div>
    </header>
  );
}
