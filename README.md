# ⚽ FootAnalyse

Site d'analyse des matchs de **Ligue 1** avec un **chatbot** d'analyse — projet de groupe.

## Fonctionnalités

- **Tableau de bord** : chiffres clés de la saison, meilleures attaques et défenses, prochaine journée.
- **Prochains matchs** : calendrier avec probabilités, analyse d'avant-match pour chaque match.
- **Compositions probables** : terrain avec les 11 joueurs, absents et sources ; actualisables par l'IA (recherche web).
- **Classement** de Ligue 1.
- **Pronostic libre** : n'importe quelle affiche, modèle de Poisson (probabilités, buts attendus, scores probables).
- **Chatbot** :
  - sans clé : moteur d'analyse local (pronostics, compos, absents, nombre de buts, stats des joueurs, comparaisons…) ;
  - avec la clé Anthropic : Claude répond à toutes les questions de football, avec recherche web et toute l'analyse du site.

## Lancer le site

Il faut **Python 3.9 ou plus**.

```bash
# 1. Installer la bibliothèque du chatbot IA (facultatif : le reste marche sans)
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# 2. Créer son fichier de clés (facultatif)
cp .env.example .env
# puis ouvrir .env et coller ses clés

# 3. Lancer le serveur
.venv/bin/python server.py      # ou : python3 server.py
```

Ouvrir ensuite http://localhost:8765

### Clés API (facultatives)

| Clé | Sert à | Où l'obtenir |
|---|---|---|
| `FOOTBALL_DATA_KEY` | Classement, calendrier et buteurs en direct | https://www.football-data.org/client/register (gratuit) |
| `ANTHROPIC_API_KEY` | Chatbot IA et compositions actualisées | https://platform.claude.com/settings/keys (payant à l'usage) |

Sans clé, le site utilise les **données enregistrées** (après la 10e journée de la saison 2026-2027).

⚠️ **Ne jamais mettre de clé dans le code ni sur GitHub.** Le fichier `.env` est exclu par le `.gitignore`.

## Organisation du code

| Partie | Fichiers |
|---|---|
| Structure et design | `index.html`, `css/style.css` |
| Affichage des pages | `js/app.js` |
| Calculs et pronostics (modèle de Poisson) | `js/analysis.js` |
| Données enregistrées | `js/data.js` (classement, calendrier), `js/players-data.js` (stats joueurs), `js/lineups-data.js` (compos) |
| Chatbot – interface | `js/chatbot.js` |
| Chatbot – analyse locale | `js/chat-local.js` (matchs), `js/chat-players.js` (joueurs) |
| Serveur | `server.py` (site + routes `/api/ligue1`, `/api/chat`, `/api/lineup`) |
| IA (Claude) | `chatbot_ai.py` (chatbot), `lineups_ai.py` (compositions) |

## Travailler à deux

1. Récupérer les dernières modifications avant de commencer (**Pull**).
2. Travailler de préférence sur des fichiers différents (ex. l'un sur le chatbot, l'autre sur le design).
3. Pour une grosse fonctionnalité, créer une **branche**, puis la fusionner.
4. Envoyer ses modifications avec un message clair (**Commit** puis **Push**).

## Mettre à jour les données sans clé

- Classement et prochains matchs : `js/data.js` (`STANDINGS`, `UPCOMING`).
- Stats des joueurs : `js/players-data.js`.
- Compositions : `js/lineups-data.js` (une ligne par poste, joueurs séparés par `|`).

## Sources des données enregistrées

- Classement : [Wikipédia – 2026-27 Ligue 1](https://en.wikipedia.org/wiki/2026%E2%80%9327_Ligue_1)
- Calendrier : foot-actu.com, footmercato.net
- Compositions : [ligue1.com – compositions probables J10](https://ligue1.com/fr/articles/l1_article_5704-les-compositions-probables-ligue-1-2026-2027)
- Stats joueurs : [Foot Mercato – buteurs](https://www.footmercato.net/france/ligue-1/buteur) et [joueurs décisifs](https://www.footmercato.net/france/ligue-1/decisif)
