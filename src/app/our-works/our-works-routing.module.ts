import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurWorksComponent } from './our-works.component';


const routes: Routes = [
  {
    path: '',
    component: OurWorksComponent,
  },
  {
    path: 'real-projects',
    loadChildren: () =>
      import('./real-projects/real-projects.module').then((m) => m.RealProjectsModule),
  },
  {
    path: 'house-designs',
    loadChildren: () =>
      import('./house-designs/house-designs.module').then((m) => m.HouseDesignsModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OurWorksRoutingModule { }
