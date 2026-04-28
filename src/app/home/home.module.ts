import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxFastMarqueeModule } from 'ngx-fast-marquee';
import { HomeHeroSectionComponent } from './sections/hero/home-hero-section.component';
import { HomeIntroSectionComponent } from './sections/intro/home-intro-section.component';
import { HomeWhyChooseUsSectionComponent } from './sections/why-choose-us/home-why-choose-us-section.component';
import { HomeServicesSectionComponent } from './sections/services/home-services-section.component';
import { HomeProjectsSectionComponent } from './sections/projects/home-projects-section.component';
import { HomeProcessSectionComponent } from './sections/process/home-process-section.component';
import { HomeCollectionsSectionComponent } from './sections/collections/home-collections-section.component';
import { HomeBlogsSectionComponent } from './sections/blogs/home-blogs-section.component';
import { HomeCollaboratorsSectionComponent } from './sections/collaborators/home-collaborators-section.component';
import { HomeFaqSectionComponent } from './sections/faq/home-faq-section.component';
import { HomeContactSectionComponent } from './sections/contact/home-contact-section.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeHeroSectionComponent,
    HomeIntroSectionComponent,
    HomeWhyChooseUsSectionComponent,
    HomeServicesSectionComponent,
    HomeProjectsSectionComponent,
    HomeProcessSectionComponent,
    HomeCollectionsSectionComponent,
    HomeBlogsSectionComponent,
    HomeCollaboratorsSectionComponent,
    HomeFaqSectionComponent,
    HomeContactSectionComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgxFastMarqueeModule,
    HomeRoutingModule,
  ]
})
export class HomeModule { }
