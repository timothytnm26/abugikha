import { SyllableIntro } from '@/widgets/syllable-intro';
import { FooterCtaSection, HeroSection, LearningPathSection } from './sections';
import { FloatingGlyphs } from './sections/floating-glyphs';

export function HomePage() {
  return (
    <div id="top">
      <div className="home-flow relative overflow-hidden">
        <FloatingGlyphs />
        <HeroSection />
        <SyllableIntro />
        <LearningPathSection />
        <FooterCtaSection />
      </div>
    </div>
  );
}
