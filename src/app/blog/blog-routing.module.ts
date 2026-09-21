import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import blogData from '../../assets/json/blog.json';

interface BlogRouteItem {
  _id: { $oid: string };
  title: string;
  seoTitle?: string;
  slug: string;
  status: boolean;
}

const blogs = (blogData as BlogRouteItem[]).filter(blog => blog.status);
const blogTitle = (routeValue: string): string => {
  const blog = blogs.find(item => item.slug === routeValue || item._id.$oid === routeValue);
  return blog ? `${blog.seoTitle || blog.title} | Twentysix House` : 'ไม่พบบทความ | Twentysix House';
};

const routes: Routes = [
  {
    path: 'detail/:id',
    title: route => blogTitle(route.paramMap.get('id') ?? ''),
    data: { seoManagedByComponent: true },
    loadChildren: () => import('../new-blog-detail/new-blog-detail.module').then(m => m.NewBlogDetailModule)
  },
  { path: 'list', redirectTo: '', pathMatch: 'full' },
  {
    path: ':slug',
    title: route => blogTitle(route.paramMap.get('slug') ?? ''),
    data: { seoManagedByComponent: true },
    loadChildren: () => import('../new-blog-detail/new-blog-detail.module').then(m => m.NewBlogDetailModule)
  },
  {
    path: '',
    pathMatch: 'full',
    data: { seoManagedByComponent: true },
    loadChildren: () => import('../new-blog-list/new-blog-list.module').then(m => m.NewBlogListModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
