import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SiteMenuComponent } from './site-menu/site-menu.component';

@NgModule({
  declarations: [SiteMenuComponent],
  imports: [CommonModule, RouterModule],
  exports: [SiteMenuComponent]
})
export class SharedUiModule { }
