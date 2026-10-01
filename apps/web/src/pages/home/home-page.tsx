import { SyllableIntro } from '@/widgets/syllable-intro';
import { POSTER_FONT_CSS } from '@/shared/config/fonts';
import { FooterCtaSection, HeroSection, LearningPathSection } from './sections';

export function HomePage() {
  return (
    <div id="top">
      {/* React 19 đưa stylesheet lên <head> */}
      <link rel="stylesheet" href={POSTER_FONT_CSS} precedence="default" />
      <HeroSection />
      <SyllableIntro />
      <LearningPathSection />
      <FooterCtaSection />
    </div>
  );
}
