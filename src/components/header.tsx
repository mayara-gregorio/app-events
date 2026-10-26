"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { User } from "lucide-react";
import { MenuOpitions } from "./menu-opitions";

export function Header() {
  const { user, isLoading,  } = useAuth();


  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href={user ? "/explore" : "/"} className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <Image src="/logo.png" loading="eager" alt="Logo EventManeger" width={200} height={32} />
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {!isLoading && !user && (
            <>
            <Link href="/events" className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
              Meus Eventos
            </Link>
            <Link href="/registrations" className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
              Minhas Inscrições
            </Link>
            </>
          )}
          {user && (
            <>
              <Link href="/explore" className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
                Explorar
              </Link>
              <Link href="/events/create" className="rounded-md bg-[#10264D] px-4 py-2 text-white hover:bg-[#10264D]/90">
                Criar Evento
              </Link>
              <Link href="/events" className="rounded-md bg-[#10264D] px-4 py-2 text-white hover:bg-[#10264D]/90">
                Meus Eventos
              </Link>
              <Link href="/registrations" className="rounded-md bg-[#10264D] px-4 py-2 text-white hover:bg-[#10264D]/90">
                Minhas Inscrições
              </Link>
              <MenuOpitions/>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
