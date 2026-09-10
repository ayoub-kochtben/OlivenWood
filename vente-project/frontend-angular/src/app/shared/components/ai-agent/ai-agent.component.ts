import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ai-agent',
  templateUrl: './ai-agent.component.html',
  styleUrls: ['./ai-agent.component.scss']
})
export class AiAgentComponent {
  ouvert = false;
  messages: { texte: string; deMoi: boolean }[] = [
    { texte: 'Bonjour 👋 Je suis votre assistant. Comment puis-je vous aider ?', deMoi: false }
  ];
  saisie = '';
  enCours = false;

  constructor(private http: HttpClient) {}

  toggle(): void { this.ouvert = !this.ouvert; }

  envoyer(): void {
    if (!this.saisie.trim() || this.enCours) return;

    const question = this.saisie;
    this.messages.push({ texte: question, deMoi: true });
    this.saisie = '';
    this.enCours = true;

    this.http.post<{ answer: string }>(`${environment.apiUrl}/agent-ia`, { question }).subscribe({
      next: (res) => {
        this.messages.push({ texte: res.answer, deMoi: false });
        this.enCours = false;
      },
      error: () => {
        this.messages.push({ texte: "Désolé, une erreur est survenue. Réessayez.", deMoi: false });
        this.enCours = false;
      }
    });
  }
}