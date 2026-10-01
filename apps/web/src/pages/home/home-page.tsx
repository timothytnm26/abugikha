import { SyllableIntro } from '@/widgets/syllable-intro';
import { SmoothScroll } from '@/shared/ui';
import { FooterCtaSection, HeroSection, LearningPathSection, ManifestoSection } from './sections';

export function HomePage() {
  return (
    <div id="top">
      <SmoothScroll />
      <HeroSection />
      <ManifestoSection />
      <SyllableIntro />
      <LearningPathSection />
      <FooterCtaSection />
    </div>
  );
}
