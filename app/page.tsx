import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="pb-10 pt-[15px]">
      <Header />
      <Hero />
      <About />
      <FAQ />
      <Footer />
    </main>
  );
}
