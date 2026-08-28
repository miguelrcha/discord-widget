import Header from "@/components/Header";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-white pt-[15px]">
      <Header />
      <div className="container-narrow flex flex-1 flex-col items-start justify-center gap-4 pb-24 pt-12 text-left">
        <span className="text-lg font-semibold tracking-tight text-black/40">
          404
        </span>
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-black sm:text-6xl">
          This page could not be found.
        </h1>
        <a
          href="/"
          className="mt-4 inline-flex h-14 items-center justify-center rounded-2xl bg-black px-6 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Back home
        </a>
      </div>
    </main>
  );
}
