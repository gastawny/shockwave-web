'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Edit, Trash, Check, X, PenLine } from 'lucide-react'
import {
  Table,
  TableBody,
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
import { Parameter } from '@/types/parameter'
export function EditExplosiveParameters() {
  const queryClient = useQueryClient()

  const { data: explosiveParameters } = useQuery<Parameter[]>({
    queryKey: ['explosive-parameters'],
    queryFn: async () =>
      await fetcher(`/api/handlers/generic/parameters/getTableParameters`, {
        method: 'POST',
        body: JSON.stringify({ tableName: 'explosives' }),
        justReturnResponse: false,
      }),
    staleTime: 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: async (body: Partial<Parameter>) =>
      await fetcher('/api/handlers', {
        method: 'POST',
        body: JSON.stringify({ type: 'parameters', data: { ...body, tableName: 'explosives' } }),
        justReturnResponse: true,
      }),
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ['explosive-parameters'] })
      queryClient.invalidateQueries({ queryKey: ['explosive-data'] })
      toast({ title: 'Parâmetro criado com sucesso' })
    },
    onError: () => toast({ variant: 'destructive', title: 'Erro ao criar parâmetro' }),
  })

  const updateMutation = useMutation({
    mutationFn: async (body: Parameter) =>
      await fetcher('/api/handlers', {
        method: 'PUT',
        body: JSON.stringify({ type: 'parameters', data: { ...body, tableName: 'explosives' } }),
        justReturnResponse: true,
      }),
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ['explosive-parameters'] })
      toast({ title: 'Parâmetro atualizado' })
    },
    onError: () => toast({ variant: 'destructive', title: 'Erro ao atualizar parâmetro' }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      await fetcher(`/api/handlers/parameters/${id}`, {
        method: 'DELETE',
        justReturnResponse: true,
      }),
    onSuccess: async () => {
      queryClient.refetchQueries({ queryKey: ['explosive-parameters'] })
      toast({ title: 'Parâmetro removido' })
    },
    onError: () => toast({ variant: 'destructive', title: 'Erro ao remover parâmetro' }),
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [localRows, setLocalRows] = useState<Parameter[] | undefined>(explosiveParameters)
  const [newRow, setNewRow] = useState({ name: '', symbol: '', unit: '' })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  useEffect(() => {
    setLocalRows(explosiveParameters)
  }, [explosiveParameters])

  function startEdit(id: number) {
    setEditingId(id)
  }

  function cancelEdit() {
    setEditingId(null)
    setLocalRows(explosiveParameters)
  }

  function handleChange(
    id: number | 'new',
    field: keyof Parameter | keyof typeof newRow,
    value: string
  ) {
    if (id === 'new') {
      setNewRow((s) => ({ ...s, [field]: value }))
      return
    }
    setLocalRows((rows) =>
      rows?.map((r) => (r.id === id ? ({ ...r, [field]: value } as Parameter) : r))
    )
  }

  async function saveRow(row: Parameter) {
    await updateMutation.mutateAsync(row)
    setEditingId(null)
  }

  async function addRow() {
    if (!newRow.name.trim()) return toast({ variant: 'destructive', title: 'Nome obrigatório' })
    await createMutation.mutateAsync(newRow)
    setNewRow({ name: '', symbol: '', unit: '' })
  }

  async function removeRow(id?: number) {
    if (!id) return
    await deleteMutation.mutateAsync(id)
    setPendingDeleteId(null)
    setConfirmOpen(false)
  }

  function confirmRemove(id?: number) {
    if (!id) return
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto" variant="outline">
          <PenLine className="w-4 h-4 mr-1" />
          Editar parâmetros
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] px-4 lg:px-6 w-11/12 lg:w-3/5 2xl:w-2/5 max-w-[90vw]">
        <ScrollArea className="max-h-[80vh] max-w-full">
          <DialogHeader className="mb-4">
            <DialogTitle>Parâmetros de explosivos</DialogTitle>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localRows?.map((parameter) => (
                <TableRow key={parameter.id}>
                  <TableCell>
                    {editingId === parameter.id ? (
                      <Input
                        value={parameter.name}
                        onChange={(e) =>
                          handleChange(parameter.id as number, 'name', e.target.value)
                        }
                      />
                    ) : (
                      parameter.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === parameter.id ? (
                      <Input
                        value={parameter.unit}
                        onChange={(e) =>
                          handleChange(parameter.id as number, 'unit', e.target.value)
                        }
                      />
                    ) : (
                      parameter.unit
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    {editingId === parameter.id ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => saveRow(parameter)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(parameter.id as number)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => confirmRemove(parameter.id)}
                        >
                          <Trash className="w-4 h-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell>
                  <Input
                    value={newRow.name}
                    onChange={(e) => handleChange('new', 'name', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={newRow.unit}
                    onChange={(e) => handleChange('new', 'unit', e.target.value)}
                  />
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button size="sm" onClick={addRow} disabled={createMutation.isPending}>
                    Criar
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent className="w-3/4 lg:w-96">
              <AlertDialogHeader>
                <AlertDialogTitle>Remover parâmetro</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover este parâmetro? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (pendingDeleteId) removeRow(pendingDeleteId)
                  }}
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
