import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';
import { AboutHeroSectionComponent } from './sections/hero/about-hero-section.component';
import { AboutOverviewSectionComponent } from './sections/overview/about-overview-section.component';
import { AboutMessageSectionComponent } from './sections/message/about-message-section.component';
import { AboutFactsSectionComponent } from './sections/facts/about-facts-section.component';
import { AboutCtaSectionComponent } from './sections/cta/about-cta-section.component';


@NgModule({
  declarations: [
    AboutUsComponent,
    AboutHeroSectionComponent,
    AboutOverviewSectionComponent,
    AboutMessageSectionComponent,
    AboutFactsSectionComponent,
    AboutCtaSectionComponent
  ],
  imports: [
    CommonModule,
    AboutUsRoutingModule
  ]
})
export class AboutUsModule { }
