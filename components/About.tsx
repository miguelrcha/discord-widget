export default function About() {
  return (
    <section className="container-narrow mt-20 sm:mt-28">
      <h2 className="text-2xl font-semibold sm:text-3xl">Sobre o projeto</h2>
      <p className="mt-4 w-full sm:w-[calc(100%+40px)] text-base leading-relaxed text-black/70 sm:text-lg">
        Olá, eu sou{" "}
        <a
          href="https://www.miguelrcha.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-black underline decoration-black/25 underline-offset-2 transition-colors hover:decoration-black"
        >
          Miguel Rocha
        </a>
        , engenheiro de software. Criei este projeto a partir de um recurso do
        meu portfólio pessoal, construído com o{" "}
        <strong className="text-black">OpenPortfolios</strong>, de{" "}
        <strong className="text-black">@MatheusAudibert</strong>. É open
        source, sob licença MIT, feito com Next.js, React e TypeScript, e
        estilizado com Tailwind CSS.
      </p>
      <p className="mt-4 w-full sm:w-[calc(100%+40px)] text-base leading-relaxed text-black/70 sm:text-lg">
        O widget usa os status de atividade do Discord em tempo real através
        da API do{" "}
        <a
          href="https://github.com/Phineas/lanyard"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-black underline decoration-black/25 underline-offset-2 transition-colors hover:decoration-black"
        >
          Lanyard
        </a>
        , que escuta os eventos de presença do seu servidor via WebSocket e
        atualiza automaticamente, sem precisar dar refresh na página.
      </p>
      <p className="mt-4 w-full sm:w-[calc(100%+40px)] text-base leading-relaxed text-black/70 sm:text-lg">
        O gerador aqui no site entrega um snippet pronto para colar, já com
        seu Discord ID e tema configurados — em{" "}
        <strong className="text-black">TypeScript/React</strong>, em{" "}
        <strong className="text-black">HTML</strong> puro, ou como uma{" "}
        <strong className="text-black">imagem SVG ao vivo</strong> para o
        README do seu perfil no GitHub, já que o GitHub remove tags{" "}
        <code className="rounded bg-black/[0.06] px-1 py-0.5 font-mono text-sm text-black">
          {"<script>"}
        </code>
        . Vou continuar compartilhando trechos de código e guias passo a
        passo por aqui para você integrar isso facilmente ao seu próprio
        site.
      </p>
    </section>
  );
}
