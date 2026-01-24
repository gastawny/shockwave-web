export default function AppPage() {
  return (
    <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 w-full">
      <h1 className="text-3xl font-bold">Você está logado!</h1>
      <p className="">Utilize o menu lateral para navegar</p>
      <img src="/images/mario_apontando.png" className="h-96 object-contain" />
    </div>
  )
}
