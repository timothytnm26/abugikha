import { SyllableIntro } from '@/widgets/syllable-intro';
import { FooterCtaSection, HeroSection, LearningPathSection } from './sections';

export function HomePage() {
  return (
    <div id="top">
      <HeroSection />
      <SyllableIntro />
      <LearningPathSection />
      <FooterCtaSection />
    </div>
  );
}
