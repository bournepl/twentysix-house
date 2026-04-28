import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-collaborators-section',
  templateUrl: './home-collaborators-section.component.html',
  styleUrl: './home-collaborators-section.component.scss',
})
export class HomeCollaboratorsSectionComponent {
  @Input() isBrowser = false;
}
