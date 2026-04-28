import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { NgxFastMarqueeModule } from 'ngx-fast-marquee';
import { ServicesHeroSectionComponent } from './sections/hero/services-hero-section.component';
import { ServicesSnapshotSectionComponent } from './sections/snapshot/services-snapshot-section.component';
import { ServicesPillarsSectionComponent } from './sections/pillars/services-pillars-section.component';
import { ServicesAudienceSectionComponent } from './sections/audience/services-audience-section.component';
import { ServicesProcessSectionComponent } from './sections/process/services-process-section.component';
import { ServicesDeliverablesSectionComponent } from './sections/deliverables/services-deliverables-section.component';
import { ServicesQualitySectionComponent } from './sections/quality/services-quality-section.component';
import { ServicesPortfolioSectionComponent } from './sections/portfolio/services-portfolio-section.component';
import { ServicesFaqSectionComponent } from './sections/faq/services-faq-section.component';
import { ServicesCtaSectionComponent } from './sections/cta/services-cta-section.component';

@NgModule({
  declarations: [
    ServicesComponent,
    ServicesHeroSectionComponent,
    ServicesSnapshotSectionComponent,
    ServicesPillarsSectionComponent,
    ServicesAudienceSectionComponent,
    ServicesProcessSectionComponent,
    ServicesDeliverablesSectionComponent,
    ServicesQualitySectionComponent,
    ServicesPortfolioSectionComponent,
    ServicesFaqSectionComponent,
    ServicesCtaSectionComponent
  ],
  imports: [
    CommonModule,
    NgxFastMarqueeModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }
