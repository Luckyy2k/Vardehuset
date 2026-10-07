import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import { useContent } from '../lib/useContent'

export default function Historie() {
  const t = useContent()
  const pdf = t('historie.pdf.file')

  return (
    <>
      <PageHero
        eyebrow={t('historie.hero.eyebrow')}
        title={t('historie.hero.title')}
        intro={t('historie.hero.intro')}
      />

      {pdf && (
        <section className="bg-warm">
          <div className="container-page py-20">
            <SectionHeading center title={t('historie.pdf.title')} intro={t('historie.pdf.intro')} />
            <div className="mt-8 text-center">
              <Button href={pdf} target="_blank" rel="noreferrer" variant="primary">
                Åpne PDF
              </Button>
            </div>
            {/* Innebygd visning på større skjermer – mobil bruker knappen over. */}
            <iframe
              src={pdf}
              title={t('historie.hero.title')}
              className="mx-auto mt-10 hidden h-[85vh] w-full max-w-4xl rounded-2xl border border-primary/10 bg-white shadow-sm md:block"
            />
          </div>
        </section>
      )}
    </>
  )
}
