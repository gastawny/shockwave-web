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
      ],
    },
    {
      title: 'Relatórios',
      defaultOpen: false,
      url: '/reports',
      items: [
        {
          title: 'Explosivos',
          url: '#',
        },
        {
          title: 'Ameaças de Bomba',
          url: '/reports/bomb-threat',
        },
      ],
    },
    {
      title: 'POPs',
      defaultOpen: false,
      url: '/pops',
      items: [
        {
          title: '200.6 - Ameaça de Bomba',
          url: '#',
        },
        {
          title: '200.7 - Objeto Localizado',
          url: '#',
        },
        {
          title: '200.8 - Explosão de Bomba',
          url: '#',
        },
      ],
    },
    {
      title: 'Configurações',
      defaultOpen: false,
      url: '/settings',
      items: [
        {
          title: 'Dados Pessoais',
          url: '#',
        },
      ],
    },
  ],
}
