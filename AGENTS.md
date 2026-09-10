<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:context-of-the-project -->

donne moi le schema prisma pour cette app 
📱 Projet – Application de suivi de bébé

Salut !

J’ai essayé de remettre toutes les idées dans l’ordre pour que ce soit plus clair.

🎯 Objectif

Créer une application (web ou mobile) permettant de suivre très simplement le quotidien d’un nourrisson, afin de remplacer les notes papier ou les notes du téléphone.

Le concept principal serait vraiment “1 clic = 1 action”. L’idée est qu’en moins de deux secondes on puisse enregistrer un événement, sans avoir à naviguer dans plusieurs menus.

⸻

🍼 Repas

Pouvoir enregistrer un repas avec :

* 🍼 Biberon
* 🤱 Tétée

Si c’est un biberon :

* propositions rapides : 30 / 60 / 90 / 120 / 150 ml
* possibilité de saisir une quantité personnalisée
* heure automatiquement sur “maintenant”, mais modifiable si besoin.

⸻

😴 Sommeil

* 😴 Début du sommeil
* 👀 Réveil
* Calcul automatique de la durée du sommeil.

⸻

👶 Couche

En cliquant sur l’icône couche :

* 💧 Pipi
* 💩 Caca
* 💧💩 Les deux

⸻

📊 Dashboard (écran principal)

Le plus important de l’application selon moi.

En haut, un tableau de bord qui permet de voir immédiatement où on en est dans la journée.

🍽️ Repas

Exemple :

🍽️ Dernier repas : il y a 3 h (11h45)
🍼 Quantité : 90 ml
📈 Total depuis minuit : 390 ml
🍼 Nombre de biberons : 3
🤱 Nombre de tétées : 1

⸻

👶 Couche

👶 Dernière couche : il y a 2 h
💧 Pipis aujourd’hui : 6
💩 Selles aujourd’hui : 4

⸻

😴 Sommeil

😴 Dernier sommeil : il y a 1 h 20
⏱️ Temps total de sommeil aujourd’hui : 8 h 15

⸻

📝 Historique

Un historique chronologique de la journée avec tous les événements.

Exemple :

* 07h12 🍼 90 ml
* 08h05 💧
* 08h45 😴
* 10h15 👀
* 10h20 💩
* etc.

Avec possibilité de modifier ou supprimer une entrée.

⸻

📤 Export

Pouvoir exporter les données (CSV ou PDF).

Par journée par exemple, afin d’avoir un vrai suivi :

* repas
* quantités
* sommeil
* couches
* statistiques

Ça pourrait être très pratique pour un rendez-vous chez le pédiatre ou simplement pour conserver un historique.

⸻

📈 Statistiques

Je me demande si on ne pourrait pas aller encore plus loin avec une page “Statistiques”.

Par exemple :

* 📈 courbe des ml bus par jour
* 😴 courbe du temps de sommeil
* 💩 évolution du nombre de selles
* 💧 évolution du nombre de couches
* 📅 comparatif jour / semaine / mois

Je pense que ça pourrait être super intéressant visuellement pour suivre l’évolution du bébé.

⸻

👨‍👩‍👦 Synchronisation

Je pense qu’il faudrait aussi prévoir dès le départ :

* deux utilisateurs (maman / papa)
* synchronisation en temps réel
* si l’un ajoute un biberon, l’autre le voit immédiatement.

⸻

🔔 Évolutions possibles

Si c’est simple à mettre en place plus tard :

* notifications discrètes lorsqu’un repas ou une couche commence à dater
* gestion de plusieurs enfants
* personnalisation des propositions de biberons

⸻

💡 Pourquoi ce projet ?

Ce qui m’a donné l’idée, c’est qu’à la maternité, tous les parents se posaient exactement la même question :

“Comment vous notez le suivi du bébé ?”

Et la réponse était quasiment toujours :

“Sur une feuille…” 😅

Aujourd’hui, nous utilisons les notes du téléphone, mais c’est franchement pénible. On oublie des événements, on ne sait plus où on en est dans la journée, les horaires se mélangent…

Je pense qu’il y a vraiment quelque chose à faire avec une application extrêmement simple, ultra rapide, où 1 clic = 1 action, qui permettrait de tout centraliser et d’avoir immédiatement une vision claire de la journée.

Je trouve même étonnant qu’il n’existe pas une application qui fasse exactement ça de manière aussi simple.

<!-- END:context-of-the-project -->
