export const sideBarData = {
  navMain: [
    {
      title: 'Novo Evento',
      defaultOpen: true,
      url: '/new-event',
      items: [
        {
          title: 'Ameaça de Bomba',
          url: '/new-event/bomb-threat',
        },
        {
          title: 'Objeto Localizado',
          url: '/new-event/located-object',
        },
        {
          title: 'Pós-Explosão',
          url: '#',
        },
      ],
    },
    {
      title: 'Biblioteca',
      defaultOpen: false,
      url: '/library',
      items: [
        {
          title: 'Tipos de Solo',
          url: '/library/grounds',
        },
        {
          title: 'Formatos de Objeto',
          url: '/library/objectFormats',
        },
        {
          title: 'Formas de Ameaça',
          url: '/library/formThreats',
        },
        {
          title: 'Explosivos',
          url: '/library/explosives',
        },
        {
          title: 'Objetos Localizados',
          url: '/library/locatedObjects',
        },
        {
          title: 'Ameaças de Bomba',
          url: '/library/bombThreats',
        },
        {
          title: 'POPs',
          url: '/library/pops',
        },
        {
          title: 'Usuários',
          url: '/library/users',
          admin: true,
        },
      ],
    },
    {
      title: 'Relatórios',
      defaultOpen: false,
      url: '/reports',
      items: [
        {
          title: 'Relatórios Gerais',
          url: '/reports/general',
        },
        {
          title: 'Ameaças de Bomba',
          url: '/reports/bomb-threat',
        },
      ],
    },
  ],
}
