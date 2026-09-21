import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HouseCatalogComponent } from './house-catalog.component';
import { HouseCatalogDetailComponent } from './house-catalog-detail.component';
import { findHouseCatalogItem } from './house-catalog.data';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HouseCatalogComponent, data: { seoManagedByComponent: true } },
  {
    path: ':slug',
    component: HouseCatalogDetailComponent,
    data: { seoManagedByComponent: true },
    title: route => {
      const house = findHouseCatalogItem(route.paramMap.get('slug') ?? '');
      return house
        ? `แบบบ้าน ${house.name} ${house.thaiName} | Twentysix House`
        : 'ไม่พบแบบบ้าน | Twentysix House';
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseCatalogRoutingModule {}
