import Link from "next/link";
import Image from "next/image";

const features = [
  { title: "Gestão completa", text: "Cadastre, edite e exclua eventos em poucos cliques." },
  { title: "Inscrições seguras", text: "Cada participante gerencia apenas as próprias inscrições." },
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      <section className="flex px-6 py-16 text-white sm:px-12">
        <div>
          <h1 className="max-w-2xl text-4xl font-extrabold sm:text-6xl text-[#10264D]">
          Organize seus eventos com o <span className="text-[#10264D]">Event</span><span className="text-[#1264F5]">Manager</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#10264D]">
            Centralize a criação de eventos, acompanhe datas e locais e permita que participantes se inscrevam de forma simples.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-md bg-[#10264D] px-4 py-2 text-white hover:bg-[#10264D]/90">
              Criar Evento
            </Link>
            <Link href="/login" className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
              Participar de um Evento
            </Link>
          </div>
        </div>
        <div>
          <Image src={"/imagem-capa.png"} alt="Imagem de capa" width={500} height={300} className="hidden lg:block"/>
        </div>
      </section>
      <section className="grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{feature.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
