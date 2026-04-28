import { Component, OnInit } from '@angular/core';
import { RealProject } from '../../../_model/real-project';
import { RealProjectsService } from '../../../_service/real-projects.service';

interface ProjectGalleryImage {
  src: string;
  alt: string;
}

interface ProjectShowcaseView {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  align: 'left' | 'right';
  images: ProjectGalleryImage[];
  thumbnailImages: ProjectGalleryImage[];
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
        .map((position) => ({ position, project: projects[position - 1] }))
        .filter((item): item is { position: number; project: RealProject } => Boolean(item.project))
        .map((item, index) => this.toProjectShowcase(item.project, item.position, index));
    });
  }

  trackByProject(_: number, project: ProjectShowcaseView): string {
    return project.slug;
  }

  trackByImage(_: number, image: ProjectGalleryImage): string {
    return image.src;
  }

  trackByHighlight(_: number, highlight: string): string {
    return highlight;
  }

  private toProjectShowcase(project: RealProject, position: number, index: number): ProjectShowcaseView {
    const gallery = [
      project.coverImage,
      ...project.gallery.filter((image) => image !== project.coverImage),
    ].slice(0, 4);

    const images = gallery.map((image, imageIndex) => ({
      src: image,
      alt: imageIndex === 0 ? project.coverAlt : `${project.title} ภาพตัวอย่างที่ ${imageIndex + 1}`,
    }));

    return {
      label: `Project ${String(position).padStart(2, '0')}`,
      eyebrow: `${project.category} | ${project.location}`,
      title: project.title,
      description: project.excerpt,
      highlights: project.highlights.slice(0, 3),
      align: index % 2 === 0 ? 'left' : 'right',
      images,
      thumbnailImages: images.slice(1, 4),
      slug: project.slug,
    };
  }
}
