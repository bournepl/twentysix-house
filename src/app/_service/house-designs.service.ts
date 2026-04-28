import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import houseDesignsData from '../../assets/data/house-designs.json';
import { HouseDesign } from '../_model/house-design';

@Injectable({
  providedIn: 'root',
})
export class HouseDesignsService {
  private readonly designs = houseDesignsData as HouseDesign[];

  getDesigns(): Observable<HouseDesign[]> {
    return of(this.designs);
  }

  getDesignBySlug(slug: string): Observable<HouseDesign | undefined> {
    return of(this.designs.find((design) => design.slug === slug));
  }

  getRelatedDesigns(design: HouseDesign, limit = 3): Observable<HouseDesign[]> {
    return of(
      this.designs
        .filter((item) => item.slug !== design.slug && item.categories.some((category) => design.categories.includes(category)))
        .slice(0, limit)
    );
  }
}
