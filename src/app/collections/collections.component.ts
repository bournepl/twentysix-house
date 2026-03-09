import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { JsonLdService } from '../_service/json-ld.service';


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit, OnDestroy {

  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private title: Title,
    private meta: Meta,
    private jsonLdService: JsonLdService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {

    /* ========= META ========= */
    this.title.setTitle(
      'ผลงานรับสร้างบ้าน | ตัวอย่างบ้านจริงและงานออกแบบ | Twentysix.House'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'รวมผลงานรับสร้างบ้านจริง และตัวอย่างงานออกแบบบ้าน โดยบริษัท Twentysix.House บริษัทรับสร้างบ้านในจังหวัดอุดรธานี พร้อมผลงานคุณภาพ'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'ผลงานรับสร้างบ้าน, ตัวอย่างบ้านจริง, ออกแบบบ้าน, รับสร้างบ้านอุดรธานี'
    });

    if (this.isBrowser) {
      this.insertItemListSchema();
      this.insertProjectSchema();
    }
  }

  ngOnDestroy(): void {
    this.jsonLdService.removeSchema('collections-itemlist');
    this.jsonLdService.removeSchema('collections-projects');
  }

  /* ===============================
     SCHEMA: ItemList (หน้า Collections)
  =============================== */
  private insertItemListSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "ผลงานรับสร้างบ้านและงานออกแบบ - Twentysix.House",
      "itemListOrder": "http://schema.org/ItemListOrderAscending",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ผลงานรับสร้างบ้านจริง",
          "url": "https://twentysix.house/collections#real-projects"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "ผลงานออกแบบบ้าน",
          "url": "https://twentysix.house/collections#design-collections"
        }
      ]
    };

    this.jsonLdService.insertSchema('collections-itemlist', schema);
  }

  /* ===============================
     SCHEMA: Project / CreativeWork
  =============================== */
  private insertProjectSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Project",
          "name": "บ้านพักอาศัยชั้นเดียว",
          "description": "ผลงานรับสร้างบ้านจริง โดยบริษัท Twentysix.House ในจังหวัดอุดรธานี",
          "creator": {
            "@type": "Organization",
            "name": "Twentysix.House"
          },
          "location": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "อุดรธานี",
              "addressCountry": "TH"
            }
          }
        },
        {
          "@type": "Project",
          "name": "บ้านพักอาศัยสองชั้น",
          "description": "ผลงานออกแบบและก่อสร้างบ้านจริง โดย Twentysix.House",
          "creator": {
            "@type": "Organization",
            "name": "Twentysix.House"
          }
        },
        {
          "@type": "CreativeWork",
          "name": "Yu Plearn – Design Collection",
          "description": "ตัวอย่างแนวคิดการออกแบบบ้าน โดยทีมสถาปนิก Twentysix.House",
          "creator": {
            "@type": "Organization",
            "name": "Twentysix.House"
          }
        },
        {
          "@type": "CreativeWork",
          "name": "Yu Yen – Design Collection",
          "description": "งานออกแบบบ้านเพื่อการอยู่อาศัยจริง",
          "creator": {
            "@type": "Organization",
            "name": "Twentysix.House"
          }
        }
      ]
    };

    this.jsonLdService.insertSchema('collections-projects', schema);
  }

}
