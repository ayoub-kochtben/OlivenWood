import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PRODUITS } from '../../../core/data/site-data';

interface BotMessage {
  texte: string;
  deMoi: boolean;
}

@Component({
  selector: 'app-ai-agent',
  templateUrl: './ai-agent.component.html',
  styleUrls: ['./ai-agent.component.scss']
})
export class AiAgentComponent {
  ouvert = false;
  messages: BotMessage[] = [];
  saisie = '';

  private numTel = '+216 50 124 331';

  constructor(private translate: TranslateService) {
    this.ajouterGreeting();
    this.translate.onLangChange.subscribe(() => {
      this.messages = [];
      this.ajouterGreeting();
    });
  }

  private ajouterGreeting(): void {
    this.messages.push({
      texte: this.translate.instant('AI_AGENT.GREETING'),
      deMoi: false
    });
  }

  toggle(): void {
    this.ouvert = !this.ouvert;
  }

  envoyer(): void {
    const question = this.saisie.trim();
    if (!question) return;

    this.messages.push({ texte: question, deMoi: true });
    this.saisie = '';
    this.messages.push({ texte: this.repondre(question.toLowerCase()), deMoi: false });
  }

  private repondre(q: string): string {
    if (this.contient(q, ['bonjour', 'salut', 'hello', 'hi ', 'hey', 'coucou'])) {
      return "Bonjour ! 👋 Posez-moi une question sur nos produits, nos catégories, la livraison ou le contact.";
    }

    if (this.contient(q, ['merci', 'thanks'])) {
      return "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊";
    }

    if (this.contient(q, ['catégor', 'categor', 'rubrique', 'collection'])) {
      const noms = PRODUITS.length
        ? ['Planches & Découpe', 'Bols & Boîtes', 'Couverts & Ustensiles', 'Décor & Jeux']
        : [];
      return `Nous avons 4 catégories : ${noms.join(', ')}. Vous pouvez les voir dans le menu « Catégories ».`;
    }

    if (this.contient(q, ['livraison', 'livrer', 'livre', 'expédi', 'envoi', 'deliver', 'shipping'])) {
      return "Nous livrons dans toute la Tunisie (plus de 20 villes). Pour commander, utilisez le bouton « Commander via WhatsApp » sur la fiche produit.";
    }

    if (this.contient(q, ['adresse', 'où', 'ou etes', 'localisation', 'location', 'boutique', 'magasin', 'trouve'])) {
      return `Notre boutique se trouve à : Ceinture de Mahdia, Ksour Essef, Mahdia, Tunisie. Vous trouverez la carte sur la page « Localisation ».`;
    }

    if (this.contient(q, ['horaire', 'heure', 'ouvert', 'ouvre'])) {
      return "Nous sommes à votre disposition du lundi au samedi, de 9h à 18h.";
    }

    if (this.contient(q, ['téléphone', 'telephone', 'appel', 'phone', 'numéro', 'numero', 'contacter', 'contact', 'mail', 'email', 'instagram'])) {
      return `Vous pouvez nous joindre au ${this.numTel}, par email à ayoubkochtbene@gmail.com, ou sur Instagram (@kouchtbenayoub).`;
    }

    if (this.contient(q, ['prix', 'combien', 'tarif', 'coûte', 'coute', 'price', 'cher'])) {
      const moinsCher = PRODUITS.reduce((a, b) => (a.prix < b.prix ? a : b));
      return `Nos prix varient de 7,90 € (petite cuillère) à 89,90 € (jeu d'échecs). Indiquez-moi le produit qui vous intéresse pour plus de détails !`;
    }

    if (this.contient(q, ['échec', 'echec', 'chess', 'jeu'])) {
      return "Notre jeu d'échecs en bois d'olivier (89,90 €) est sculpté à la main : pièces tournées et plateau veiné. Une pièce unique !";
    }

    if (this.contient(q, ['planche', 'découper', 'decouper', 'pizza', 'saucisson', 'plateau', 'board'])) {
      return "Nos planches (22,90 € à 34,90 €) sont en olivier massif : à découper, à pizza, à saucisson, à bouteille et la Camargue 22. Elles se trouvent dans la catégorie « Planches & Découpe ».";
    }

    if (this.contient(q, ['bol', 'saladier', 'boîte', 'boite', 'sel', 'corbeille', 'bowl'])) {
      return "Dans « Bols & Boîtes » : bols en olivier (10, 12 ou 14 cm), boîte à sel (19,90 €) et corbeille (49,90 €).";
    }

    if (this.contient(q, ['cuillère', 'cuillere', 'fourchette', 'spatule', 'ustensile', 'cuisine', 'couvert'])) {
      return "Nos couverts en olivier (7,90 € à 12,90 €) : cuillères, fourchettes, spatules à pâte et à pizza. Catégorie « Couverts & Ustensiles ».";
    }

    if (this.contient(q, ['bois', 'olivier', 'olive', 'qualité', 'qualite', 'matériau', 'materiau', 'entretien'])) {
      return "Toutes nos pièces sont sculptées à la main dans du bois d'olivier massif issu d'oliviers en fin de vie, huilé pour un usage alimentaire.";
    }

    if (this.contient(q, ['command', 'acheter', 'achète', 'order', 'buy', 'whatsapp'])) {
      return "Pour commander, ouvrez la fiche produit et cliquez sur « Commander via WhatsApp » — le message est pré-rempli avec le produit et son prix.";
    }

    return "Je ne suis pas sûr de comprendre. 🤔 Vous pouvez me demander : nos produits, les prix, la livraison, l'adresse ou comment commander.";
  }

  private contient(q: string, mots: string[]): boolean {
    return mots.some(m => q.includes(m));
  }
}
