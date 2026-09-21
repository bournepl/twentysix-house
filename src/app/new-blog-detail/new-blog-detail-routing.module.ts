import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewBlogDetailComponent } from './new-blog-detail.component';

const routes: Routes = [
  { path: '', component: NewBlogDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewBlogDetailRoutingModule { }
