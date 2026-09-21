import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  center: google.maps.LatLngLiteral = { lat: 17.4176173, lng: 102.8000109 };
  zoom = 15;
  markers = [
    { lat: 17.4176173, lng: 102.8000109 },

  ];
}
