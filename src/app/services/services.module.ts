import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { ServicesHeroSectionComponent } from './sections/hero/services-hero-section.component';
import { ServicesPillarsSectionComponent } from './sections/pillars/services-pillars-section.component';
import { ServicesProcessSectionComponent } from './sections/process/services-process-section.component';
import { ServicesQualitySectionComponent } from './sections/quality/services-quality-section.component';
import { ServicesFaqSectionComponent } from './sections/faq/services-faq-section.component';
import { ServicesCtaSectionComponent } from './sections/cta/services-cta-section.component';

@NgModule({
  declarations: [
    ServicesComponent,
    ServicesHeroSectionComponent,
    ServicesPillarsSectionComponent,
    ServicesProcessSectionComponent,
    ServicesQualitySectionComponent,
    ServicesFaqSectionComponent,
    ServicesCtaSectionComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }
