/**
 * Mode démonstration.
 *
 * Activé par défaut tant que le service back-end n'existe pas. Dans cet état,
 * les signalements sont produits et conservés en mémoire dans le navigateur :
 * ils ne sont transmis à personne et disparaissent au rechargement.
 *
 * L'avertissement qui en découle n'est pas une formalité juridique. Un habitant
 * qui tombe sur cette adresse et y dépose un signalement pour un acte de
 * banditisme croirait avoir alerté les autorités. L'interface doit rendre cette
 * situation impossible à confondre avec un guichet réel.
 *
 * Pour désactiver le mode, définir `VITE_DEMO_MODE=false` à la construction —
 * ce qui ne doit être fait qu'une fois le service en place.
 */
export const IS_DEMO: boolean = import.meta.env['VITE_DEMO_MODE'] !== 'false';

/**
 * Contacts d'urgence réels de la collectivité.
 *
 * VOLONTAIREMENT VIDE. Publier un numéro d'urgence erroné serait plus
 * dangereux que n'en publier aucun : quelqu'un pourrait le composer en
 * situation critique. Ces valeurs doivent être renseignées par la collectivité
 * cliente, à partir de ses propres sources, avant toute mise en ligne.
 *
 * Tant que la liste est vide, l'interface renvoie vers « les numéros d'urgence
 * de votre localité » sans en citer aucun.
 */
export interface EmergencyContact {
  readonly label: string;
  readonly number: string;
}

export const EMERGENCY_CONTACTS: readonly EmergencyContact[] = [];
