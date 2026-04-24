# Politique de sécurité

## Versions supportées

Seule la dernière version publiée est supportée.

| Version | Supportée          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Signaler une vulnérabilité

Klasio est une application **100 % côté client** sans backend et sans traitement de données personnelles côté serveur. Les vulnérabilités potentielles concernent donc principalement :

- **XSS** via les champs de saisie (nom d'école, de niveau, d'enseignant·e, commentaire…).
- **Injection** via les paramètres URL de partage (`?s=…`).
- **Exfiltration** via le chargement de ressources tierces (CDN jsPDF, Google Fonts).

### Comment signaler

Merci de **ne pas ouvrir d'issue publique** pour une vulnérabilité.

1. Ouvrez un [advisory privé](../../security/advisories/new) sur ce repository, ou
2. Envoyez un email au mainteneur (adresse dans le profil GitHub).

Nous nous engageons à :

- accuser réception sous **72 heures** ;
- publier un correctif dans les **14 jours** pour les failles critiques ;
- créditer le rapporteur dans le CHANGELOG (sauf demande contraire).

## Bonnes pratiques pour les utilisateurs

- Ne partagez un lien `?s=…` qu'avec des personnes de confiance : il contient toute votre répartition (mais **aucune donnée nominative** tant que la phase 2 n'est pas livrée).
- Ne collez jamais un lien `?s=…` reçu d'une source inconnue sans vérifier son domaine.
