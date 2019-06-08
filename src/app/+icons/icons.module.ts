import {NgModule} from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    MatIconModule
  ],
  exports: [ MatIconModule ]
})
export class IconsModule {
  /**
   * icons module
   * @param matIconRegistry mat icon registry
   * @param domSanitizer dom sanitizer
   */
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.registerIcons();
  }

  /**
   * register icons
   */
  private registerIcons() {
    this.matIconRegistry.addSvgIcon(
      'npm',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/npm.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/github.svg')
    );
  }
}
