import { Component, OnInit } from '@angular/core';
import { JsonLdService } from '../../_service/json-ld.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  constructor(
    private jsonLdService: JsonLdService,
  ) { }

  ngOnInit() {
    this.jsonLdService.insertSchema('footer-org', {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Twentysix House",
      "url": "https://twentysix.house",
      "logo": "https://twentysix.house/assets/img/head.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "127/2 ถ.โพนพิสัย",
        "addressLocality": "อำเภอเมือง",
        "addressRegion": "อุดรธานี",
        "postalCode": "41000",
        "addressCountry": "TH"
      },
      "contactPoint": [{
        "@type": "ContactPoint",
        "telephone": "+66994708877",
        "contactType": "customer service",
        "areaServed": "TH",
        "availableLanguage": ["Thai"]
      }],
      "sameAs": [
        "https://www.facebook.com/share/19APWzVgu7/?mibextid=wwXIfr",
        "https://www.instagram.com/26twentysix.house?igsh=YXFmMWt3bGhlaHpm",
        "https://lin.ee/jzuOAtF",
        "https://www.tiktok.com/@twentysix.house?_t=ZS-8vm31ijyhPc&_r=1"
      ]
    });
  }
}
