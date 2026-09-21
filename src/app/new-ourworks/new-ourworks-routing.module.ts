import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewOurworksComponent } from './new-ourworks.component';
import { CompletedHomesListComponent } from './completed-homes-list/completed-homes-list.component';
import { DesignPortfolioListComponent } from './design-portfolio-list/design-portfolio-list.component';
import { CompletedHomeDetailComponent } from './completed-home-detail/completed-home-detail.component';
import { DesignProjectDetailComponent } from './design-project-detail/design-project-detail.component';
import { COMPLETED_HOMES } from './completed-homes.data';
import { DESIGN_PROJECTS } from './design-projects.data';

const routes: Routes = [
  {
    path: 'completed/:slug',
    component: CompletedHomeDetailComponent,
    title: route => {
      const project = COMPLETED_HOMES.find(item => item.slug === route.paramMap.get('slug'));
      return project
        ? `${project.title} | ผลงานบ้านสร้างจริง | Twentysix House`
        : 'ไม่พบโครงการ | Twentysix House';
    },
    data: { seoManagedByComponent: true },
  },
  {
    path: 'completed',
    component: CompletedHomesListComponent,
    title: 'ผลงานบ้านสร้างจริงในอุดรธานี | Twentysix House',
    data: { seoManagedByComponent: true },
  },
  {
    path: 'design/:slug',
    component: DesignProjectDetailComponent,
    title: route => {
      const project = DESIGN_PROJECTS.find(item => item.slug === route.paramMap.get('slug'));
      return project
        ? `${project.title} | ผลงานออกแบบบ้าน | Twentysix House`
        : 'ไม่พบผลงานออกแบบ | Twentysix House';
    },
    data: { seoManagedByComponent: true },
  },
  {
    path: 'design',
    component: DesignPortfolioListComponent,
    title: 'ผลงานออกแบบบ้านในอุดรธานี | Twentysix House',
    data: { seoManagedByComponent: true },
  },
  {
    path: '',
    component: NewOurworksComponent,
    title: 'ผลงานรับสร้างบ้านและออกแบบบ้าน | Twentysix House',
    data: { seoManagedByComponent: true },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewOurworksRoutingModule { }
