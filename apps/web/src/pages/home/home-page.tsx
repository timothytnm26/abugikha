import { SyllableIntro } from '@/widgets/syllable-intro';
import { FooterCtaSection, HeroSection, LearningPathSection } from './sections';

export function HomePage() {
  return (
    <div id="top">
      <div className="home-flow relative overflow-hidden">
        <HeroSection />
        <SyllableIntro />
        <LearningPathSection />
        <FooterCtaSection />
      </div>
    </div>
  );
}
