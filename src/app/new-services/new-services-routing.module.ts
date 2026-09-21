import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewServicesComponent } from './new-services.component';

const routes: Routes = [
  { path: '', component: NewServicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewServicesRoutingModule { }
