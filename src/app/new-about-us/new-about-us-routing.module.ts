import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewAboutUsComponent } from './new-about-us.component';

const routes: Routes = [
  { path: '', component: NewAboutUsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewAboutUsRoutingModule { }
