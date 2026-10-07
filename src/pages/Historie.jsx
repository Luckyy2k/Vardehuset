import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import PdfViewer from '../components/PdfViewer'
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
            <div className="mt-10">
              <PdfViewer key={pdf} src={pdf} title={t('historie.hero.title')} />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
