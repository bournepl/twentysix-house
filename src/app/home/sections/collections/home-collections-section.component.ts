import { Component, OnInit } from '@angular/core';
import { HouseDesign } from '../../../_model/house-design';
import { HouseDesignsService } from '../../../_service/house-designs.service';

@Component({
  selector: 'app-home-collections-section',
  templateUrl: './home-collections-section.component.html',
  styleUrl: './home-collections-section.component.scss',
})
export class HomeCollectionsSectionComponent {
  collections: HouseDesign[] = [];

  constructor(private readonly houseDesignsService: HouseDesignsService) {}

  ngOnInit(): void {
    this.houseDesignsService.getDesigns().subscribe((designs) => {
      this.collections = designs.slice(0, 3);
    });
  }

  trackByDesign(_: number, design: HouseDesign): string {
    return design.slug;
  }
}
