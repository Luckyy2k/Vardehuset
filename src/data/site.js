export const site = {
  name: 'Kulturhuset Varde',
  shortName: 'Vardehuset',
  tagline:
    'Flotte og moderne utleielokaler til alle anledninger. Sentralt plassert mellom Ålesund sentrum og Moa.',
  address: {
    street: 'Borgundvegen 393',
    zip: '6015 Ålesund',
    area: 'Nørvasundet, Ålesund',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Borgundvegen+393+6015+%C3%85lesund',
  },
  email: 'post@vardehuset.no',
  calendarEmail: 'kalender@vardehuset.no',
  contacts: [
    { name: 'Sverre Petter Abelseth', phone: '412 13 927' },
    { name: 'Inge Domaas', phone: '900 39 101' },
  ],
}

export const nav = [
  {
    group: 'Vardehuset',
    to: '/',
    links: [
      { label: 'Hjem', to: '/' },
      { label: 'Lokalet', to: '/lokalet' },
      { label: 'Tekniske løsninger', to: '/tekniske-losninger' },
      { label: 'Kalender', to: '/kalender' },
      { label: 'Sponsorer', to: '/sponsorer' },
      { label: 'Forespørsel', to: '/foresporsel' },
    ],
  },
  {
    group: 'Mannskoret Varde',
    to: '/mannskoret',
    links: [
      { label: 'Om Mannskoret', to: '/mannskoret' },
      { label: 'Konserter', to: '/konserter' },
      { label: 'Styret', to: '/styret' },
      { label: 'Medlemmer', to: '/medlemmer' },
      { label: 'Bli Medlem', to: '/bli-medlem' },
    ],
  },
]
