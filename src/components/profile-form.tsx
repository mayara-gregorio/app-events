"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
    name: string
    email: string
}

export default function ProfileForm({ name, email }: Props) {
    const router = useRouter()

    // Os campos começam com os dados atuais do usuário
    const [nome, setNome] = useState(name)
    const [mail, setMail] = useState(email)
    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")

    const [salvando, setSalvando] = useState(false)
    const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null)

    async function salvar(e: React.FormEvent) {
        e.preventDefault() // não recarrega a página
        setMensagem(null)
        setSalvando(true)

        try {
            const resposta = await fetch("/api/auth/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nome,
                    email: mail,
                    currentPassword: senhaAtual || undefined,
                    newPassword: novaSenha || undefined,
                }),
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                setMensagem({ tipo: "erro", texto: dados.message || "Não foi possível salvar." })
                return
            }

            setSenhaAtual("")
            setNovaSenha("")
            setMensagem({ tipo: "ok", texto: "Perfil atualizado com sucesso!" })
            router.refresh() // atualiza o nome lá no topo da página
        } catch {
            setMensagem({ tipo: "erro", texto: "Erro de conexão. Tente novamente." })
        } finally {
            setSalvando(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Editar perfil</CardTitle>
                <CardDescription>Para trocar a senha, preencha a senha atual e a nova.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={salvar} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={mail} onChange={(e) => setMail(e.target.value)} required />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="senhaAtual">Senha atual</Label>
                            <Input id="senhaAtual" type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="novaSenha">Nova senha</Label>
                            <Input id="novaSenha" type="password" minLength={6} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                        </div>
                    </div>

                    {mensagem && (
                        <p className={mensagem.tipo === "ok" ? "text-sm text-green-600" : "text-sm text-red-600"}>
                            {mensagem.texto}
                        </p>
                    )}

                    <Button type="submit" disabled={salvando}>
                        {salvando ? "Salvando..." : "Salvar alterações"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}