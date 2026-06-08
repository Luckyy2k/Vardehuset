// Redigerbare sidetekster.
//
// Hver tekst har en nøkkel (key) og en standardverdi (default). Standardverdien
// vises alltid med mindre den er overstyrt i admin (lagres i tabellen
// `site_content` i Supabase). Sidene leser tekstene via useContent()-hooken.
//
// `groups` brukes både til å bygge admin-skjemaet og til å utlede
// standardtekstene. Feltyper:
//   - (ingen)      → enkel tekstlinje
//   - 'textarea'   → flerlinjes tekst (én verdi)
//   - 'multiline'  → avsnitt; skill avsnitt med tom linje

export const contentGroups = [
  {
    page: 'Forsiden',
    fields: [
      { key: 'home.hero.title', label: 'Hero – tittel', default: 'Velkommen til Vardehuset' },
      {
        key: 'home.hero.tagline',
        label: 'Hero – ingress',
        type: 'textarea',
        default:
          'Flotte og moderne utleielokaler til alle anledninger. Sentralt plassert mellom Ålesund sentrum og Moa.',
      },
      { key: 'home.occasions.eyebrow', label: 'Anledninger – stikkord', default: 'Våre lokaler' },
      { key: 'home.occasions.title', label: 'Anledninger – tittel', default: 'Perfekt for enhver anledning' },
      {
        key: 'home.occasions.intro',
        label: 'Anledninger – ingress',
        type: 'textarea',
        default:
          'Moderne og fleksible lokaler tilpasset dine behov, fra intime sammenkomster til større arrangementer.',
      },
      { key: 'home.gallery.eyebrow', label: 'Galleri – stikkord', default: 'Galleri' },
      { key: 'home.gallery.title', label: 'Galleri – tittel', default: 'Flotte lokaler' },
      { key: 'home.location.eyebrow', label: 'Beliggenhet – stikkord', default: 'Finn oss' },
      { key: 'home.location.title', label: 'Beliggenhet – tittel', default: 'Beliggenhet' },
      {
        key: 'home.location.intro',
        label: 'Beliggenhet – ingress',
        type: 'textarea',
        default:
          'Kulturhuset Varde ligger sentralt plassert i Nørvasundet, midt mellom Ålesund sentrum og Moa. Kort vei fra E136, med god skilting og enkel adkomst.',
      },
      { key: 'home.location.parking', label: 'Beliggenhet – parkering', default: 'Gratis parkering rett utenfor lokalet' },
      { key: 'home.location.distance', label: 'Beliggenhet – kjøreavstand', default: '10 min fra Ålesund sentrum, 5 min fra Moa' },
      { key: 'home.cta.eyebrow', label: 'Bunn – stikkord', default: 'Planlegger du et arrangement?' },
      { key: 'home.cta.title', label: 'Bunn – tittel', default: 'La oss skape uforglemmelige opplevelser sammen' },
      {
        key: 'home.cta.text',
        label: 'Bunn – tekst',
        type: 'textarea',
        default:
          'Kontakt oss for en uforpliktende samtale om ditt arrangement. Vi hjelper deg gjerne med planleggingen.',
      },
    ],
  },
  {
    page: 'Lokalet',
    fields: [
      { key: 'lokalet.hero.eyebrow', label: 'Topp – stikkord', default: 'Våre lokaler' },
      { key: 'lokalet.hero.title', label: 'Topp – tittel', default: 'Om lokalet' },
      {
        key: 'lokalet.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default:
          'Flotte og moderne selskapslokaler i gjennomført stil, sentralt plassert mellom Ålesund sentrum og Moa.',
      },
      { key: 'lokalet.gallery.eyebrow', label: 'Galleri – stikkord', default: 'Galleri' },
      { key: 'lokalet.gallery.title', label: 'Galleri – tittel', default: 'Bilder fra lokalet' },
      { key: 'lokalet.practical.eyebrow', label: 'Praktisk – stikkord', default: 'Alt du trenger' },
      { key: 'lokalet.practical.title', label: 'Praktisk – tittel', default: 'Praktisk informasjon' },
      { key: 'lokalet.cta.eyebrow', label: 'Bunn – stikkord', default: 'Interessert i å leie?' },
      { key: 'lokalet.cta.title', label: 'Bunn – tittel', default: 'Ta kontakt for en uforpliktende visning' },
      {
        key: 'lokalet.cta.text',
        label: 'Bunn – tekst',
        type: 'textarea',
        default: 'Send oss en forespørsel om din ønskede dato, så hjelper vi deg videre.',
      },
    ],
  },
  {
    page: 'Tekniske løsninger',
    fields: [
      { key: 'teknisk.hero.eyebrow', label: 'Topp – stikkord', default: 'Kulturhuset Varde tilbyr' },
      { key: 'teknisk.hero.title', label: 'Topp – tittel', default: 'Tekniske løsninger' },
      {
        key: 'teknisk.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default:
          'Et moderne kulturhus med profesjonelle fasiliteter for konsert, fest og arrangement.',
      },
      { key: 'teknisk.cta.eyebrow', label: 'Bunn – stikkord', default: 'Interessert i å leie?' },
      { key: 'teknisk.cta.title', label: 'Bunn – tittel', default: 'Ta kontakt for en uforpliktende visning' },
      {
        key: 'teknisk.cta.text',
        label: 'Bunn – tekst',
        type: 'textarea',
        default: 'Send oss en forespørsel om din ønskede dato, så hjelper vi deg videre.',
      },
    ],
  },
  {
    page: 'Mannskoret',
    fields: [
      { key: 'mannskoret.hero.eyebrow', label: 'Topp – stikkord', default: 'Siden 1926' },
      { key: 'mannskoret.hero.title', label: 'Topp – tittel', default: 'Mannskoret Varde' },
      {
        key: 'mannskoret.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default: '47 sangglade medlemmer med en rik historie fra Ålesund.',
      },
      { key: 'mannskoret.history.eyebrow', label: 'Historie – stikkord', default: 'Vår historie' },
      { key: 'mannskoret.history.title', label: 'Historie – tittel', default: '100 år med sangglede' },
      {
        key: 'mannskoret.history.body',
        label: 'Historie – tekst',
        type: 'multiline',
        default: [
          'Mannskoret Varde har i dag 47 sangglade medlemmer og feirer sitt 100-års jubileum i 2026.',
          'I de senere år har MK Varde gjennomført en rekke kabaret-forestillinger i sitt eget kulturhus. Som en oppvarming til «Tall Ships Races» i juli 2015 ble Shanty-kabareten «Heis Seil med Varde» gjennomført med fire forestillinger i februar–mars samme år.',
          'MK Varde er stolt over å ha vært det offisielle Shantykoret under «Cutty Sark» i 2001 (Ålesund) og 2008 (Måløy) og «Tall Ships Races» i 2015 (Ålesund).',
        ].join('\n\n'),
      },
      { key: 'mannskoret.conductor.eyebrow', label: 'Dirigent – stikkord', default: 'Vår dirigent' },
      {
        key: 'mannskoret.conductor.body',
        label: 'Dirigent – tekst',
        type: 'multiline',
        default: [
          'Walter Stiegler har vært MK Vardes dirigent siden år 2000. Han har med stor faglig dyktighet introdusert nye sjangere i koret: shanty, barbershop, musikaler, gospel og sakrale sanger, men har også videreført den tradisjonelle mannskorsangen.',
          'Koret har vært mye rundt i Norge, men også ute i verden og sunget og opplevd mye glede med sang og musikk i møte med andre kor. I 2018 var koret på tur til Kaunas i Litauen.',
        ].join('\n\n'),
      },
      { key: 'mannskoret.performance.eyebrow', label: 'Forestillinger – stikkord', default: 'Forestillinger' },
      { key: 'mannskoret.performance.title', label: 'Forestillinger – tittel', default: 'Irsk aften' },
      {
        key: 'mannskoret.performance.body',
        label: 'Forestillinger – tekst',
        type: 'multiline',
        default: [
          'Turen til Irland i 2002, til Galway og Dublin med sang i både kirker og katedraler – men også ved de mange pubbesøk underveis – la nok spiren til forestillingen «Irsk aften».',
          'Etter to vellykkede forestillinger i november 2017 på Kulturhuset Varde i Nørvasundet, ble arrangementet på oppfordring satt opp igjen i november 2018 på Teaterfabrikken i Ålesund, og i juni 2022 fikk vi mulighet til å sette opp forestillingen på Rosenlund Hamn.',
        ].join('\n\n'),
      },
      { key: 'mannskoret.cta.eyebrow', label: 'Bunn – stikkord', default: 'Interessert i å bli med?' },
      { key: 'mannskoret.cta.title', label: 'Bunn – tittel', default: 'Vi er alltid på jakt etter nye sangglade medlemmer' },
      { key: 'mannskoret.cta.text', label: 'Bunn – tekst', default: 'Ingen erfaring nødvendig!' },
    ],
  },
  {
    page: 'Konserter',
    fields: [
      { key: 'konserter.hero.eyebrow', label: 'Topp – stikkord', default: 'Mannskoret Varde' },
      { key: 'konserter.hero.title', label: 'Topp – tittel', default: 'Konserter & arrangementer' },
      {
        key: 'konserter.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default: 'Opplev Mannskoret Varde live – vi holder flere konserter i året.',
      },
      { key: 'konserter.upcoming.eyebrow', label: 'Kommende – stikkord', default: 'Kommende' },
      { key: 'konserter.upcoming.title', label: 'Kommende – tittel', default: 'Fremtidige konserter' },
      { key: 'konserter.upcoming.empty', label: 'Kommende – tom-tekst', default: 'Ingen kommende konserter er satt opp ennå.' },
      { key: 'konserter.past.eyebrow', label: 'Tidligere – stikkord', default: 'Tidligere' },
      { key: 'konserter.past.title', label: 'Tidligere – tittel', default: 'Tidligere konserter' },
    ],
  },
  {
    page: 'Sponsorer',
    fields: [
      { key: 'sponsorer.hero.eyebrow', label: 'Topp – stikkord', default: 'Tusen takk' },
      { key: 'sponsorer.hero.title', label: 'Topp – tittel', default: 'Våre sponsorer' },
      {
        key: 'sponsorer.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default:
          'Kulturhuset Varde hadde ikke vært mulig uten våre fantastiske støttespillere.',
      },
      { key: 'sponsorer.history.eyebrow', label: 'Historie – stikkord', default: 'Historien' },
      { key: 'sponsorer.history.title', label: 'Historie – tittel', default: 'Veien til Kulturhuset Varde' },
      {
        key: 'sponsorer.history.body',
        label: 'Historie – tekst',
        type: 'multiline',
        default: [
          'MK Varde (Mannskoret Varde) var i mange år sameier i «Sangens Hus». Med rett bare til fredagsøvinger gikk tiden fra dette, og koret hadde neppe eksistert i dag om man ikke hadde tatt andre valg i 2002 og senere ble løst ut av sameiet.',
          'Etter års forgjeves søk etter egnede lokaler fikk Mannskoret Varde i 2006 et tilbud fra kommunen om å kjøpe ei tomt på 1400 m² i Nørvasundet på gunstige vilkår. Dette forutsatt at koret besørget omregulering til «almennyttig kulturformål».',
          'Dette ble gjort, og etter et grundig forprosjekt – mye på dugnadsbasis – startet byggingen i juni 2009. Huset, som er på brutto 350 m², står nå ferdig og fremstår som et fantastisk bygg til glede for kormedlemmene og hele lokalsamfunnet.',
        ].join('\n\n'),
      },
      { key: 'sponsorer.list.eyebrow', label: 'Liste – stikkord', default: 'En stor takk' },
      { key: 'sponsorer.list.title', label: 'Liste – tittel', default: 'Disse støttespillerne har bidratt' },
      { key: 'sponsorer.list.intro', label: 'Liste – ingress', type: 'textarea', default: 'Sammen har de gjort Kulturhuset Varde til virkelighet.' },
    ],
  },
  {
    page: 'Medlemmer',
    fields: [
      { key: 'medlemmer.hero.eyebrow', label: 'Topp – stikkord', default: 'Mannskoret Varde' },
      { key: 'medlemmer.hero.title', label: 'Topp – tittel', default: 'Våre medlemmer' },
      {
        key: 'medlemmer.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default: '47 sangglade medlemmer fordelt på fire stemmegrupper, ledet av vår dirigent.',
      },
    ],
  },
  {
    page: 'Styret',
    fields: [
      { key: 'styret.hero.eyebrow', label: 'Topp – stikkord', default: 'Mannskoret Varde' },
      { key: 'styret.hero.title', label: 'Topp – tittel', default: 'Styret' },
      {
        key: 'styret.photo.caption',
        label: 'Bildetekst',
        type: 'textarea',
        default:
          'Fra venstre: Robert Valderhaug, Sverre Petter Abelseth, Einar Gundersen, Trond Inge Aarønes',
      },
      { key: 'styret.contact.title', label: 'Kontakt – tittel', default: 'Kontakt styret' },
      {
        key: 'styret.contact.intro',
        label: 'Kontakt – ingress',
        type: 'textarea',
        default:
          'Ta gjerne kontakt med en av styremedlemmene for spørsmål om Mannskoret Varde.',
      },
    ],
  },
  {
    page: 'Bli medlem',
    fields: [
      { key: 'blimedlem.hero.eyebrow', label: 'Topp – stikkord', default: 'Vi ønsker nye medlemmer velkommen' },
      { key: 'blimedlem.hero.title', label: 'Topp – tittel', default: 'Bli medlem' },
      {
        key: 'blimedlem.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default: 'Har du lyst til å bli med i en glad og inkluderende gjeng?',
      },
      { key: 'blimedlem.benefits.eyebrow', label: 'Fordeler – stikkord', default: 'Hvorfor bli med' },
      { key: 'blimedlem.benefits.title', label: 'Fordeler – tittel', default: 'Dette får du som medlem' },
      { key: 'blimedlem.practice.eyebrow', label: 'Øvinger – stikkord', default: 'Praktisk informasjon' },
      { key: 'blimedlem.practice.title', label: 'Øvinger – tittel', default: 'Våre øvinger' },
      { key: 'blimedlem.contact.eyebrow', label: 'Kontakt – stikkord', default: 'Ta kontakt' },
      { key: 'blimedlem.contact.title', label: 'Kontakt – tittel', default: 'For nærmere informasjon' },
      {
        key: 'blimedlem.contact.intro',
        label: 'Kontakt – ingress',
        type: 'textarea',
        default:
          'Ta gjerne kontakt med oss for en uforpliktende prat om medlemskap i Mannskoret Varde.',
      },
    ],
  },
  {
    page: 'Kontakt',
    fields: [
      { key: 'kontakt.hero.eyebrow', label: 'Topp – stikkord', default: 'Mannskoret Varde' },
      { key: 'kontakt.hero.title', label: 'Topp – tittel', default: 'Kontakt oss' },
      {
        key: 'kontakt.hero.intro',
        label: 'Topp – ingress',
        type: 'textarea',
        default: 'Ta gjerne kontakt med oss – vi svarer så raskt vi kan.',
      },
    ],
  },
]

// Flat oppslagstabell nøkkel → standardtekst.
export const contentDefaults = Object.fromEntries(
  contentGroups.flatMap((g) => g.fields.map((f) => [f.key, f.default])),
)
