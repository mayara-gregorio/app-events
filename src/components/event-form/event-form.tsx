"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),
  date: z.string().min(1, "Selecione a data do evento."),
  time: z.string().min(1, "Selecione o horário do evento."),
  location: z.string().min(1, "Informe o local do evento."),
  image: z.url("Digite uma URL de imagem válida."),
})

export type EventFormValues = z.infer<typeof formSchema>

type EventFormProps = {
  defaultValues?: EventFormValues
  submitLabel?: string
  onSubmit?: (values: EventFormValues) => Promise<void>
}

export function EventForm({
  defaultValues,
  submitLabel = "Salvar",
  onSubmit,
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: "",
    },
  })

  async function handleSubmit(values: EventFormValues) {
    if (!onSubmit) {
      toast.error("O formulário ainda não está conectado ao servidor.")
      return
    }

    try {
      await onSubmit(values)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o evento. Tente novamente.",
      )
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-title">Título</FieldLabel>
              <Input
                {...field}
                id="event-title"
                placeholder="Ex.: Workshop de Next.js"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-description">Descrição</FieldLabel>
              <Textarea
                {...field}
                id="event-description"
                rows={4}
                placeholder="Conte mais sobre o evento"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="event-date">Data</FieldLabel>
                <Input
                  {...field}
                  id="event-date"
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="time"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="event-time">Horário</FieldLabel>
                <Input
                  {...field}
                  id="event-time"
                  type="time"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-location">Local</FieldLabel>
              <Input
                {...field}
                id="event-location"
                placeholder="Ex.: Teresina - PI"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-image">URL da imagem</FieldLabel>
              <Input
                {...field}
                id="event-image"
                placeholder="https://exemplo.com/imagem.jpg"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#10264D] text-white hover:bg-[#10264D]/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Spinner />}
          {submitLabel}
        </Button>
      </FieldGroup>
    </form>
  )
}