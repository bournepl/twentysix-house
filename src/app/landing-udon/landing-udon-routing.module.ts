import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingUdonComponent } from './landing-udon.component';

const routes: Routes = [
  {
    path: '', component: LandingUdonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingUdonRoutingModule { }
