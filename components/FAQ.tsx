"use client";

import { useState } from "react";

const faqs = [
  {
    question: "O projeto é open source?",
    answer:
      "Sim. O código-fonte completo está no GitHub sob a licença MIT, então você pode lê-lo, fazer um fork ou hospedar sua própria instância.",
  },
  {
    question: "Posso personalizar o widget?",
    answer:
      "Você pode escolher de qual canal ele lê, o tema (escuro, claro ou transparente), a cor de destaque, e se as atividades são exibidas ao lado de cada membro.",
  },
  {
    question: "Ele atualiza em tempo real?",
    answer:
      "O widget escuta os eventos de presença do seu servidor e atualiza automaticamente, então os membros aparecem como online ou offline em segundos.",
  },
  {
    question: "Funciona com servidores privados?",
    answer:
      "Sim, desde que o recurso de widget esteja ativado nas configurações do seu servidor. Somente as informações que você escolher exibir ficam públicas.",
  },
  {
    question: "Como eu adiciono isso ao meu site?",
    answer:
      "Copie o trecho de incorporação do seu painel e cole em qualquer lugar que aceite HTML ou um iframe: um site, um README ou uma página de wiki pessoal.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="container-narrow mt-12 sm:mt-16 scroll-mt-10">
      <h2 className="text-2xl font-semibold sm:text-3xl">FAQ</h2>
      <div className="mt-4 w-full sm:w-[calc(100%+40px)] divide-y divide-black/10 border-t border-black/10">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-lg font-medium text-black"
              >
                {faq.question}
                <span
                  className={`shrink-0 text-xl text-black/40 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-all duration-200 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] pb-4 opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <p className="min-h-0 text-base leading-relaxed text-black/60">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
