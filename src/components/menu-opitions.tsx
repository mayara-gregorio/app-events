"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export function MenuOpitions() {
    const [leaving, setLeaving] = useState(false);
    const { logout } = useAuth();
    const router = useRouter();


    async function handleLogout() {
    setLeaving(true);
    await logout();
    setLeaving(false);
    router.push("/login");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline"><User size={20}/></Button>} />
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/me")}>
            Perfil
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClickCapture={handleLogout}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
