import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewContactComponent } from './new-contact.component';

const routes: Routes = [
  { path: '', component: NewContactComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewContactRoutingModule { }
