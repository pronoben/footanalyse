"""
Collecte des carrières des joueurs (source : Wikipédia en anglais)
------------------------------------------------------------------
Pour chaque club des 5 grands championnats (saison indiquée dans SEASON),
le script lit l'effectif sur la page Wikipédia du club, puis l'infobox
de chaque joueur : clubs (années, matchs, buts), sélections, date de
naissance, poste, taille. Il ajoute aussi une liste de légendes.

Résultat : js/careers.json, chargé par le chatbot (js/chat-careers.js).

Lancement (depuis le dossier du projet) :
    python3 tools/build_careers.py

Remarques :
- Les matchs et buts en club de l'infobox Wikipédia ne comptent que le
  CHAMPIONNAT (pas les coupes ni l'Europe).
- Utilise l'API publique de Wikipédia, avec des pauses entre les requêtes.
"""

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "js" / "careers.json"
API = "https://en.wikipedia.org/w/api.php"
UA = "FootAnalyseStudentProject/1.0 (school project; https://github.com/pronoben/footanalyse)"
SEASON = "2026–27"

LEAGUE_PAGES = {
    "L1": f"{SEASON} Ligue 1",
    "PL": f"{SEASON} Premier League",
    "LIGA": f"{SEASON} La Liga",
    "SA": f"{SEASON} Serie A",
    "BL": f"{SEASON} Bundesliga",
}

# Légendes et joueurs célèbres hors des 5 championnats (titres Wikipédia)
LEGENDS = [
    "Pelé", "Diego Maradona", "Johan Cruyff", "Franz Beckenbauer", "Zinedine Zidane", "Michel Platini",
    "Lionel Messi", "Cristiano Ronaldo", "Ronaldo (Brazilian footballer)", "Thierry Henry", "Alfredo Di Stéfano",
    "Ferenc Puskás", "Eusébio", "Lev Yashin", "Paolo Maldini", "Marco van Basten", "Ronaldinho", "Andrés Iniesta",
    "Xavi", "Raymond Kopa", "Just Fontaine", "Gerd Müller", "Karim Benzema", "Luka Modrić", "Neymar",
    "Antoine Griezmann", "Olivier Giroud", "Hugo Lloris", "Paul Pogba", "N'Golo Kanté", "Didier Drogba",
    "Zlatan Ibrahimović", "Wayne Rooney", "Steven Gerrard", "Frank Lampard", "Andrea Pirlo", "Francesco Totti",
    "Gianluigi Buffon", "Iker Casillas", "Sergio Ramos", "Manuel Neuer", "Thomas Müller", "Robert Lewandowski",
    "Luis Suárez", "Kevin De Bruyne", "Mohamed Salah", "Eden Hazard", "Franck Ribéry", "Arjen Robben", "Kaká",
    "Rivaldo", "Romário", "Roberto Baggio", "George Weah", "Samuel Eto'o", "Andriy Shevchenko", "Fabio Cannavaro",
    "David Beckham", "Alessandro Del Piero", "Patrick Vieira", "Claude Makélélé", "Lilian Thuram", "Marcel Desailly",
    "Fabien Barthez", "Laurent Blanc", "Didier Deschamps", "Eric Cantona", "Jean-Pierre Papin", "Robert Pires",
    "David Trezeguet", "Bixente Lizarazu", "Youri Djorkaeff", "Emmanuel Petit", "Raphaël Varane", "Toni Kroos",
    "Sergio Busquets", "Gerard Piqué", "Carles Puyol", "Philipp Lahm", "Miroslav Klose", "Bastian Schweinsteiger",
    "Michael Ballack", "Lothar Matthäus", "Karl-Heinz Rummenigge", "Ruud Gullit", "Frank Rijkaard", "Dennis Bergkamp",
    "Clarence Seedorf", "Edwin van der Sar", "Ruud van Nistelrooy", "Robin van Persie", "Wesley Sneijder",
    "Alan Shearer", "Ryan Giggs", "Paul Scholes", "Rio Ferdinand", "John Terry", "Michael Owen", "Bobby Charlton",
    "George Best", "Kevin Keegan", "Gary Lineker", "Roberto Carlos", "Cafu", "Ronaldo Nazário", "Zico", "Garrincha",
    "Sócrates", "Marcelo (footballer, born 1988)", "Dani Alves", "Thiago Silva", "Casemiro", "Gabriel Batistuta",
    "Javier Zanetti", "Ángel Di María", "Sergio Agüero", "Carlos Tevez", "Juan Román Riquelme", "Hernán Crespo",
    "Edinson Cavani", "Diego Forlán", "Radamel Falcao", "James Rodríguez", "Iván Zamorano", "Alexis Sánchez",
    "Hristo Stoichkov", "Pavel Nedvěd", "Petr Čech", "Gheorghe Hagi", "Davor Šuker", "Ivan Rakitić",
    "Christian Vieri", "Filippo Inzaghi", "Andrea Pirlo", "Daniele De Rossi", "Giorgio Chiellini", "Leonardo Bonucci",
    "Alessandro Nesta", "Franco Baresi", "Roberto Mancini", "Gianluca Vialli", "Paolo Rossi", "Dino Zoff",
    "Raúl (footballer)", "Fernando Torres", "David Villa", "Xabi Alonso", "Cesc Fàbregas", "David Silva",
    "Fernando Hierro", "Emilio Butragueño", "Luís Figo", "Rui Costa", "Deco", "Pepe (footballer, born 1983)",
    "Bernardo Silva", "Bruno Fernandes", "João Félix", "Jay-Jay Okocha", "Nwankwo Kanu", "Abédi Pelé",
    "Sadio Mané", "Riyad Mahrez", "Yaya Touré", "Michael Essien", "Rabah Madjer", "Hakim Ziyech", "Achraf Hakimi",
    "Son Heung-min", "Hidetoshi Nakata", "Park Ji-sung", "Tim Cahill", "Landon Donovan", "Clint Dempsey",
    "Christian Pulisic", "Hugo Sánchez", "Rafael Márquez", "Javier Hernández", "Carlos Valderrama",
    "Oliver Kahn", "Jens Lehmann", "Peter Schmeichel", "Michael Laudrup", "Brian Laudrup", "Henrik Larsson",
    "Fredrik Ljungberg", "Jari Litmanen", "Ole Gunnar Solskjær", "Erling Haaland", "Martin Ødegaard",
    "Jan Oblak", "Thibaut Courtois", "Romelu Lukaku", "Vincent Kompany", "Jean-Marie Pfaff", "Enzo Scifo",
    "Ousmane Dembélé", "Harry Kane", "Rodri (footballer, born 1996)", "Jude Bellingham", "Vinícius Júnior",
    "Lamine Yamal", "Pedri", "Florian Wirtz", "Jamal Musiala", "Bukayo Saka", "Phil Foden", "Declan Rice",
    "Virgil van Dijk", "Alisson Becker", "Ederson (footballer, born 1993)", "Gianluigi Donnarumma",
    "Marc-André ter Stegen", "Joshua Kimmich", "Antonio Rüdiger", "William Saliba", "Aurélien Tchouaméni",
    "Eduardo Camavinga", "Theo Hernandez", "Mike Maignan", "Marcus Thuram", "Randal Kolo Muani", "Michael Olise",
    "Désiré Doué", "Bradley Barcola", "Warren Zaïre-Emery", "João Neves", "Vitinha", "Khvicha Kvaratskhelia",
    "Victor Osimhen", "Lautaro Martínez", "Julián Álvarez", "Enzo Fernández", "Alexis Mac Allister",
]

POSITIONS = [
    (r"goalkeeper", "Gardien"),
    (r"wing[- ]back", "Piston"),
    (r"full[- ]back|left[- ]back|right[- ]back", "Latéral"),
    (r"centre[- ]back|center[- ]back|sweeper|defender", "Défenseur central"),
    (r"defensive midfield", "Milieu défensif"),
    (r"attacking midfield|playmaker", "Milieu offensif"),
    (r"midfield", "Milieu"),
    (r"winger|wide", "Ailier"),
    (r"striker|forward|centre[- ]forward", "Attaquant"),
]

COUNTRIES = {
    "France": "France", "Germany": "Allemagne", "West Germany": "RFA", "East Germany": "RDA", "Spain": "Espagne",
    "Italy": "Italie", "England": "Angleterre", "Scotland": "Écosse", "Wales": "Pays de Galles",
    "Northern Ireland": "Irlande du Nord", "Republic of Ireland": "Irlande", "Netherlands": "Pays-Bas",
    "Belgium": "Belgique", "Portugal": "Portugal", "Brazil": "Brésil", "Argentina": "Argentine", "Uruguay": "Uruguay",
    "Colombia": "Colombie", "Chile": "Chili", "Mexico": "Mexique", "United States": "États-Unis", "Canada": "Canada",
    "Morocco": "Maroc", "Algeria": "Algérie", "Tunisia": "Tunisie", "Senegal": "Sénégal", "Ivory Coast": "Côte d'Ivoire",
    "Cameroon": "Cameroun", "Nigeria": "Nigeria", "Ghana": "Ghana", "Mali": "Mali", "Guinea": "Guinée",
    "Egypt": "Égypte", "DR Congo": "RD Congo", "Gabon": "Gabon", "Burkina Faso": "Burkina Faso", "Togo": "Togo",
    "Benin": "Bénin", "Cape Verde": "Cap-Vert", "Gambia": "Gambie", "Angola": "Angola", "South Africa": "Afrique du Sud",
    "Liberia": "Liberia", "Croatia": "Croatie", "Serbia": "Serbie", "Slovenia": "Slovénie", "Bosnia and Herzegovina": "Bosnie-Herzégovine",
    "Switzerland": "Suisse", "Austria": "Autriche", "Poland": "Pologne", "Czech Republic": "République tchèque",
    "Czechoslovakia": "Tchécoslovaquie", "Slovakia": "Slovaquie", "Hungary": "Hongrie", "Romania": "Roumanie",
    "Bulgaria": "Bulgarie", "Greece": "Grèce", "Turkey": "Turquie", "Türkiye": "Turquie", "Ukraine": "Ukraine",
    "Russia": "Russie", "Soviet Union": "URSS", "Georgia": "Géorgie", "Armenia": "Arménie", "Albania": "Albanie",
    "Kosovo": "Kosovo", "North Macedonia": "Macédoine du Nord", "Montenegro": "Monténégro", "Denmark": "Danemark",
    "Norway": "Norvège", "Sweden": "Suède", "Finland": "Finlande", "Iceland": "Islande", "Japan": "Japon",
    "South Korea": "Corée du Sud", "Australia": "Australie", "Iran": "Iran", "Saudi Arabia": "Arabie saoudite",
    "Ecuador": "Équateur", "Paraguay": "Paraguay", "Peru": "Pérou", "Venezuela": "Venezuela", "Jamaica": "Jamaïque",
    "Haiti": "Haïti", "Costa Rica": "Costa Rica", "Panama": "Panama", "Honduras": "Honduras", "Comoros": "Comores",
    "Central African Republic": "Centrafrique", "Congo": "Congo", "Madagascar": "Madagascar", "Luxembourg": "Luxembourg",
    "Israel": "Israël", "Uzbekistan": "Ouzbékistan", "New Zealand": "Nouvelle-Zélande", "Zambia": "Zambie",
    "Zimbabwe": "Zimbabwe", "Mozambique": "Mozambique", "Equatorial Guinea": "Guinée équatoriale",
    "Guinea-Bissau": "Guinée-Bissau", "Mauritania": "Mauritanie", "Sierra Leone": "Sierra Leone", "Kenya": "Kenya",
    "Suriname": "Suriname", "Curaçao": "Curaçao", "Bolivia": "Bolivie", "Cyprus": "Chypre", "Malta": "Malte",
    "Lithuania": "Lituanie", "Latvia": "Lettonie", "Estonia": "Estonie", "Belarus": "Biélorussie", "Moldova": "Moldavie",
    "Faroe Islands": "Îles Féroé", "China": "Chine", "Qatar": "Qatar", "Iraq": "Irak", "Jordan": "Jordanie",
    "Syria": "Syrie", "Libya": "Libye", "Sudan": "Soudan", "Ethiopia": "Éthiopie", "Tanzania": "Tanzanie",
    "Uganda": "Ouganda", "Rwanda": "Rwanda", "Burundi": "Burundi", "Niger": "Niger", "Chad": "Tchad",
    "Martinique": "Martinique", "Guadeloupe": "Guadeloupe", "French Guiana": "Guyane", "Yugoslavia": "Yougoslavie",
}


