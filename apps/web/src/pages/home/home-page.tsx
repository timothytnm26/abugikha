import { SyllableIntro } from '@/widgets/syllable-intro';
import { DISPLAY_SERIF_CSS } from '@/shared/config/fonts';
import { FooterCtaSection, HeroSection, LearningPathSection } from './sections';

export function HomePage() {
  return (
    <div id="top">
      {/* React 19 đưa stylesheet lên <head> */}
      <link rel="stylesheet" href={DISPLAY_SERIF_CSS} precedence="default" />
      <div className="home-flow relative overflow-hidden">
        <HeroSection />
        <SyllableIntro />
        <LearningPathSection />
        <FooterCtaSection />
      </div>
    </div>
  );
}
