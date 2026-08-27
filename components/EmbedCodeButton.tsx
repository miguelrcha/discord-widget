"use client";

import { useEffect, useState } from "react";
import TemplatePreviewCarousel from "@/components/TemplatePreviewCarousel";
import { generateDiscordWidgetCode } from "@/lib/discord-widget-source";
import { generateDiscordWidgetHtmlCode } from "@/lib/discord-widget-html-source";

function HtmlIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function DiscordIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0075-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.522 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.419 2.157-2.419 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3333-.9555 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.419 2.1569-2.419 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3333-.946 2.419-2.1568 2.419Z" />
    </svg>
  );
}

function CopyIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
      {n}
    </span>
  );
}

type DiscordProfile = {
  name: string;
  avatar: string;
};

type LanyardGuildInvite = {
  name: string;
  iconUrl: string | null;
  memberCount: number;
  onlineCount: number;
};

export default function EmbedCodeButton() {
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"ts" | "html">("ts");
  const [copied, setCopied] = useState(false);
  const [lanyardInvite, setLanyardInvite] = useState<LanyardGuildInvite | null>(
    null,
  );

  function closeAll() {
    setOpen(false);
    setHelpOpen(false);
    setStep(1);
  }

  useEffect(() => {
    const id = userId.trim();
    if (!/^\d{15,20}$/.test(id)) {
      setProfile(null);
      setProfileStatus("idle");
      return;
    }

    const controller = new AbortController();
    setProfileStatus("loading");

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${id}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        const user = json?.data?.discord_user;
        if (json?.success && user) {
          const avatar = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
                user.avatar.startsWith("a_") ? "gif" : "png"
              }?size=64`
            : `https://cdn.discordapp.com/embed/avatars/${
                Number(user.discriminator ?? 0) % 5
              }.png`;
          setProfile({ name: user.global_name || user.username, avatar });
          setProfileStatus("idle");
        } else {
          setProfile(null);
          setProfileStatus("error");
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setProfile(null);
          setProfileStatus("error");
        }
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [userId]);

  useEffect(() => {
    if (step !== 1 || lanyardInvite) return;
    const controller = new AbortController();
    fetch("https://discord.com/api/v10/invites/lanyard?with_counts=true", {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const guild = json?.guild;
        if (!guild) return;
        setLanyardInvite({
          name: guild.name,
          iconUrl: guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
            : null,
          memberCount: json.approximate_member_count ?? 0,
          onlineCount: json.approximate_presence_count ?? 0,
        });
      })
      .catch(() => {
        // Invite preview is a nice-to-have, fail silently.
      });
    return () => controller.abort();
  }, [step, lanyardInvite]);

  const canContinue = step !== 2 || profile !== null;

  const embedCode =
    language === "ts"
      ? generateDiscordWidgetCode(
          userId.trim() || "SEU_DISCORD_USER_ID",
          previewTheme,
        )
      : generateDiscordWidgetHtmlCode(
          userId.trim() || "SEU_DISCORD_USER_ID",
          previewTheme,
        );

  async function handleCopySnippet() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access denied, nothing else we can do here.
    }
  }

  function handleContinue() {
    if (!canContinue) return;
    if (step < 4) setStep((s) => s + 1);
    else closeAll();
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (helpOpen) setHelpOpen(false);
        else closeAll();
      }
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, helpOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-20 flex-1 sm:h-14 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-black/10 bg-white px-6 text-lg font-semibold text-black shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <DiscordIcon className="h-6 w-6 fill-current" />
        Copy embed code
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/60" onClick={closeAll} />

        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white pb-8 pt-3 text-black shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Copy embed code"
        >
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-black/15" />

          <div className="px-6 text-center">
            <h2 className="text-xl font-semibold">Copy embed code</h2>
            <p className="mt-2 text-sm text-black/50">
              Configure seu widget do Discord em poucos passos.
            </p>
          </div>

          {step === 1 && (
            <div className="mt-8 px-6">
              <div className="flex items-start gap-3">
                <StepBadge n={1} />
                <div className="flex-1">
                  <h3 className="text-base font-semibold">
                    Entre no Discord do Lanyard
                  </h3>
                  <p className="mt-1 text-sm text-black/50">
                    O widget é alimentado pela API do Lanyard. Para o seu
                    status aparecer em tempo real, você precisa estar em
                    algum servidor com o bot do Lanyard — o mais simples é
                    entrar no servidor oficial.
                  </p>
                  <div className="mt-4 flex flex-col items-center rounded-2xl bg-[#313338] px-6 py-6 text-center">
                    {lanyardInvite?.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lanyardInvite.iconUrl}
                        alt={lanyardInvite.name}
                        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#5865f2]">
                        <DiscordIcon className="h-9 w-9 fill-white" />
                      </span>
                    )}
                    <p className="mt-4 text-sm text-white/60">
                      Você foi convidado(a) para entrar
                    </p>
                    <p className="mt-1 text-xl font-bold text-white">
                      {lanyardInvite?.name ?? "Lanyard"}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#23a55a]" />
                        {(lanyardInvite?.onlineCount ?? 0).toLocaleString(
                          "pt-BR",
                        )}{" "}
                        online
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-white/30" />
                        {(lanyardInvite?.memberCount ?? 0).toLocaleString(
                          "pt-BR",
                        )}{" "}
                        membros
                      </span>
                    </div>
                    <a
                      href="https://discord.gg/lanyard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#5865f2] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4]"
                    >
                      Aceitar convite
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 px-6">
              <div className="flex items-start gap-3">
                <StepBadge n={2} />
                <div className="flex-1">
                  <h3 className="text-base font-semibold">Discord User ID</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Informe o seu ID de usuário do Discord para exibir seu
                    status no widget.
                  </p>
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-black/15 bg-black/[0.03] px-4 py-3">
                    <DiscordIcon className="h-5 w-5 shrink-0 fill-black/40" />
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="your-discord-user-id"
                      className="w-full bg-transparent text-sm text-black placeholder:text-black/30 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setHelpOpen(true)}
                    className="mt-2 text-sm font-medium text-black underline-offset-2 hover:underline"
                  >
                    Não sei como pegar
                  </button>

                  {profileStatus === "loading" && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2.5">
                      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-black/10" />
                      <div className="h-3 w-32 animate-pulse rounded bg-black/10" />
                    </div>
                  )}

                  {profileStatus === "idle" && profile && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <p className="truncate text-sm font-semibold">
                          {profile.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUserId("")}
                        className="shrink-0 text-xs font-medium text-black hover:underline"
                      >
                        Não é você?
                      </button>
                    </div>
                  )}

                  {profileStatus === "error" && (
                    <p className="mt-3 text-xs text-black/40">
                      Não encontramos esse usuário. Confira o ID (ele precisa
                      estar em algum servidor com o bot do Lanyard).
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 px-6">
              <div className="flex items-start gap-3">
                <StepBadge n={3} />
                <div className="flex-1">
                  <h3 className="text-base font-semibold">Linguagem</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Escolha em qual linguagem você quer receber o código.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLanguage("ts")}
                      aria-pressed={language === "ts"}
                      className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                        language === "ts"
                          ? "border-black bg-black/5"
                          : "border-black/10 hover:border-black/20"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/typescript-logo.png"
                        alt="TypeScript"
                        className="h-7 w-7 shrink-0 rounded-md object-cover"
                      />
                      <span className="flex-1 text-sm font-semibold">
                        TypeScript
                      </span>
                      {language === "ts" && (
                        <CheckIcon className="h-5 w-5 shrink-0 text-black" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLanguage("html")}
                      aria-pressed={language === "html"}
                      className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                        language === "html"
                          ? "border-black bg-black/5"
                          : "border-black/10 hover:border-black/20"
                      }`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#e34f26]">
                        <HtmlIcon className="h-4 w-4 text-white" />
                      </span>
                      <span className="flex-1 text-sm font-semibold">
                        HTML
                      </span>
                      {language === "html" && (
                        <CheckIcon className="h-5 w-5 shrink-0 text-black" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mt-8 px-6">
              <div className="flex items-start gap-3">
                <StepBadge n={4} />
                <div className="flex-1">
                  <h3 className="text-base font-semibold">Template</h3>
                  <p className="mt-1 text-sm text-black/50">
                    Escolha como seus status vão aparecer no widget.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="relative overflow-hidden rounded-xl border-2 border-black bg-black/5 p-3">
                      <TemplatePreviewCarousel theme={previewTheme} />
                      <span className="mt-3 block text-sm font-semibold">
                        Padrão
                      </span>
                      <CheckIcon className="absolute right-3 top-3 h-4 w-4 rounded-full bg-white text-black" />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewTheme("light")}
                          aria-label="Visualizar no modo claro"
                          aria-pressed={previewTheme === "light"}
                          className={`flex h-6 w-6 items-center justify-center rounded-md shadow-sm transition-colors ${
                            previewTheme === "light"
                              ? "bg-black text-white"
                              : "bg-white text-black/50 hover:text-black"
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTheme("dark")}
                          aria-label="Visualizar no modo escuro"
                          aria-pressed={previewTheme === "dark"}
                          className={`flex h-6 w-6 items-center justify-center rounded-md shadow-sm transition-colors ${
                            previewTheme === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black/50 hover:text-black"
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                          >
                            <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.273c-4.508 0-8.16-3.653-8.16-8.16 0-1.062.207-2.076.573-3.017a.75.75 0 0 0-.877-1A9.66 9.66 0 1 0 21.75 13.6a.75.75 0 0 0-1.008-.556Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-start rounded-xl border border-dashed border-black/15 p-3 opacity-50">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black/10">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                          </svg>
                        </span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black/10">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                          >
                            <path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.273c-4.508 0-8.16-3.653-8.16-8.16 0-1.062.207-2.076.573-3.017a.75.75 0 0 0-.877-1A9.66 9.66 0 1 0 21.75 13.6a.75.75 0 0 0-1.008-.556Z" />
                          </svg>
                        </span>
                      </div>
                      <span className="mt-3 block text-sm font-semibold">
                        Em breve
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold">Seu código</h4>
                    {language === "ts" ? (
                      <>
                        <p className="mt-1 text-xs text-black/50">
                          Pré-requisito: um projeto React (Next.js, Vite,
                          etc.) com Tailwind CSS configurado. Já vem com seu
                          Discord User ID preenchido.
                        </p>
                        <ol className="mt-3 flex flex-col gap-2 text-xs text-black/70">
                          <li className="flex gap-2">
                            <span className="font-semibold text-black">
                              1.
                            </span>
                            <span>
                              Copie o código abaixo e salve num arquivo
                              chamado{" "}
                              <code className="rounded bg-black/[0.06] px-1 py-0.5 font-mono">
                                discord-widget.tsx
                              </code>{" "}
                              dentro da pasta de componentes do seu projeto
                              (ex.:{" "}
                              <code className="rounded bg-black/[0.06] px-1 py-0.5 font-mono">
                                components/discord-widget.tsx
                              </code>
                              ).
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold text-black">
                              2.
                            </span>
                            <span>
                              Importe o componente no arquivo onde quer
                              mostrar o widget (ex.: sua página inicial).
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold text-black">
                              3.
                            </span>
                            <span>
                              Use{" "}
                              <code className="rounded bg-black/[0.06] px-1 py-0.5 font-mono">
                                {"<DiscordWidget />"}
                              </code>{" "}
                              no JSX, sem precisar passar nenhuma prop.
                            </span>
                          </li>
                        </ol>
                      </>
                    ) : (
                      <>
                        <p className="mt-1 text-xs text-black/50">
                          Funciona em qualquer site (HTML puro, WordPress,
                          etc.). Já vem com seu Discord User ID preenchido.
                        </p>
                        <ol className="mt-3 flex flex-col gap-2 text-xs text-black/70">
                          <li className="flex gap-2">
                            <span className="font-semibold text-black">
                              1.
                            </span>
                            <span>Copie o código abaixo.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-semibold text-black">
                              2.
                            </span>
                            <span>
                              Cole no HTML da sua página, no lugar exato onde
                              quer que o widget apareça.
                            </span>
                          </li>
                        </ol>
                      </>
                    )}

                    <div className="relative mt-3 max-h-64 overflow-auto rounded-xl bg-[#0d0d10] p-4 pr-14">
                      <pre className="whitespace-pre font-mono text-xs leading-relaxed text-white/90">
                        {embedCode}
                      </pre>
                      <button
                        type="button"
                        onClick={handleCopySnippet}
                        aria-label="Copiar código"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
                      >
                        {copied ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {language === "ts" && (
                      <>
                        <p className="mt-3 text-xs font-medium text-black/50">
                          No arquivo onde for usar:
                        </p>
                        <pre className="mt-1.5 whitespace-pre rounded-xl border border-black/10 bg-black/[0.03] p-3 font-mono text-xs leading-relaxed text-black/80">
                          {`import { DiscordWidget } from "./discord-widget";\n\n<DiscordWidget />`}
                        </pre>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between px-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 text-sm font-semibold text-black/50 transition-colors hover:text-black"
              >
                <span aria-hidden>←</span> Voltar
              </button>
            ) : (
              <button
                type="button"
                onClick={closeAll}
                className="flex items-center gap-1 text-sm font-semibold text-black/50 transition-colors hover:text-black"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                canContinue
                  ? "text-black hover:text-black/70"
                  : "cursor-not-allowed text-black/25"
              }`}
            >
              {step === 4 ? "Concluir" : "Continuar"}{" "}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          helpOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!helpOpen}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setHelpOpen(false)}
        />

        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white pb-8 pt-3 text-black shadow-2xl transition-transform duration-300 ease-out ${
            helpOpen ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Como pegar seu Discord User ID"
        >
          <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-black/15" />

          <div className="px-6 text-center">
            <h2 className="text-xl font-semibold">
              Como pegar seu Discord User ID
            </h2>
            <p className="mt-2 text-sm text-black/50">
              Leva menos de um minuto.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-5 px-6">
            <div className="flex items-start gap-3">
              <StepBadge n={1} />
              <div>
                <h3 className="text-base font-semibold">
                  Abra as Configurações do Discord
                </h3>
                <p className="mt-1 text-sm text-black/50">
                  Clique no ícone de engrenagem ao lado do seu nome de
                  usuário.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <StepBadge n={2} />
              <div>
                <h3 className="text-base font-semibold">
                  Ative o Modo Desenvolvedor
                </h3>
                <p className="mt-1 text-sm text-black/50">
                  Vá em &ldquo;Avançado&rdquo; e ative a opção &ldquo;Modo
                  desenvolvedor&rdquo;.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <StepBadge n={3} />
              <div>
                <h3 className="text-base font-semibold">Copie seu User ID</h3>
                <p className="mt-1 text-sm text-black/50">
                  Clique com o botão direito no seu nome/avatar e selecione
                  &ldquo;Copiar ID de usuário&rdquo;.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="flex items-center gap-1 text-sm font-semibold text-black/50 transition-colors hover:text-black"
            >
              <span aria-hidden>←</span> Voltar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
