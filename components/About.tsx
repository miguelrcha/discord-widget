export default function About() {
  return (
    <section className="container-narrow mt-20 sm:mt-28">
      <h2 className="text-2xl font-semibold sm:text-3xl">Sobre o projeto</h2>
      <p className="mt-4 w-full sm:w-[calc(100%+40px)] text-base leading-relaxed text-black/70 sm:text-lg">
        Olá, eu sou <strong className="text-black">Miguel Rocha</strong>, um
        engenheiro de software que criou este projeto a partir de um recurso
        do meu portfólio pessoal, feito com{" "}
        <strong className="text-black">OpenPortfolios by</strong>{" "}
        <strong className="text-black">@MatheusAudibert</strong>.
      </p>
      <p className="mt-4 w-full sm:w-[calc(100%+40px)] text-base leading-relaxed text-black/70 sm:text-lg">
        O projeto usa os status de atividade do Discord com a{" "}
        <strong className="text-black">biblioteca/API Lanyard.</strong> Vou
        compartilhar trechos de código e guias passo a passo para você
        integrar isso facilmente aos seus próprios projetos.
      </p>
    </section>
  );
}
