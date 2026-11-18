import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  latitude = 35.44533566310324;
  longitude = 11.01669485091932;
  mapUrl: SafeResourceUrl;
  chargementPosition = false;
  erreurPosition = '';

  constructor(private sanitizer: DomSanitizer, private translate: TranslateService) {
    const url = `https://www.google.com/maps?q=${this.latitude},${this.longitude}&z=17&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  obtenirItineraire(): void {
    this.erreurPosition = '';

    if (!navigator.geolocation) {
      this.ouvrirDestinationSeule();
      return;
    }

    this.chargementPosition = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.chargementPosition = false;
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${this.latitude},${this.longitude}&travelmode=driving`;
        window.open(url, '_blank');
      },
      () => {
        this.chargementPosition = false;
        this.erreurPosition = this.translate.instant('LOCATION.GEO_ERROR');
        this.ouvrirDestinationSeule();
      }
    );
  }

  private ouvrirDestinationSeule(): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.latitude},${this.longitude}`;
    window.open(url, '_blank');
  }
}