def api(params, retries=3):
    params = {**params, "format": "json", "formatversion": "2"}
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # réseau, 429…
            print(f"  erreur API ({e}), nouvel essai…", file=sys.stderr)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError("API Wikipédia injoignable")


def page_wikitext(titles):
    """Wikitext complet de plusieurs pages (suit les redirections)."""
    out = {}
    for i in range(0, len(titles), 10):
        chunk = titles[i:i + 10]
        d = api({"action": "query", "prop": "revisions", "rvprop": "content", "rvslots": "main",
                 "titles": "|".join(chunk), "redirects": 1})
        redirects = {r["from"]: r["to"] for r in d["query"].get("redirects", [])}
        normalized = {n["from"]: n["to"] for n in d["query"].get("normalized", [])}
        texts = {p["title"]: p["revisions"][0]["slots"]["main"]["content"]
                 for p in d["query"]["pages"] if "revisions" in p}
        for t in chunk:
            final = redirects.get(normalized.get(t, t), normalized.get(t, t))
            if final in texts:
                out[t] = (final, texts[final])
        time.sleep(0.5)
    return out


def infobox_section(titles):
    """Section 0 (avec l'infobox) de beaucoup de pages, 50 par requête."""
    out = {}
    for i in range(0, len(titles), 50):
        chunk = titles[i:i + 50]
        d = api({"action": "query", "prop": "revisions", "rvprop": "content", "rvslots": "main",
                 "rvsection": 0, "titles": "|".join(chunk), "redirects": 1})
        redirects = {r["from"]: r["to"] for r in d["query"].get("redirects", [])}
        normalized = {n["from"]: n["to"] for n in d["query"].get("normalized", [])}
        texts = {p["title"]: p["revisions"][0]["slots"]["main"]["content"]
                 for p in d["query"]["pages"] if "revisions" in p}
        for t in chunk:
            n = normalized.get(t, t)
            final = redirects.get(n, n)
            if final in texts:
                out[t] = (final, texts[final])
        print(f"  infobox {min(i + 50, len(titles))}/{len(titles)}")
        time.sleep(0.7)
    return out


# ---------- Nettoyage du wikitext ----------
def strip_markup(v):
    v = re.sub(r"<!--.*?-->", "", v, flags=re.S)
    v = re.sub(r"<ref[^>]*/>", "", v)
    v = re.sub(r"<ref[^>]*>.*?</ref>", "", v, flags=re.S)
    v = re.sub(r"<[^>]+>", "", v)
    v = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]", r"\1", v)
    v = re.sub(r"\{\{(?:nowrap|small|nobr)\|([^{}]*)\}\}", r"\1", v, flags=re.I)
    v = re.sub(r"\{\{[^{}]*\}\}", "", v)
    v = re.sub(r"\{\{[^{}]*\}\}", "", v)
    v = v.replace("&nbsp;", " ").replace("'''", "").replace("''", "")
    return re.sub(r"\s+", " ", v).strip()


