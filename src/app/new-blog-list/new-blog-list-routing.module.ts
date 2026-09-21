import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewBlogListComponent } from './new-blog-list.component';

const routes: Routes = [
  { path: '', component: NewBlogListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewBlogListRoutingModule { }
