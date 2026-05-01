import { Component, OnInit } from '@angular/core';
import { RealProject } from '../../../_model/real-project';
import { RealProjectsService } from '../../../_service/real-projects.service';

interface ProjectGalleryImage {
  src: string;
  alt: string;
}

interface ProjectSummaryItem {
  icon: string;
  value: string;
}

interface ProjectShowcaseView {
  title: string;
  description: string;
  category: string;
  location: string;
  year: string;
  image: ProjectGalleryImage;
  summary: ProjectSummaryItem[];
  slug: string;
}

@Component({
  selector: 'app-home-projects-section',
  templateUrl: './home-projects-section.component.html',
  styleUrl: './home-projects-section.component.scss',
})
export class HomeProjectsSectionComponent implements OnInit {
  readonly previewProjectPositions = [3, 7, 8, 9];
  projects: ProjectShowcaseView[] = [];

  constructor(private realProjectsService: RealProjectsService) {}

  ngOnInit(): void {
    this.realProjectsService.getProjects().subscribe((projects) => {
      this.projects = this.previewProjectPositions
        .map((position) => projects[position - 1])
        .filter((project): project is RealProject => Boolean(project))
        .map((project) => this.toProjectShowcase(project));
    });
  }

  trackByProject(_: number, project: ProjectShowcaseView): string {
    return project.slug;
  }

  trackBySummary(_: number, item: ProjectSummaryItem): string {
    return `${item.icon}-${item.value}`;
  }

  private toProjectShowcase(project: RealProject): ProjectShowcaseView {
    return {
      title: project.title,
      description: project.excerpt,
      category: project.category,
      location: project.location,
      year: project.year,
      image: {
        src: project.coverImage,
        alt: project.coverAlt,
      },
      summary: [
        {
          icon: 'fas fa-ruler-combined',
          value: project.usableArea || '-',
        },
        {
          icon: 'fas fa-bed',
          value: this.formatCount(project.bedrooms, 'ห้องนอน'),
        },
        {
          icon: 'fas fa-bath',
          value: this.formatCount(project.bathrooms, 'ห้องน้ำ'),
        },
        {
          icon: 'fas fa-car',
          value: this.formatCount(project.parking, 'ที่จอด'),
        },
      ],
      slug: project.slug,
    };
  }

  private formatCount(value: number | undefined, label: string): string {
    return value ? `${value} ${label}` : '-';
  }
}
