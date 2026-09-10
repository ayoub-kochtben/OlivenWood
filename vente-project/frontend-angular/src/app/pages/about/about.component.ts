import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  faits = [
    'Nous livrons dans plus de 20 villes.',
    'Plus de 10 000 clients satisfaits nous font confiance.',
    'Nos produits sont sélectionnés avec soin auprès de fournisseurs certifiés.',
    'Notre service client répond en moins de 24h.'
  ];

  // ----- Localisation -----
  latitude = 35.44533566310324;
  longitude = 11.01669485091932;
  mapUrl: SafeResourceUrl;
  chargementPosition = false;
  erreurPosition = '';

  // ----- Formulaire de contact -----
  contactNom = '';
  contactEmail = '';
  contactMessage = '';
  envoiEnCours = false;
  envoiReussi = false;
  envoiErreur = '';

  private readonly emailDestinataire = 'ayoubkochtbene@gmail.com';

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
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
        this.erreurPosition = "Position indisponible : autorisez la géolocalisation, ou choisissez votre point de départ dans Google Maps.";
        this.ouvrirDestinationSeule();
      }
    );
  }

  private ouvrirDestinationSeule(): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${this.latitude},${this.longitude}`;
    window.open(url, '_blank');
  }

  envoyerMessage(): void {
    if (!this.contactNom.trim() || !this.contactEmail.trim() || !this.contactMessage.trim()) {
      this.envoiErreur = 'Merci de remplir tous les champs.';
      return;
    }

    this.envoiEnCours = true;
    this.envoiErreur = '';
    this.envoiReussi = false;

    const payload = {
      name: this.contactNom,
      email: this.contactEmail,
      message: this.contactMessage,
      _subject: `Nouveau message de ${this.contactNom} — Oliven Wood`
    };

    this.http.post(`https://formsubmit.co/ajax/${this.emailDestinataire}`, payload).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.envoiReussi = true;
        this.contactNom = '';
        this.contactEmail = '';
        this.contactMessage = '';
      },
      error: () => {
        this.envoiEnCours = false;
        this.envoiErreur = "Une erreur est survenue, réessayez plus tard.";
      }
    });
  }
}