def to_int(v):
    v = strip_markup(v)
    m = re.match(r"^\(?(\d+)\)?$", v)
    return int(m.group(1)) if m else None


def parse_infobox(text):
    """Champs de l'infobox. Certaines pages (Pelé, Maradona…) emboîtent l'infobox
    football dans une « Infobox person » : on lit donc tous les champs de l'intro."""
    if "{{infobox football biography" not in text.lower():
        return None
    fields = {}
    for line in text.split("\n"):
        if line.startswith("'''"):
            break
        m = re.match(r"^\s*\|\s*([a-z_0-9]+)\s*=\s*(.*)$", line)
        if m:
            fields.setdefault(m.group(1), m.group(2))
    return fields


def parse_birth(v):
    m = re.search(r"\{\{\s*birth date(?: and age)?\s*\|(?:[a-z]+=[a-z]+\|)*\s*(\d{4})\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})", v, re.I)
    if m:
        return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
    m = re.search(r"(\d{4})", v)
    return m.group(1) if m else None


def parse_death(v):
    m = re.search(r"\{\{\s*death date(?: and age)?\s*\|(?:[a-z]+=[a-z]+\|)*\s*(\d{4})\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})", v, re.I)
    return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}" if m else None


def parse_height(v):
    m = re.search(r"m\s*=\s*(\d[.,]\d{1,2})", v) or re.search(r"(\d[.,]\d{2})\s*m", v)
    if m:
        return float(m.group(1).replace(",", "."))
    m = re.search(r"cm\s*=\s*(\d{3})", v) or re.search(r"(\d{3})\s*cm", v)
    return int(m.group(1)) / 100 if m else None


def french_positions(v):
    v = strip_markup(v).lower()
    out = []
    for pat, fr in POSITIONS:
        if re.search(pat, v) and fr not in out:
            if fr == "Milieu" and any(x.startswith("Milieu") for x in out):
                continue
            if fr == "Attaquant" and "Ailier" in out and "striker" not in v and "centre" not in v:
                continue
            out.append(fr)
    return ", ".join(out[:3]) or None


def country_fr(name):
    return COUNTRIES.get(name, name)


def place_fr(place):
    """« Paris, France » -> « Paris, France » ; « Leeds, England » -> « Leeds, Angleterre »."""
    if not place:
        return None
    parts = [x.strip() for x in place.split(",")]
    parts[-1] = country_fr(parts[-1])
    return ", ".join(parts)


def current_fr(club):
    if not club:
        return None
    club = re.sub(r"\s*\((?:head coach|manager|player[- ]manager|caretaker.*?)\)", " (entraîneur)", club, flags=re.I)
    club = re.sub(r"\s*\(assistant.*?\)", " (entraîneur adjoint)", club, flags=re.I)
    return club


def build_player(title, text):
    f = parse_infobox(text)
    if not f:
        return None
    name = strip_markup(f.get("name", "")) or re.sub(r" \(.*\)$", "", title)
    clubs = []
    for i in range(1, 40):
        if f"clubs{i}" not in f:
            continue
        raw = f[f"clubs{i}"]
        club = strip_markup(raw)
        if not club:
            continue
        loan = 1 if ("→" in raw or "loan" in raw.lower()) else 0
        club = re.sub(r"^→\s*", "", club).replace("(loan)", "").strip()
        clubs.append([strip_markup(f.get(f"years{i}", "")), club, to_int(f.get(f"caps{i}", "")),
                      to_int(f.get(f"goals{i}", "")), loan])
    national = []
    for i in range(1, 30):
        if f"national_team{i}" not in f:
            continue
        team = strip_markup(f[f"national_team{i}"])
        if not team:
            continue
        national.append([strip_markup(f.get(f"national_years{i}", "")), team,
                         to_int(f.get(f"national_caps{i}", "")), to_int(f.get(f"national_goals{i}", ""))])
    if not clubs and not national:
        return None
    senior = [n for n in national if not re.search(r"\b(U-?\d{2}|Under-\d{2}|Olympic|B|A'|Amateur)\b", n[1])]
    nat = senior[-1][1] if senior else (national[-1][1] if national else None)
    return {
        "n": name,
        "t": title,
        "b": parse_birth(f.get("birth_date", "")),
        "d": parse_death(f.get("death_date", "")),
        "bp": place_fr(strip_markup(f.get("birth_place", ""))),
        "h": parse_height(f.get("height", "")),
        "p": french_positions(f.get("position", "")),
        "c": current_fr(strip_markup(f.get("current_club", f.get("currentclub", "")))),
        "nat": country_fr(nat) if nat else None,
        "cl": clubs,
        "nt": [[y, re.sub(r"^([A-Z][\w .'-]+?)(?= U-?\d|$| Olympic| B$)", lambda m: country_fr(m.group(1)), t), c, g]
               for y, t, c, g in national],
        "u": strip_markup(f.get("club_update", f.get("club-update", ""))) or None,
    }


