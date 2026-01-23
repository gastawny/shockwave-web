'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Plus } from 'lucide-react'
import { Edit, Trash, Check, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { fetcher } from '@/infra/fetcher'
import { Explosive } from '@/types/explosive'
import { Parameter, ParameterSchema } from '@/types/parameter'
import { EditExplosiveParameters } from './components/edit-explosive-parameters'
import ExplosiveDataForm from './components/explosive-data-form'

export interface ExplosivesModalProps {
  method: 'PUT' | 'POST'
  data?: Explosive
}

export function ExplosivesModal({ data, method }: ExplosivesModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['formThreats', method],
    mutationFn: async (data: any) => {
      const res = await fetcher('/api/handlers', {
        method,
        body: JSON.stringify({
          type: 'explosives',
          data,
        }),
      })

      if (!res.ok) throw new Error('Error in mutation')

      return res
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['library', 'users'] })
      queryClient.refetchQueries({ queryKey: ['select-dynamic-options', 'users'] })
      // form.reset()
      setIsDialogOpen(false)
      toast({ title: `Usuário ${method === 'POST' ? 'criado' : 'atualizado'} com sucesso` })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: `Erro ao ${method === 'POST' ? 'criar' : 'editar'} forma de ameaça`,
      })
    },
  })

  return (
    <>
      {method === 'POST' && <EditExplosiveParameters />}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className={`${method === 'POST' ? 'w-full' : ''}`} variant="outline">
            {method === 'POST' && <Plus className="h-4 w-4" />}
            {method === 'PUT' ? 'Editar' : 'Criar'}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] lg:w-[70vw] max-w-none">
          <ScrollArea className="max-h-[90vh]">
            <DialogHeader className="mb-4">
              <DialogTitle>
                {method === 'PUT'
                  ? `Editar forma de ameaça | ${data?.name}`
                  : 'Criar forma de ameaça'}
              </DialogTitle>
            </DialogHeader>

            <ExplosiveDataForm
              method={method}
              explosiveId={data?.id}
              onSaved={() => setIsDialogOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
