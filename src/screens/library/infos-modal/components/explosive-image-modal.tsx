'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CloudUploadIcon, ImageIcon, Trash2Icon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { fetcher } from '@/infra/fetcher'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/config/variables'
import { cookies } from '@/infra/cookies'
import { toast } from '@/components/ui/use-toast'
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneImagePreview,
  DropzoneTrigger,
  useDropzone,
} from '@/components/ui/dropzone'
import { FileType } from '@/types/file'

interface ExplosiveImageModalProps {
  id: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExplosiveImageModal({ id, open, onOpenChange }: ExplosiveImageModalProps) {
  const [saving, setSaving] = useState(false)
  const queryClient = useQueryClient()

  const { data: imageData, isLoading } = useQuery<FileType | null>({
    queryKey: ['explosive-image', id],
    queryFn: async () => {
      const res = await fetcher(`/api/explosives/${id}/image`, { justReturnResponse: true })
      if (res.status === 404 || res.status === 204) return null
      return res.json()
    },
    enabled: open,
    retry: false,
  })

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        status: 'success',
        result: URL.createObjectURL(file),
      }
    },
    validation: {
      accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
  })

  async function handleSave() {
    setSaving(true)
    try {
      const formData = new FormData()
      const file = dropzone.fileStatuses[0]?.file
      if (file) {
        formData.append('image', file)
      }

      const res = await fetch(API_URL + `/api/explosives/${id}/image`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${(await cookies.get('at')) || ''}`,
        },
        body: formData,
      })

      if (!res.ok) {
        toast({ variant: 'destructive', title: 'Erro ao salvar imagem' })
        return
      }

      toast({ title: 'Imagem salva com sucesso' })
      queryClient.invalidateQueries({ queryKey: ['explosive-image', id] })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const hasNewFile = dropzone.fileStatuses.length > 0
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
    <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] flex flex-col p-2">
        <DialogHeader className="sr-only">
          <DialogTitle>Visualizar imagem</DialogTitle>
          <DialogDescription>Visualização em tela cheia da imagem do explosivo</DialogDescription>
        </DialogHeader>
        {imageData?.data && (
          <img
            src={`data:image/jpeg;base64,${imageData.data}`}
            alt={imageData.name}
            className="w-full h-full object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] lg:w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Imagem do Explosivo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}

          {!isLoading && imageData?.data && !hasNewFile && (
            <div
              className="rounded-md overflow-hidden border cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={`data:image/jpeg;base64,${imageData.data}`}
                alt={imageData.name}
                className="w-full object-contain max-h-64"
              />
            </div>
          )}

          <Dropzone {...dropzone}>
            <div>
              <div className="flex justify-between">
                <DropzoneDescription>
                  {imageData?.data ? 'Substituir imagem' : 'Selecione uma imagem'}
                </DropzoneDescription>
                <DropzoneMessage />
              </div>
              <DropZoneArea>
                <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
                  <CloudUploadIcon className="size-8" />
                  <div>
                    <p className="font-semibold">Selecione ou arraste e solte</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG até 10MB</p>
                  </div>
                </DropzoneTrigger>
              </DropZoneArea>
            </div>

            <DropzoneFileList className="mt-2">
              {dropzone.fileStatuses.map((file) => (
                <DropzoneFileListItem
                  className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                  key={file.id}
                  file={file}
                >
                  {file.status === 'pending' && (
                    <div className="aspect-video animate-pulse bg-black/20" />
                  )}
                  {file.status === 'success' && (
                    <DropzoneImagePreview file={file} imgClassName="aspect-video object-cover" />
                  )}
                  <div className="flex items-center justify-between p-2 pl-4">
                    <p className="truncate text-sm">{file.fileName}</p>
                    <DropzoneRemoveFile variant="ghost" className="shrink-0 hover:outline">
                      <Trash2Icon className="size-4" />
                    </DropzoneRemoveFile>
                  </div>
                </DropzoneFileListItem>
              ))}
            </DropzoneFileList>
          </Dropzone>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export function ExplosiveImageButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <ImageIcon className="w-4 h-4" />
      </Button>
      {open && <ExplosiveImageModal id={id} open={open} onOpenChange={setOpen} />}
    </>
  )
}
