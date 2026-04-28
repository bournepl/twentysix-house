import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';
import { AboutHeroSectionComponent } from './sections/hero/about-hero-section.component';
import { AboutOverviewSectionComponent } from './sections/overview/about-overview-section.component';
import { AboutPhilosophySectionComponent } from './sections/philosophy/about-philosophy-section.component';
import { AboutTrustSectionComponent } from './sections/trust/about-trust-section.component';
import { AboutMessageSectionComponent } from './sections/message/about-message-section.component';
import { AboutWorkflowSectionComponent } from './sections/workflow/about-workflow-section.component';
import { AboutFactsSectionComponent } from './sections/facts/about-facts-section.component';
import { AboutPortfolioSectionComponent } from './sections/portfolio/about-portfolio-section.component';
import { AboutCtaSectionComponent } from './sections/cta/about-cta-section.component';


@NgModule({
  declarations: [
    AboutUsComponent,
    AboutHeroSectionComponent,
    AboutOverviewSectionComponent,
    AboutPhilosophySectionComponent,
    AboutTrustSectionComponent,
    AboutMessageSectionComponent,
    AboutWorkflowSectionComponent,
    AboutFactsSectionComponent,
    AboutPortfolioSectionComponent,
    AboutCtaSectionComponent
  ],
  imports: [
    CommonModule,
    AboutUsRoutingModule
  ]
})
export class AboutUsModule { }
