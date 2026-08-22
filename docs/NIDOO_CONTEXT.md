# Nidoo

## But du projet
Application mobile-first de suivi de la vie de bébé :
- repas
- sommeil
- couches
- statistiques
- historique
- gestion familiale

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Auth.js
- Zod
- bcryptjs

## Authentification
- Auth.js avec Credentials
- inscription via Server Action
- validation Zod
- mot de passe :
  - HMAC-SHA256 avec PEPPER
  - puis bcrypt
- auto-login après inscription

## Architecture
- `src/app/...`
- `src/components/auth/...`
- `src/lib/zod.ts`
- `src/lib/password.ts`
- `src/lib/prisma.ts`
- `src/auth.ts`

## Modèle de données

La base de données est gérée avec Prisma.
Le schéma complet se trouve dans `prisma/schema.prisma`.

Entités principales :
- User : compte utilisateur
- Family : groupe familial
- FamilyMember : liaison utilisateur/famille et rôles
- FamilyInvitation : invitations
- Baby : informations du bébé
- Feeding : repas (biberon/tétée)
- SleepSession : sessions de sommeil
- DiaperChange : changements de couche

Pour toute modification du modèle de données, consulter
`prisma/schema.prisma` comme source de vérité.

## Règles de développement
- avancer étape par étape
- expliquer avant de modifier
- utiliser Zod pour la validation
- utiliser Server Actions plutôt que des routes API quand pertinent
- ne jamais stocker de mot de passe en clair
- email normalisé en minuscules
- erreurs de formulaire via `useActionState`

## Figma
Lien :
https://www.figma.com/design/K3ksIxE1CvYrHEJ92xz7w8/Nidoo

Écrans :
- Connexion
- Inscription
- Mot de passe oublié
- Création bébé
- Invitation parent
- Onboarding terminé
- Dashboard
- Repas
- Sommeil
- Couches
- Historique
- Statistiques
- Réglages

## État actuel
- login fonctionnel
- signup fonctionnel
- validation Zod fonctionnelle
- gestion des erreurs fonctionnelle
- HMAC + bcrypt en place
- auto-login après signup en place
- dashboard encore vide

## Décisions importantes
- `firstName` et `lastName` optionnels
- `null` en BDD s’ils ne sont pas renseignés
- email stocké en minuscules
- pas encore de validation d’email