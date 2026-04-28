import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import realProjectsData from '../../assets/data/real-projects.json';
import { RealProject } from '../_model/real-project';

@Injectable({
  providedIn: 'root',
})
export class RealProjectsService {
  private readonly projects = realProjectsData as RealProject[];

  getProjects(): Observable<RealProject[]> {
    return of(this.projects);
  }

  getProjectBySlug(slug: string): Observable<RealProject | undefined> {
    return of(this.projects.find((project) => project.slug === slug));
  }

  getRelatedProjects(project: RealProject, limit = 3): Observable<RealProject[]> {
    return of(
      this.projects
        .filter((item) => item.slug !== project.slug && item.categories.some((category) => project.categories.includes(category)))
        .slice(0, limit)
    );
  }
}
