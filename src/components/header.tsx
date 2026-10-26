"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function Header() {
  const { user, isLoading, logout,  } = useAuth();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  async function handleLogout() {
    setLeaving(true);
    await logout();
    setLeaving(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <Image src="/logo.png" loading="eager" alt="Logo EventManeger" width={200} height={32} />
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          <Link href="/explore" className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
            Explorar
          </Link>
          {!isLoading && !user && (
            <>
            <Link href="/events/create" className="rounded-md bg-[#10264D] px-4 py-2 text-white hover:bg-[#10264D]/90">
              Criar Evento
            </Link>
            <Link href="/events" className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
              Meus Eventos
            </Link>
            <Link href="/registrations" className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
              Minhas Inscrições
            </Link>
            <Link href="/login" className="flex size-10 items-center justify-center rounded-full border hover:bg-gray-100">
              <User size={20}/>
            </Link>
            </>
          )}
          {user && (
            <>
              <Link href="/events" className="rounded-md bg-[#10264D] px-4 py-2 text-white hover:bg-[#10264D]/90">
                Meus Eventos
              </Link>
              <Link href="/registrations" className="rounded-md bg-[#10264D] px-4 py-2 text-white hover:bg-[#10264D]/90">
                Minhas Inscrições
              </Link>
              <Button onClick={handleLogout} className="rounded-md border border-[#10264D] bg-transparent px-4 py-2 text-[#10264D] hover:bg-[#10264D]/10">
                Sair
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
