import { Injectable, Inject, Renderer2, RendererFactory2, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  insertSchema(id: string, schemaObject: object): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const scriptId = `json-ld-${id}`;
    const existing = this.document.getElementById(scriptId);
    if (existing) {
      this.renderer.removeChild(this.document.head, existing);
    }

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    this.renderer.setProperty(script, 'textContent', JSON.stringify(schemaObject));
    this.renderer.appendChild(this.document.head, script);
  }

  removeSchema(id: string): void {
    const scriptId = `json-ld-${id}`;
    const existing = this.document.getElementById(scriptId);
    if (existing) {
      this.renderer.removeChild(this.document.head, existing);
    }
  }
}