# ---------- Effectifs ----------
def league_clubs(page):
    _, w = page_wikitext([page])[page]
    sec = w[w.find("Stadiums and locations"):]
    table = sec[sec.find("{|"):sec.find("|}")]
    clubs = []
    for row in table.split("|-")[1:]:
        lines = [l for l in row.split("\n") if l.startswith("|")]
        if not lines:
            continue
        m = re.search(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]", lines[0])
        if m and m.group(1) not in clubs:
            clubs.append(m.group(1))
    return clubs


SQUAD_HEAD = re.compile(r"^==+\s*(First[- ]team squad|Current squad|Players|First team|Squad)\s*==+\s*$", re.I | re.M)


def squad_players(w):
    m = SQUAD_HEAD.search(w)
    if not m:
        return []
    level = len(re.match(r"^=+", m.group(0)).group(0))
    end = re.search(r"^={2,%d}[^=].*?={2,%d}\s*$" % (level, level), w[m.end():], re.M)
    sec = w[m.end(): m.end() + end.start()] if end else w[m.end():]
    # On s'arrête avant les réserves / l'académie / les féminines
    cut = re.search(r"^==+\s*.*(Reserve|Academy|Youth|Women|U-?2[0-3]|U-?19|Under-|B team|II)\b.*==+\s*$", sec, re.M | re.I)
    if cut:
        sec = sec[:cut.start()]
    names = re.findall(r"\|\s*name\s*=\s*\[\[([^\]|]+)(?:\|[^\]]*)?\]\]", sec)
    return list(dict.fromkeys(n.strip() for n in names))


def main():
    titles, club_of = [], {}
    for lg, page in LEAGUE_PAGES.items():
        clubs = league_clubs(page)
        print(f"{lg} : {len(clubs)} clubs")
        texts = page_wikitext(clubs)
        for c in clubs:
            if c not in texts:
                print(f"  ! page introuvable : {c}")
                continue
            players = squad_players(texts[c][1])
            print(f"  {c} : {len(players)} joueurs")
            for p in players:
                if p not in club_of:
                    club_of[p] = c
                    titles.append(p)
    for t in LEGENDS:
        if t not in club_of:
            titles.append(t)
    titles = list(dict.fromkeys(titles))
    print(f"Total : {len(titles)} pages de joueurs")

    pages = infobox_section(titles)
    players, seen = [], set()
    for t in titles:
        if t not in pages:
            continue
        final, text = pages[t]
        if final in seen:
            continue
        p = build_player(final, text)
        if p:
            seen.add(final)
            players.append(p)
    data = {
        "updated": date.today().isoformat(),
        "source": "Wikipédia (en.wikipedia.org), infobox « Infobox football biography » de chaque joueur",
        "note": "Matchs et buts en club = championnat uniquement (convention Wikipédia).",
        "players": players,
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(players)} joueurs écrits dans {OUT} ({OUT.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
