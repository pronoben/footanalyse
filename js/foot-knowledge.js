/* =========================================================
   ENCYCLOPÉDIE DU FOOT (base de connaissances du chatbot gratuit)
   ---------------------------------------------------------
   Palmarès, Ballon d'Or, règles, tactique, vocabulaire,
   légendes, entraîneurs et fiches des clubs.
   Infos arrêtées à la fin de la saison 2025-2026 (Coupe du monde
   2026 et Ballon d'Or 2026 compris), vérifiées le 16/11/2026 sur
   Wikipédia :
     https://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_finals
     https://en.wikipedia.org/wiki/2026_FIFA_World_Cup
     https://en.wikipedia.org/wiki/List_of_UEFA_European_Championship_finals
     https://en.wikipedia.org/wiki/List_of_European_Cup_and_UEFA_Champions_League_finals
     https://en.wikipedia.org/wiki/2026_UEFA_Champions_League_final
     https://en.wikipedia.org/wiki/2026_UEFA_Europa_League_final
     https://en.wikipedia.org/wiki/2026_UEFA_Conference_League_final
     https://en.wikipedia.org/wiki/Ballon_d%27Or
     https://en.wikipedia.org/wiki/Ballon_d%27Or_F%C3%A9minin
     https://en.wikipedia.org/wiki/List_of_French_football_champions
     https://en.wikipedia.org/wiki/List_of_English_football_champions
     https://en.wikipedia.org/wiki/List_of_Spanish_football_champions
     https://en.wikipedia.org/wiki/List_of_Italian_football_champions
     https://en.wikipedia.org/wiki/List_of_German_football_champions
     https://en.wikipedia.org/wiki/2025%E2%80%9326_Ligue_1 (+ Premier League, La Liga, Serie A, Bundesliga)
     https://en.wikipedia.org/wiki/2025%E2%80%9326_Coupe_de_France
     https://en.wikipedia.org/wiki/2026%E2%80%9327_Ligue_1 (+ les 4 autres : stades des clubs)
     https://en.wikipedia.org/wiki/France_national_football_team
     Pages Wikipédia de Guardiola, Ancelotti, Mourinho, Messi, Cristiano Ronaldo
   Les règles du jeu suivent les Lois du jeu de l'IFAB (theifab.com).
   Les expressions régulières s'appliquent à la question
   « nettoyée » : minuscules, sans accents, ponctuation et tirets
   remplacés par des espaces (ex. « hors-jeu » -> « hors jeu »).
   ========================================================= */

const FOOT_KB = {
  until: "fin de la saison 2025-2026 (vérifiées sur Wikipédia le 16/11/2026)",

  // ---------- Coupe du monde : [année, vainqueur, pays hôte, finaliste, score de la finale] ----------
  worldCup: [
    [1930, "Uruguay", "Uruguay", "Argentine", "4-2"],
    [1934, "Italie", "Italie", "Tchécoslovaquie", "2-1 a.p."],
    [1938, "Italie", "France", "Hongrie", "4-2"],
    [1950, "Uruguay", "Brésil", "Brésil", "2-1, match décisif de la poule finale, le « Maracanazo »"],
    [1954, "RFA", "Suisse", "Hongrie", "3-2"],
    [1958, "Brésil", "Suède", "Suède", "5-2"],
    [1962, "Brésil", "Chili", "Tchécoslovaquie", "3-1"],
    [1966, "Angleterre", "Angleterre", "RFA", "4-2 a.p."],
    [1970, "Brésil", "Mexique", "Italie", "4-1"],
    [1974, "RFA", "RFA", "Pays-Bas", "2-1"],
    [1978, "Argentine", "Argentine", "Pays-Bas", "3-1 a.p."],
    [1982, "Italie", "Espagne", "RFA", "3-1"],
    [1986, "Argentine", "Mexique", "RFA", "3-2"],
    [1990, "RFA", "Italie", "Argentine", "1-0"],
    [1994, "Brésil", "États-Unis", "Italie", "0-0, 3-2 aux tirs au but"],
    [1998, "France", "France", "Brésil", "3-0"],
    [2002, "Brésil", "Corée du Sud et Japon", "Allemagne", "2-0"],
    [2006, "Italie", "Allemagne", "France", "1-1, 5-3 aux tirs au but"],
    [2010, "Espagne", "Afrique du Sud", "Pays-Bas", "1-0 a.p."],
    [2014, "Allemagne", "Brésil", "Argentine", "1-0 a.p."],
    [2018, "France", "Russie", "Croatie", "4-2"],
    [2022, "Argentine", "Qatar", "France", "3-3, 4-2 aux tirs au but"],
    [2026, "Espagne", "États-Unis, Canada et Mexique", "Argentine", "1-0 a.p."],
  ],

  // ---------- Euro : [année, vainqueur, pays hôte, finaliste, score] ----------
  euro: [
    [1960, "URSS", "France", "Yougoslavie", "2-1 a.p."],
    [1964, "Espagne", "Espagne", "URSS", "2-1"],
    [1968, "Italie", "Italie", "Yougoslavie", "2-0 en finale rejouée après un 1-1"],
    [1972, "RFA", "Belgique", "URSS", "3-0"],
    [1976, "Tchécoslovaquie", "Yougoslavie", "RFA", "2-2, 5-3 aux tirs au but, avec le penalty de Panenka"],
    [1980, "RFA", "Italie", "Belgique", "2-1"],
    [1984, "France", "France", "Espagne", "2-0"],
    [1988, "Pays-Bas", "RFA", "URSS", "2-0"],
    [1992, "Danemark", "Suède", "Allemagne", "2-0"],
    [1996, "Allemagne", "Angleterre", "République tchèque", "2-1, but en or"],
    [2000, "France", "Belgique et Pays-Bas", "Italie", "2-1, but en or de Trezeguet"],
    [2004, "Grèce", "Portugal", "Portugal", "1-0"],
    [2008, "Espagne", "Autriche et Suisse", "Allemagne", "1-0"],
    [2012, "Espagne", "Pologne et Ukraine", "Italie", "4-0"],
    [2016, "Portugal", "France", "France", "1-0 a.p."],
    [2021, "Italie", "11 pays d'Europe (Euro 2020 joué en 2021)", "Angleterre", "1-1, 3-2 aux tirs au but"],
    [2024, "Espagne", "Allemagne", "Angleterre", "2-1"],
  ],

  // Noms de pays reconnus dans les questions (pour « combien de Coupes du monde a la France ? »)
  countries: {
    "France": /\bfrance\b|\bbleus\b|\bfrancais\b/,
    "Brésil": /\bbresil\b|\bbresilien/,
    "Allemagne": /\ballemagne\b|\brfa\b|\ballemand/,
    "RFA": /\brfa\b/,
    "Italie": /\bitalie\b|\bitalien|\bsquadra azzurra\b/,
    "Argentine": /\bargentine\b|\bargentin/,
    "Uruguay": /\buruguay/,
    "Angleterre": /\bangleterre\b|\banglais\b|\bthree lions\b/,
    "Espagne": /\bespagne\b|\bespagnol|\broja\b/,
    "Pays-Bas": /\bpays bas\b|\bhollande\b|\bneerland/,
    "Portugal": /\bportugal\b|\bportugais\b/,
    "Grèce": /\bgrece\b/,
    "Danemark": /\bdanemark\b/,
    "Tchécoslovaquie": /\btchecoslovaquie\b/,
    "URSS": /\burss\b|\bunion sovietique\b/,
    "Croatie": /\bcroatie\b/,
    "Hongrie": /\bhongrie\b/,
    "Belgique": /\bbelgique\b|\bbelges?\b/,
    "Maroc": /\bmaroc\b/,
  },

  // ---------- Coupe des clubs champions / Ligue des champions : [année de la finale, vainqueur] ----------
  ucl: [
    [1956, "Real Madrid"], [1957, "Real Madrid"], [1958, "Real Madrid"], [1959, "Real Madrid"], [1960, "Real Madrid"],
    [1961, "Benfica"], [1962, "Benfica"], [1963, "AC Milan"], [1964, "Inter Milan"], [1965, "Inter Milan"],
    [1966, "Real Madrid"], [1967, "Celtic Glasgow"], [1968, "Manchester United"], [1969, "AC Milan"], [1970, "Feyenoord"],
    [1971, "Ajax Amsterdam"], [1972, "Ajax Amsterdam"], [1973, "Ajax Amsterdam"], [1974, "Bayern Munich"], [1975, "Bayern Munich"],
    [1976, "Bayern Munich"], [1977, "Liverpool"], [1978, "Liverpool"], [1979, "Nottingham Forest"], [1980, "Nottingham Forest"],
    [1981, "Liverpool"], [1982, "Aston Villa"], [1983, "Hambourg"], [1984, "Liverpool"], [1985, "Juventus"],
    [1986, "Steaua Bucarest"], [1987, "FC Porto"], [1988, "PSV Eindhoven"], [1989, "AC Milan"], [1990, "AC Milan"],
    [1991, "Étoile rouge de Belgrade"], [1992, "FC Barcelone"], [1993, "Olympique de Marseille"], [1994, "AC Milan"], [1995, "Ajax Amsterdam"],
    [1996, "Juventus"], [1997, "Borussia Dortmund"], [1998, "Real Madrid"], [1999, "Manchester United"], [2000, "Real Madrid"],
    [2001, "Bayern Munich"], [2002, "Real Madrid"], [2003, "AC Milan"], [2004, "FC Porto"], [2005, "Liverpool"],
    [2006, "FC Barcelone"], [2007, "AC Milan"], [2008, "Manchester United"], [2009, "FC Barcelone"], [2010, "Inter Milan"],
    [2011, "FC Barcelone"], [2012, "Chelsea"], [2013, "Bayern Munich"], [2014, "Real Madrid"], [2015, "FC Barcelone"],
    [2016, "Real Madrid"], [2017, "Real Madrid"], [2018, "Real Madrid"], [2019, "Liverpool"], [2020, "Bayern Munich"],
    [2021, "Chelsea"], [2022, "Real Madrid"], [2023, "Manchester City"], [2024, "Real Madrid"], [2025, "Paris Saint-Germain"],
    [2026, "Paris Saint-Germain"],
  ],
  uclFinals: {
    2026: "PSG – Arsenal 1-1 a.p., 4-3 aux tirs au but à Budapest (Havertz pour Arsenal, Dembélé sur penalty pour Paris)",
    2025: "PSG – Inter Milan 5-0 à Munich (plus large score de l'histoire en finale)",
    2024: "Real Madrid – Dortmund 2-0 à Wembley",
    2023: "Manchester City – Inter Milan 1-0 à Istanbul",
    2022: "Real Madrid – Liverpool 1-0 au Stade de France",
    2021: "Chelsea – Manchester City 1-0 à Porto",
    2020: "Bayern Munich – PSG 1-0 à Lisbonne (but de Kingsley Coman)",
    2019: "Liverpool – Tottenham 2-0 à Madrid",
    2018: "Real Madrid – Liverpool 3-1 à Kiev",
    2017: "Real Madrid – Juventus 4-1 à Cardiff",
    2016: "Real Madrid – Atlético Madrid 1-1, 5-3 aux tirs au but à Milan",
    2005: "Liverpool – AC Milan 3-3, 3-2 aux tirs au but à Istanbul (Liverpool était mené 3-0 à la mi-temps)",
    1999: "Manchester United – Bayern Munich 2-1 à Barcelone (deux buts dans le temps additionnel)",
    1993: "Marseille – AC Milan 1-0 à Munich (but de Basile Boli)",
  },
  // Noms de clubs reconnus pour compter les Ligues des champions
  uclClubs: {
    "Real Madrid": /\breal madrid\b|\breal\b(?! sociedad| betis)|\bmerengue/,
    "AC Milan": /\bac milan\b|\bmilan ac\b|\brossoneri\b|(?<!inter )\bmilan\b/,
    "Bayern Munich": /\bbayern\b/,
    "Liverpool": /\bliverpool\b|\blfc\b/,
    "FC Barcelone": /\bbarca\b|\bbarcelone\b|\bbarcelona\b/,
    "Ajax Amsterdam": /\bajax\b/,
    "Inter Milan": /\binter\b(?! miami)/,
    "Manchester United": /\bmanchester united\b|\bman united\b|\bman utd\b|\bmu\b/,
    "Juventus": /\bjuventus\b|\bjuve\b/,
    "Benfica": /\bbenfica\b/,
    "Nottingham Forest": /\bnottingham\b/,
    "FC Porto": /\bporto\b/,
    "Chelsea": /\bchelsea\b/,
    "Celtic Glasgow": /\bceltic\b/,
    "Feyenoord": /\bfeyenoord\b/,
    "Aston Villa": /\baston villa\b/,
    "Hambourg": /\bhambourg\b|\bhamburg\b|\bhsv\b/,
    "Steaua Bucarest": /\bsteaua\b/,
    "PSV Eindhoven": /\bpsv\b/,
    "Étoile rouge de Belgrade": /\betoile rouge\b|\bred star\b/,
    "Olympique de Marseille": /\bmarseille\b|\bl om\b|\bom\b/,
    "Borussia Dortmund": /\bdortmund\b|\bbvb\b/,
    "Manchester City": /\bmanchester city\b|\bman city\b/,
    "Paris Saint-Germain": /\bpsg\b|\bparis saint germain\b|\bparis sg\b/,
    "Arsenal": /\barsenal\b/,
    "Atlético Madrid": /\batletico\b/,
    "Tottenham": /\btottenham\b|\bspurs\b/,
    "Monaco": /\bmonaco\b/,
    "Lyon": /\blyon\b|\bol\b/,
    "Napoli": /\bnaples\b|\bnapoli\b/,
  },

  // ---------- Ballon d'Or : [année, joueur, nationalité, club] ----------
  ballonDor: [
    [1956, "Stanley Matthews", "Angleterre", "Blackpool"], [1957, "Alfredo Di Stéfano", "Espagne", "Real Madrid"],
    [1958, "Raymond Kopa", "France", "Real Madrid"], [1959, "Alfredo Di Stéfano", "Espagne", "Real Madrid"],
    [1960, "Luis Suárez", "Espagne", "FC Barcelone"], [1961, "Omar Sívori", "Italie", "Juventus"],
    [1962, "Josef Masopust", "Tchécoslovaquie", "Dukla Prague"], [1963, "Lev Yachine", "URSS", "Dynamo Moscou"],
    [1964, "Denis Law", "Écosse", "Manchester United"], [1965, "Eusébio", "Portugal", "Benfica"],
    [1966, "Bobby Charlton", "Angleterre", "Manchester United"], [1967, "Flórián Albert", "Hongrie", "Ferencváros"],
    [1968, "George Best", "Irlande du Nord", "Manchester United"], [1969, "Gianni Rivera", "Italie", "AC Milan"],
    [1970, "Gerd Müller", "RFA", "Bayern Munich"], [1971, "Johan Cruyff", "Pays-Bas", "Ajax Amsterdam"],
    [1972, "Franz Beckenbauer", "RFA", "Bayern Munich"], [1973, "Johan Cruyff", "Pays-Bas", "FC Barcelone"],
    [1974, "Johan Cruyff", "Pays-Bas", "FC Barcelone"], [1975, "Oleg Blokhine", "URSS", "Dynamo Kiev"],
    [1976, "Franz Beckenbauer", "RFA", "Bayern Munich"], [1977, "Allan Simonsen", "Danemark", "Mönchengladbach"],
    [1978, "Kevin Keegan", "Angleterre", "Hambourg"], [1979, "Kevin Keegan", "Angleterre", "Hambourg"],
    [1980, "Karl-Heinz Rummenigge", "RFA", "Bayern Munich"], [1981, "Karl-Heinz Rummenigge", "RFA", "Bayern Munich"],
    [1982, "Paolo Rossi", "Italie", "Juventus"], [1983, "Michel Platini", "France", "Juventus"],
    [1984, "Michel Platini", "France", "Juventus"], [1985, "Michel Platini", "France", "Juventus"],
    [1986, "Igor Belanov", "URSS", "Dynamo Kiev"], [1987, "Ruud Gullit", "Pays-Bas", "AC Milan"],
    [1988, "Marco van Basten", "Pays-Bas", "AC Milan"], [1989, "Marco van Basten", "Pays-Bas", "AC Milan"],
    [1990, "Lothar Matthäus", "RFA", "Inter Milan"], [1991, "Jean-Pierre Papin", "France", "Olympique de Marseille"],
    [1992, "Marco van Basten", "Pays-Bas", "AC Milan"], [1993, "Roberto Baggio", "Italie", "Juventus"],
    [1994, "Hristo Stoitchkov", "Bulgarie", "FC Barcelone"], [1995, "George Weah", "Liberia", "AC Milan"],
    [1996, "Matthias Sammer", "Allemagne", "Borussia Dortmund"], [1997, "Ronaldo", "Brésil", "Inter Milan"],
    [1998, "Zinedine Zidane", "France", "Juventus"], [1999, "Rivaldo", "Brésil", "FC Barcelone"],
    [2000, "Luís Figo", "Portugal", "Real Madrid"], [2001, "Michael Owen", "Angleterre", "Liverpool"],
    [2002, "Ronaldo", "Brésil", "Real Madrid"], [2003, "Pavel Nedvěd", "République tchèque", "Juventus"],
    [2004, "Andriy Shevchenko", "Ukraine", "AC Milan"], [2005, "Ronaldinho", "Brésil", "FC Barcelone"],
    [2006, "Fabio Cannavaro", "Italie", "Real Madrid"], [2007, "Kaká", "Brésil", "AC Milan"],
    [2008, "Cristiano Ronaldo", "Portugal", "Manchester United"], [2009, "Lionel Messi", "Argentine", "FC Barcelone"],
    [2010, "Lionel Messi", "Argentine", "FC Barcelone"], [2011, "Lionel Messi", "Argentine", "FC Barcelone"],
    [2012, "Lionel Messi", "Argentine", "FC Barcelone"], [2013, "Cristiano Ronaldo", "Portugal", "Real Madrid"],
    [2014, "Cristiano Ronaldo", "Portugal", "Real Madrid"], [2015, "Lionel Messi", "Argentine", "FC Barcelone"],
    [2016, "Cristiano Ronaldo", "Portugal", "Real Madrid"], [2017, "Cristiano Ronaldo", "Portugal", "Real Madrid"],
    [2018, "Luka Modrić", "Croatie", "Real Madrid"], [2019, "Lionel Messi", "Argentine", "FC Barcelone"],
    [2021, "Lionel Messi", "Argentine", "PSG"], [2022, "Karim Benzema", "France", "Real Madrid"],
    [2023, "Lionel Messi", "Argentine", "Inter Miami"], [2024, "Rodri", "Espagne", "Manchester City"],
    [2025, "Ousmane Dembélé", "France", "PSG"], [2026, "Harry Kane", "Angleterre", "Bayern Munich"],
  ],
  // Mots-clés pour reconnaître un lauréat (« combien de Ballons d'Or a Messi ? »)
  ballonDorNames: {
    "Lionel Messi": /\bmessi\b|\bla pulga\b/,
    "Cristiano Ronaldo": /\bcristiano\b|\bcr7\b|\bronaldo\b(?! nazario)(?! bresilien)/,
    "Ronaldo": /\bronaldo nazario\b|\bronaldo bresilien\b|\bfenomeno\b|\br9\b/,
    "Michel Platini": /\bplatini\b/,
    "Johan Cruyff": /\bcruyff\b/,
    "Marco van Basten": /\bvan basten\b/,
    "Franz Beckenbauer": /\bbeckenbauer\b/,
    "Alfredo Di Stéfano": /\bdi stefano\b/,
    "Kevin Keegan": /\bkeegan\b/,
    "Karl-Heinz Rummenigge": /\brummenigge\b/,
    "Zinedine Zidane": /\bzidane\b|\bzizou\b/,
    "Karim Benzema": /\bbenzema\b/,
    "Ousmane Dembélé": /\bdembele\b/,
    "Raymond Kopa": /\bkopa\b/,
    "Jean-Pierre Papin": /\bpapin\b|\bjpp\b/,
    "Luka Modrić": /\bmodric\b/,
    "Rodri": /\brodri\b/,
    "Ronaldinho": /\bronaldinho\b/,
    "Kaká": /\bkaka\b/,
    "Thierry Henry": /\bhenry\b/,
    "Kylian Mbappé": /\bmbappe\b/,
    "Erling Haaland": /\bhaaland\b/,
    "Harry Kane": /\bkane\b/,
    "Robert Lewandowski": /\blewandowski\b/,
  },

  // ---------- Championnats : 10 derniers champions connus + records ----------
  leagues: {
    L1: {
      name: "Ligue 1", flag: "🇫🇷", re: /\bligue 1\b|\bl1\b|championnat de france|champions? de france|championnat francais|\ben france\b/,
      champions: [["2015-16", "PSG"], ["2016-17", "Monaco"], ["2017-18", "PSG"], ["2018-19", "PSG"], ["2019-20", "PSG"],
        ["2020-21", "Lille"], ["2021-22", "PSG"], ["2022-23", "PSG"], ["2023-24", "PSG"], ["2024-25", "PSG"], ["2025-26", "PSG (5e titre d'affilée)"]],
      records: "Clubs les plus titrés : **PSG (14 titres)**, Saint-Étienne (10), Marseille (9 en championnat professionnel, 10 en comptant le titre amateur de 1929), Nantes (8), Monaco (8), Lyon (7, d'affilée de 2002 à 2008).",
      format: "18 clubs, 34 journées. Les 2 derniers descendent en Ligue 2, le 16e joue un barrage contre un club de Ligue 2.",
    },
    PL: {
      name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", re: /\bpremier league\b|\bpl\b|championnat d angleterre|champions? d angleterre|championnat anglais|\ben angleterre\b/,
      champions: [["2015-16", "Leicester (cote de 5000 contre 1 en début de saison)"], ["2016-17", "Chelsea"], ["2017-18", "Manchester City"],
        ["2018-19", "Manchester City"], ["2019-20", "Liverpool"], ["2020-21", "Manchester City"], ["2021-22", "Manchester City"],
        ["2022-23", "Manchester City"], ["2023-24", "Manchester City"], ["2024-25", "Liverpool"], ["2025-26", "Arsenal (1er titre depuis 2004)"]],
      records: "Clubs les plus titrés en Angleterre : **Manchester United (20 titres)** et **Liverpool (20)**, Arsenal (14), Manchester City (10), Everton (9). Manchester City a gagné 4 titres d'affilée (2021 à 2024), un record.",
      format: "20 clubs, 38 journées. Les 3 derniers descendent en Championship.",
    },
    LIGA: {
      name: "Liga", flag: "🇪🇸", re: /\bliga\b|championnat d espagne|champions? d espagne|championnat espagnol|\ben espagne\b/,
      champions: [["2015-16", "FC Barcelone"], ["2016-17", "Real Madrid"], ["2017-18", "FC Barcelone"], ["2018-19", "FC Barcelone"],
        ["2019-20", "Real Madrid"], ["2020-21", "Atlético Madrid"], ["2021-22", "Real Madrid"], ["2022-23", "FC Barcelone"],
        ["2023-24", "Real Madrid"], ["2024-25", "FC Barcelone"], ["2025-26", "FC Barcelone"]],
      records: "Clubs les plus titrés : **Real Madrid (36 titres)**, FC Barcelone (29), Atlético Madrid (11), Athletic Bilbao (8), Valence (6).",
      format: "20 clubs, 38 journées. Les 3 derniers descendent en Segunda División.",
    },
    SA: {
      name: "Serie A", flag: "🇮🇹", re: /\bserie a\b|championnat d italie|champions? d italie|\bscudetto\b|championnat italien|\ben italie\b/,
      champions: [["2015-16", "Juventus"], ["2016-17", "Juventus"], ["2017-18", "Juventus"], ["2018-19", "Juventus"],
        ["2019-20", "Juventus (9e titre d'affilée, record)"], ["2020-21", "Inter Milan"], ["2021-22", "AC Milan"],
        ["2022-23", "Naples"], ["2023-24", "Inter Milan"], ["2024-25", "Naples"], ["2025-26", "Inter Milan"]],
      records: "Clubs les plus titrés : **Juventus (36 titres)**, Inter Milan (21), AC Milan (19), Genoa (9), Torino (7), Bologne (7), Pro Vercelli (7). Le titre de champion s'appelle le *Scudetto*.",
      format: "20 clubs, 38 journées. Les 3 derniers descendent en Serie B.",
    },
    BL: {
      name: "Bundesliga", flag: "🇩🇪", re: /\bbundesliga\b|championnat d allemagne|champions? d allemagne|championnat allemand|\ben allemagne\b/,
      champions: [["2015-16", "Bayern Munich"], ["2016-17", "Bayern Munich"], ["2017-18", "Bayern Munich"], ["2018-19", "Bayern Munich"],
        ["2019-20", "Bayern Munich"], ["2020-21", "Bayern Munich"], ["2021-22", "Bayern Munich"], ["2022-23", "Bayern Munich (11e titre d'affilée, record)"],
        ["2023-24", "Leverkusen (invaincu toute la saison)"], ["2024-25", "Bayern Munich"], ["2025-26", "Bayern Munich"]],
      records: "Clubs les plus titrés : **Bayern Munich (35 titres de champion d'Allemagne, dont 34 en Bundesliga)**, Nuremberg (9), Dortmund (8), Schalke 04 (7), Hambourg (6), Mönchengladbach (5), Stuttgart (5).",
      format: "18 clubs, 34 journées. Les 2 derniers descendent en 2. Bundesliga, le 16e joue un barrage.",
    },
  },

  // ---------- Coupes : vainqueurs par année (finale) ----------
  cups: [
    { n: "Coupe de France", re: /coupe de france/, w: { 2019: "Rennes (contre le PSG, aux tirs au but)", 2020: "PSG", 2021: "PSG", 2022: "Nantes", 2023: "Toulouse", 2024: "PSG", 2025: "PSG (3-0 contre Reims)", 2026: "Lens (3-1 contre Nice), 1er titre du club" } },
    { n: "FA Cup", re: /fa cup|coupe d angleterre/, w: { 2023: "Manchester City", 2024: "Manchester United", 2025: "Crystal Palace (1-0 contre Manchester City)", 2026: "Manchester City" } },
    { n: "Coupe du Roi", re: /copa del rey|coupe du roi|coupe d espagne/, w: { 2023: "Real Madrid", 2024: "Athletic Bilbao", 2025: "FC Barcelone", 2026: "Real Sociedad" } },
    { n: "Coupe d'Italie", re: /coppa italia|coupe d italie/, w: { 2023: "Inter Milan", 2024: "Juventus", 2025: "Bologne", 2026: "Inter Milan" } },
    { n: "Coupe d'Allemagne", re: /dfb pokal|coupe d allemagne/, w: { 2023: "RB Leipzig", 2024: "Bayer Leverkusen", 2025: "VfB Stuttgart", 2026: "Bayern Munich" } },
    { n: "Ligue Europa", re: /ligue europa|europa league|\bc3\b|coupe uefa/, w: { 2021: "Villarreal", 2022: "Eintracht Francfort", 2023: "Séville", 2024: "Atalanta (3-0 contre Leverkusen)", 2025: "Tottenham", 2026: "Aston Villa (3-0 contre Fribourg)" } },
    { n: "Ligue Conférence", re: /conference league|ligue conference|\bc4\b/, w: { 2022: "AS Rome", 2023: "West Ham", 2024: "Olympiakos", 2025: "Chelsea", 2026: "Crystal Palace (1-0 contre le Rayo Vallecano)" } },
  ],

  // ---------- Sujets : règles, compétitions, tactique, vocabulaire, records ----------
  // noTeam : on ne répond pas si une équipe est citée (ex. « les remplaçants du PSG » = compo)
  topics: [
    { k: /hors jeu|offside/, t: "Le hors-jeu", a:
      "Un joueur est **hors-jeu** si, au moment où un coéquipier lui passe le ballon :\n" +
      "- il est dans la moitié de terrain adverse,\n- et il est plus près de la ligne de but adverse que le ballon **et** que l'avant-dernier adversaire (souvent le dernier défenseur, le gardien comptant comme un adversaire).\n" +
      "Il n'est sanctionné que s'il participe à l'action (jouer le ballon, gêner un adversaire…).\n" +
      "Pas de hors-jeu sur une **touche**, un **corner** ou un **coup de pied de but**, ni si le joueur est à la même hauteur que l'avant-dernier défenseur.\n" +
      "Sanction : coup franc indirect pour l'équipe adverse. Depuis 2022, la VAR utilise le **hors-jeu semi-automatique** (caméras qui suivent les membres des joueurs)." },
    { k: /\bvar\b|arbitrage video|assistance video|assistant video/, t: "La VAR", a:
      "La **VAR** (assistance vidéo à l'arbitrage) aide l'arbitre sur 4 situations seulement :\n" +
      "- un **but** (hors-jeu, faute, main avant le but),\n- un **penalty** (accordé ou non),\n- un **carton rouge direct**,\n- une **erreur d'identité** (mauvais joueur sanctionné).\n" +
      "Elle n'intervient qu'en cas d'**erreur claire et évidente**. L'arbitre peut aller revoir les images au bord du terrain. " +
      "Utilisée en Coupe du monde depuis 2018, en Ligue 1 depuis 2018-2019." },
    { k: /carton|expuls|avertissement/, noTeam: true, t: "Les cartons", a:
      "- **Carton jaune** = avertissement (faute grossière, anti-jeu, contestation, simulation, retard de reprise…).\n" +
      "- **Deux jaunes** dans le même match = **carton rouge** : le joueur est exclu et son équipe joue à 10.\n" +
      "- **Carton rouge direct** : faute grave, brutalité, crachat, empêcher un but évident par une faute ou une main volontaire, propos injurieux.\n" +
      "Un joueur exclu ne peut pas être remplacé et est ensuite **suspendu** au moins un match. Les entraîneurs aussi peuvent recevoir des cartons." },
    { k: /tirs? au but|seance de tirs|\btab\b/, t: "La séance de tirs au but", a:
      "Quand un match à élimination directe reste à égalité après la **prolongation** (2 × 15 min), on tire les **tirs au but** :\n" +
      "- 5 tireurs par équipe, en alternance, depuis le point de penalty (11 m) ;\n- si c'est encore égal, on continue un par un (« mort subite ») ;\n" +
      "- seuls les joueurs sur le terrain à la fin du match peuvent tirer ;\n- le gardien doit garder au moins un pied sur la ligne au moment de la frappe.\n" +
      "Célèbres séances : finale de la Coupe du monde 1994 (Brésil), 2006 (Italie) et 2022 (Argentine)." },
    { k: /penalty|penalties|penalt/, noTeam: true, t: "Le penalty", a:
      "Le **penalty** est accordé pour une faute (ou une main) commise par un défenseur **dans sa propre surface de réparation**.\n" +
      "- Le tir se fait depuis le point de penalty, à **11 mètres** du but.\n- Seuls le tireur et le gardien sont dans la surface ; le gardien doit avoir au moins un pied sur sa ligne.\n" +
      "- Le tireur ne peut pas toucher le ballon une deuxième fois avant un autre joueur.\n" +
      "Un penalty célèbre : la **Panenka** (petite pichenette au centre), inventée par Antonín Panenka en finale de l'Euro 1976." },
    { k: /combien de temps|duree d un match|dure un match|mi temps|temps additionnel|arrets de jeu|prolongation/, t: "La durée d'un match", a:
      "- Un match dure **2 × 45 minutes**, avec une mi-temps de 15 minutes maximum.\n" +
      "- L'arbitre ajoute du **temps additionnel** à la fin de chaque période pour compenser les arrêts (blessures, remplacements, VAR, célébrations…).\n" +
      "- En match à élimination directe, s'il y a égalité : **prolongation** de 2 × 15 minutes, puis **tirs au but**.\n" +
      "Le « but en or » (le premier but en prolongation termine le match) n'existe plus depuis 2004." },
    { k: /remplacement|remplacant|changements? de joueur|combien de changement/, noTeam: true, t: "Les remplacements", a:
      "- Chaque équipe peut faire **5 remplacements** par match (règle définitive depuis 2022), en **3 arrêts de jeu** maximum, plus la mi-temps.\n" +
      "- En prolongation, un **6e remplacement** est autorisé.\n- Un remplacement supplémentaire est possible en cas de **commotion cérébrale** dans certaines compétitions.\n" +
      "- Un joueur remplacé ne peut pas revenir sur le terrain.\n- Les feuilles de match comptent souvent 9 à 12 remplaçants selon les compétitions." },
    { k: /combien de joueurs|nombre de joueurs|joueurs par equipe|joueurs sur le terrain/, noTeam: true, t: "Le nombre de joueurs", a:
      "Chaque équipe aligne **11 joueurs**, dont **1 gardien**. Un match ne peut pas commencer ou continuer si une équipe a **moins de 7 joueurs**." },
    { k: /dimension|taille du terrain|longueur du terrain|largeur du terrain|surface de reparation|point de penalty|rond central|taille des buts|taille du but/, t: "Le terrain", a:
      "- Terrain rectangulaire : **90 à 120 m** de long et **45 à 90 m** de large ; pour les matchs internationaux, **100-110 m × 64-75 m** (souvent 105 × 68 m).\n" +
      "- **Surface de réparation** : 16,5 m devant le but, 40,32 m de large.\n- **Surface de but** : 5,5 m.\n- **Point de penalty** : à 11 m.\n" +
      "- **Rond central** : 9,15 m de rayon (c'est aussi la distance du mur sur un coup franc).\n- **Buts** : 7,32 m de large et 2,44 m de haut." },
    { k: /faute de main|\bla main\b|main volontaire|main involontaire/, noTeam: true, t: "La main", a:
      "Il y a **faute de main** si un joueur (sauf le gardien dans sa surface) touche volontairement le ballon avec la main ou le bras, ou si son bras **agrandit anormalement** la surface de son corps.\n" +
      "Un but marqué directement de la main (même involontairement) par un attaquant est refusé. La main la plus célèbre : la « **main de Dieu** » de Maradona contre l'Angleterre en 1986." },
    { k: /coups? francs?/, noTeam: true, t: "Les coups francs", a:
      "- **Coup franc direct** : on peut marquer directement (après une faute comme un croche-pied, une poussée, une main).\n" +
      "- **Coup franc indirect** : le ballon doit toucher un autre joueur avant d'entrer dans le but (hors-jeu, jeu dangereux, obstruction…). L'arbitre lève le bras.\n" +
      "- Les adversaires doivent être à **9,15 m**. Depuis 2019, les attaquants ne peuvent plus se placer dans le mur adverse (à moins d'1 m)." },
    { k: /\bcorners?\b|coup de pied de coin/, noTeam: true, t: "Le corner", a:
      "Un **corner** est accordé quand le ballon franchit entièrement la ligne de but (hors du but) après avoir été touché en dernier par un **défenseur**. " +
      "Il se tire depuis le coin du terrain, et on peut marquer directement (« but olympique »). Pas de hors-jeu sur un corner." },
    { k: /ligne de but|goal line|but valable|but valide|ballon a franchi|franchi la ligne/, t: "Quand un but est-il valable ?", a:
      "Un but est accordé quand **le ballon entier** a franchi la ligne de but, entre les poteaux et sous la barre, sans faute ni main de l'attaquant. " +
      "Depuis 2014 en Coupe du monde (et en Ligue 1, Premier League…), la **goal-line technology** envoie un signal à la montre de l'arbitre en moins d'une seconde." },
    { k: /gardien.*(secondes|garder le ballon|tenir le ballon)|8 secondes|six secondes|6 secondes/, t: "La règle des 8 secondes du gardien", a:
      "Depuis la saison **2025-2026**, un gardien qui garde le ballon dans les mains **plus de 8 secondes** est sanctionné d'un **corner** pour l'adversaire " +
      "(avant, c'était 6 secondes et un coup franc indirect, presque jamais sifflé). L'arbitre compte les 5 dernières secondes avec la main levée.\n" +
      "Rappel : le gardien ne peut pas prendre à la main une passe volontaire du pied d'un coéquipier (règle de la « passe en retrait », 1992)." },
    { k: /\barbitres?\b|quatrieme arbitre|juge de touche|arbitre assistant/, noTeam: true, t: "Les arbitres", a:
      "Un match pro compte :\n- l'**arbitre central**, qui dirige le match ;\n- **2 arbitres assistants** (anciens « juges de touche ») le long des lignes, surtout pour les hors-jeu et les sorties ;\n" +
      "- le **4e arbitre**, qui gère les remplacements, le temps additionnel et les bancs ;\n- l'équipe **VAR** dans une salle vidéo.\n" +
      "Depuis 2023, les arbitres de certaines compétitions annoncent leur décision VAR au micro dans le stade." },
    { k: /\btouche\b|rentree de touche/, noTeam: true, t: "La touche", a:
      "Quand le ballon sort par une ligne de côté, l'équipe qui ne l'a pas touché en dernier fait une **rentrée de touche** : à deux mains, au-dessus de la tête, les deux pieds au sol. On ne peut pas marquer directement sur une touche, et il n'y a pas de hors-jeu." },
    { k: /buts? a l exterieur/, t: "La règle des buts à l'extérieur", a:
      "Elle départageait deux équipes à égalité sur un match aller-retour : celle qui avait marqué le plus de buts chez l'adversaire passait. L'**UEFA l'a supprimée en 2021** : en cas d'égalité, il y a désormais prolongation puis tirs au but." },
    { k: /but en or|golden goal|but en argent/, t: "Le but en or", a:
      "Avec le **but en or**, le premier but marqué en prolongation terminait le match. Il a décidé l'Euro 1996 (Allemagne) et l'Euro 2000 (France, but de David Trezeguet en finale contre l'Italie). Il a été abandonné en 2004." },
    { k: /taille du ballon|poids du ballon|ballon officiel|ballon de foot/, t: "Le ballon", a:
      "Un ballon de match adulte est de **taille 5** : 68 à 70 cm de circonférence et 410 à 450 g. Chaque grande compétition a son ballon officiel (Adidas pour la Coupe du monde depuis 1970)." },

    // --- Compétitions et formats ---
    { k: /(ligue des champions|champions league|\bc1\b|\bldc\b).*(format|fonctionne|marche|deroule|phase|qualifi|nouvelle formule|combien d equipes)|(format|nouvelle formule|fonctionne).*(ligue des champions|champions league|\bc1\b)/, t: "Le format de la Ligue des champions", a:
      "Depuis **2024-2025**, la Ligue des champions a une nouvelle formule :\n" +
      "- **36 clubs** dans une seule « phase de ligue » ; chaque club joue **8 matchs** contre 8 adversaires différents (4 à domicile, 4 à l'extérieur).\n" +
      "- Les **8 premiers** vont directement en huitièmes de finale.\n- Du **9e au 24e** : barrages aller-retour pour les 8 autres places.\n- Du 25e au 36e : éliminés (pas de repêchage en Ligue Europa).\n" +
      "- Ensuite : huitièmes, quarts, demies en aller-retour, puis **finale sur un match**." },
    { k: /ligue europa|europa league|\bc3\b|conference league|ligue conference|\bc4\b|coupe uefa/, t: "Ligue Europa et Ligue Conférence", a:
      "- La **Ligue Europa** (C3, ex-Coupe UEFA) est la 2e coupe d'Europe des clubs. Recordman : **Séville (7 titres)**. Vainqueurs récents : Atalanta (2024), Tottenham (2025), **Aston Villa (2026**, 3-0 contre Fribourg).\n" +
      "- La **Ligue Conférence** (C4), créée en 2021, est la 3e. Vainqueurs : AS Rome (2022), West Ham (2023), Olympiakos (2024), Chelsea (2025), **Crystal Palace (2026**, 1-0 contre le Rayo Vallecano, but de Mateta).\n" +
      "Les deux ont le même format que la Ligue des champions depuis 2024 (phase de ligue unique)." },
    { k: /coupe du monde des clubs|mondial des clubs/, t: "La Coupe du monde des clubs", a:
      "Depuis **2025**, la Coupe du monde des clubs FIFA se joue tous les 4 ans avec **32 clubs**, comme une Coupe du monde. La 1re édition, aux États-Unis, a été gagnée par **Chelsea**, 3-0 en finale contre le **PSG**. " +
      "Les éditions précédentes (format court annuel) ont été dominées par le Real Madrid (5 titres)." },
    { k: /ligue des nations|nations league/, t: "La Ligue des nations", a:
      "Compétition de l'UEFA entre sélections, créée en 2018. Vainqueurs : **Portugal (2019)**, **France (2021)**, **Espagne (2023)**, **Portugal (2025)**." },
    { k: /coupe de france/, t: "La Coupe de France", a:
      "Créée en 1917, ouverte à tous les clubs (même amateurs). Recordman : **PSG (16 titres)**, devant Marseille (10). Vainqueurs récents : Nantes (2022), Toulouse (2023), PSG (2024, 2025), **Lens (2026**, 3-1 contre Nice, 1er titre du club). Finale au Stade de France." },
    { k: /fa cup|coupe d angleterre/, t: "La FA Cup", a:
      "La plus vieille compétition de football du monde (1871-1872). Recordman : **Arsenal (14 titres)**. Vainqueurs récents : Manchester United (2024), Crystal Palace (2025, 1er titre majeur du club), **Manchester City (2026)**. Finale à Wembley." },
    { k: /copa del rey|coupe du roi|coupe d espagne/, t: "La Coupe du Roi", a:
      "La coupe d'Espagne. Recordman : **FC Barcelone (32 titres)**, devant l'Athletic Bilbao (24). Vainqueurs récents : Athletic Bilbao (2024), FC Barcelone (2025), **Real Sociedad (2026)**." },
    { k: /coppa italia|coupe d italie/, t: "La Coupe d'Italie", a:
      "Recordman : **Juventus (15 titres)**. Vainqueurs récents : Juventus (2024), Bologne (2025), **Inter Milan (2026)**." },
    { k: /dfb pokal|coupe d allemagne/, t: "La Coupe d'Allemagne", a:
      "La DFB-Pokal. Recordman : **Bayern Munich (21 titres)**. Vainqueurs récents : Leverkusen (2024), Stuttgart (2025), **Bayern Munich (2026)**." },
    { k: /^(?!.*\b(classement|qui|quels?|quelles?|actuel)\b).*(relegation|relegue|descente|descendre en|promotion|promu|monter en|barrages?)/, noTeam: true, t: "Montées et descentes", a:
      "Dans les grands championnats, les derniers du classement **descendent** en 2e division et sont remplacés par les meilleurs de 2e division :\n" +
      "- 🇫🇷 Ligue 1 (18 clubs) : 2 descentes directes + 1 barrage (16e contre un club de Ligue 2).\n- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League (20) : 3 descentes.\n- 🇪🇸 Liga (20) : 3 descentes.\n" +
      "- 🇮🇹 Serie A (20) : 3 descentes.\n- 🇩🇪 Bundesliga (18) : 2 descentes + 1 barrage (16e).\nLe classement du site colore ces zones en rouge et orange." },
    { k: /places? (qualificatives|europeennes)|qualifi.*(coupe d europe|europe)|combien de (clubs|equipes) en ligue des champions/, t: "Les places européennes", a:
      "Le nombre de places en coupe d'Europe dépend du **coefficient UEFA** de chaque pays. En général, les 4 premiers d'Angleterre, d'Espagne, d'Italie et d'Allemagne vont en Ligue des champions (parfois 5 grâce à une place bonus), contre 3 à 4 pour la France. Les suivants vont en Ligue Europa et en Ligue Conférence, avec le vainqueur de la coupe nationale." },
    { k: /mercato|fenetre des transferts|periode des transferts/, t: "Le mercato", a:
      "Le **mercato** est la période où les clubs peuvent acheter, vendre ou prêter des joueurs : en été (environ de juin à fin août / début septembre) et en hiver (janvier). " +
      "Un joueur en fin de contrat peut partir **libre** (sans indemnité) et signer un pré-contrat ailleurs 6 mois avant." },
    { k: /(transfert|achat|vente).*(plus cher|record)|record.*(transfert)|plus gros transfert|plus cher (joueur|transfert)/, t: "Les records de transfert", a:
      "Les transferts les plus chers de l'histoire :\n- **Neymar** : 222 M€ (Barcelone → PSG, 2017), record absolu ;\n- **Kylian Mbappé** : 180 M€ (Monaco → PSG, 2018) ;\n" +
      "- **Philippe Coutinho** : environ 135 M€ (Liverpool → Barcelone, 2018) ;\n- **João Félix** : 127 M€ (Benfica → Atlético, 2019).\n_Montants souvent cités, bonus compris ; ils varient selon les sources._" },
    { k: /fair play financier|\bfpf\b|dncg/, t: "Le fair-play financier", a:
      "Le **fair-play financier** de l'UEFA oblige les clubs à ne pas dépenser beaucoup plus qu'ils ne gagnent, sous peine d'amendes ou d'exclusion des coupes d'Europe. En France, la **DNCG** contrôle aussi les comptes des clubs et peut interdire de recruter ou rétrograder un club." },
    { k: /coupes? du monde (2030|2034)|mondial (2030|2034)|prochaine coupe du monde|prochain mondial/, t: "Les prochaines Coupes du monde", a:
      "- **2030** : Maroc, Espagne et Portugal (avec 3 matchs en Uruguay, Argentine et Paraguay pour le centenaire).\n- **2034** : Arabie saoudite.\n" +
      "La dernière, en **2026** (États-Unis, Canada, Mexique, 1re à **48 équipes**), a été gagnée par l'**Espagne** : 1-0 a.p. contre l'Argentine en finale. Meilleur buteur : Kylian Mbappé (10 buts) ; meilleur joueur : Rodri ; la France a fini 4e." },
    { k: /feminin|feminine|football des femmes|equipe de france des femmes/, t: "Le football féminin", a:
      "**Coupe du monde féminine** : États-Unis (1991, 1999, 2015, 2019 : record, 4 titres), Norvège (1995), Allemagne (2003, 2007), Japon (2011), **Espagne (2023)**.\n" +
      "**Ballon d'Or féminin** : Ada Hegerberg (2018), Megan Rapinoe (2019), Alexia Putellas (2021, 2022, **2026**), Aitana Bonmatí (2023, 2024, 2025).\n" +
      "**Ligue des champions féminine** : record de l'**Olympique lyonnais (8 titres)** ; Arsenal l'a gagnée en 2025.\n" +
      "**Euro féminin** : l'Angleterre a gagné les éditions 2022 et 2025." },

    // --- Histoire, institutions, sélection ---
    { k: /histoire du (foot|football)|origine du (foot|football)|invente le (foot|football)|naissance du (foot|football)|qui a invente|premier match (international|de l histoire)/, t: "L'histoire du football", a:
      "- Des jeux de balle au pied existent depuis l'Antiquité (le *cuju* en Chine), mais le football moderne naît en **Angleterre** : la **Football Association** fixe les premières règles en **1863** à Londres.\n" +
      "- **1872** : premier match international, Écosse – Angleterre (0-0).\n- **1904** : création de la **FIFA** à Paris.\n- **1930** : 1re Coupe du monde en Uruguay (gagnée par l'Uruguay).\n" +
      "- **1954** : création de l'**UEFA** ; **1955-56** : 1re Coupe des clubs champions (Real Madrid) ; **1960** : 1er Euro." },
    { k: /\bfifa\b|\buefa\b|infantino|ceferin/, t: "FIFA et UEFA", a:
      "- La **FIFA** (créée en 1904 à Paris, siège à Zurich) dirige le football mondial et organise la Coupe du monde. Président : **Gianni Infantino** depuis 2016.\n" +
      "- L'**UEFA** (créée en 1954, siège à Nyon) dirige le football européen : Ligue des champions, Euro… Président : **Aleksander Čeferin** depuis 2016.\n" +
      "- En France, c'est la **FFF** (Fédération française de football) et la **LFP** (Ligue de football professionnel) pour la Ligue 1 et la Ligue 2." },
    { k: /equipe de france|les bleus|selection francaise|selectionneur|palmares de la france|deschamps/, t: "L'équipe de France", a:
      "**Palmarès des Bleus** :\n- 2 **Coupes du monde** : 1998 (3-0 contre le Brésil, doublé de Zidane) et 2018 (4-2 contre la Croatie) ; finaliste en 2006 et 2022.\n" +
      "- 2 **Euros** : 1984 (Platini) et 2000 ; finaliste en 2016.\n- 1 **Ligue des nations** (2021) et 2 Coupes des confédérations (2001, 2003).\n" +
      "**Coupe du monde 2026** : 4e place (défaite 2-0 contre l'Espagne en demi-finale, puis contre l'Angleterre pour la 3e place) ; Mbappé meilleur buteur du tournoi avec 10 buts.\n" +
      "**Records** : meilleur buteur **Kylian Mbappé (67 buts)**, devant Olivier Giroud (57) et Thierry Henry (51) ; joueur le plus capé **Hugo Lloris (145 sélections)**.\n" +
      "**Sélectionneur** : **Zinedine Zidane**, qui a succédé à Didier Deschamps (2012-2026) après la Coupe du monde 2026." },
    { k: /\brecords?\b|le plus de buts|meilleur buteur de l histoire|meilleurs buteurs de l histoire|plus cape|plus de selections|plus de titres/, t: "Les grands records", a:
      "- **Plus de buts en carrière (matchs officiels)** : Cristiano Ronaldo, plus de 980 buts.\n- **Plus de buts en sélection** : Cristiano Ronaldo, 146 buts avec le Portugal (record mondial).\n" +
      "- **Plus de buts en une année civile** : Lionel Messi, 91 buts en 2012.\n- **Plus de buts en Coupe du monde** : Miroslav Klose (Allemagne), 16 ; en une seule édition : **Just Fontaine (France), 13 en 1958**.\n" +
      "- **Plus de Coupes du monde gagnées** : Pelé (3, joueur) ; Brésil (5, pays).\n- **Équipe de France** : Kylian Mbappé, meilleur buteur (67 buts).\n- **Plus de Ballons d'Or** : Lionel Messi (8).\n- **Plus de Ligues des champions** : Real Madrid (15, club) ; Ancelotti (5, entraîneur) ; Paco Gento (6, joueur), égalé par Modrić, Kroos, Carvajal et Nacho.\n" +
      "- **Meilleurs buteurs par championnat** : Ligue 1 Delio Onnis (299), Premier League Alan Shearer (260), Liga Lionel Messi (474), Serie A Silvio Piola (274), Bundesliga Gerd Müller (365).\n" +
      "- **Plus de buts en une saison** : Lewandowski 41 en Bundesliga (2020-21), Messi 50 en Liga (2011-12).\n- **Ligue des champions** : Cristiano Ronaldo, meilleur buteur de l'histoire (140 buts)." },

    // --- Tactique ---
    { k: /4 3 3|4 4 2|4 2 3 1|3 5 2|3 4 3|5 3 2|4 1 4 1|3 4 2 1|systemes? de jeu|schemas? tactique|dispositifs? tactique|quelle formation/, t: "Les systèmes de jeu", a:
      "On lit un système de la défense vers l'attaque (sans le gardien) :\n- **4-4-2** : 4 défenseurs, 4 milieux, 2 attaquants. Simple et équilibré.\n" +
      "- **4-3-3** : 3 milieux et 3 attaquants (2 ailiers + 1 avant-centre). Offensif, très utilisé (Barça, Liverpool).\n" +
      "- **4-2-3-1** : 2 milieux défensifs, 3 milieux offensifs dont un n°10, 1 attaquant. Le plus courant aujourd'hui.\n" +
      "- **3-5-2 / 3-4-3** : 3 défenseurs centraux et des **pistons** qui font tout le couloir (Inter, Conte).\n- **5-3-2** : version défensive du 3-5-2.\n" +
      "Les onglets **Compos probables** du site montrent le système de chaque équipe." },
    { k: /gegenpressing|contre pressing|\bpressing\b|pressing haut/, t: "Le pressing", a:
      "Le **pressing** consiste à aller presser l'adversaire pour récupérer vite le ballon. Le **pressing haut** se fait près du but adverse. " +
      "Le **gegenpressing** (« contre-pressing »), popularisé par Jürgen Klopp à Dortmund et Liverpool, consiste à presser immédiatement après avoir perdu le ballon, quand l'adversaire est encore désorganisé." },
    { k: /tiki taka|tikitaka|jeu de position|juego de posicion/, t: "Le tiki-taka", a:
      "Le **tiki-taka** est un jeu de passes courtes et rapides avec beaucoup de mouvement, pour garder le ballon et user l'adversaire. Symbole du **Barça de Guardiola** (2008-2012) et de l'**Espagne** championne d'Europe 2008 et 2012 et du monde 2010 (Xavi, Iniesta, Busquets)." },
    { k: /catenaccio|verrou|bloc bas|park the bus|garer le bus/, t: "Le catenaccio et le bloc bas", a:
      "Le **catenaccio** (« verrou » en italien) est un système très défensif rendu célèbre par l'Inter d'Helenio Herrera dans les années 1960, avec un **libéro** derrière la défense. " +
      "Aujourd'hui on parle de **bloc bas** : l'équipe défend près de son but et joue en **contre-attaque**." },
    { k: /football total|voetbal/, t: "Le football total", a:
      "Le **football total**, inventé par Rinus Michels et incarné par **Johan Cruyff**, à l'Ajax et avec les Pays-Bas des années 1970 : tous les joueurs (sauf le gardien) peuvent occuper tous les postes et permutent sans cesse." },
    { k: /faux (9|neuf)/, t: "Le faux 9", a:
      "Un **faux 9** est un attaquant axial qui décroche au milieu au lieu de rester devant, pour attirer les défenseurs et libérer de l'espace. Exemple célèbre : **Messi** au Barça de Guardiola en 2009." },
    { k: /contre attaque|transition/, noTeam: true, t: "La contre-attaque", a:
      "La **contre-attaque** consiste à récupérer le ballon puis à attaquer très vite, avant que l'adversaire ne se replace. Arme favorite des équipes qui défendent en bloc bas." },

    // --- Postes ---
    { k: /\bpostes?\b|positions? (sur le terrain|des joueurs)|les differents roles/, t: "Les postes", a:
      "- **Gardien** : seul autorisé à prendre le ballon à la main, dans sa surface.\n- **Défenseurs** : centraux (charnière) et **latéraux** (droit et gauche).\n" +
      "- **Milieux** : **milieu défensif / sentinelle** (devant la défense), **relayeur / box-to-box** (fait les allers-retours), **meneur de jeu / n°10** (crée les occasions).\n" +
      "- **Attaquants** : **ailiers** (sur les côtés) et **avant-centre / n°9** (finisseur).\n- **Piston** : joueur de couloir dans une défense à 3 ou 5." },
    { k: /c est quoi un (lateral|ailier|libero|sentinelle|box to box|meneur|avant centre|piston|numero 10|numero 9|relayeur)|role d un/, t: "Les postes", a: "@postes" },

    // --- Vocabulaire et stats ---
    { k: /\bxg\b|expected goals|buts attendus/, t: "Les xG (expected goals)", a:
      "Les **xG** (expected goals, « buts attendus ») mesurent la qualité des occasions : chaque tir reçoit une probabilité de but selon la distance, l'angle, le type de passe… Un penalty vaut environ **0,76 xG**. " +
      "Une équipe qui marque plus que ses xG est efficace (ou chanceuse). Le pronostic du site calcule aussi des « buts attendus » avec une loi de Poisson." },
    { k: /clean sheet|cage inviolee/, t: "Le clean sheet", a: "Un **clean sheet** (« feuille propre »), c'est un match **sans encaisser de but**. On le compte surtout pour les gardiens et les défenses." },
    { k: /hat trick|coup du chapeau|tripl(e|es) (d un joueur|buts)/, t: "Le coup du chapeau", a:
      "Un **coup du chapeau** (hat-trick), c'est **3 buts** marqués par le même joueur dans un match. Le « coup du chapeau parfait » : un du pied droit, un du gauche, un de la tête. Kylian Mbappé a réussi un triplé en **finale de Coupe du monde 2022**, comme Geoff Hurst en 1966." },
    { k: /\btriple\b|le treble/, t: "Le triplé", a:
      "En parlant d'un club, le **triplé** (treble), c'est gagner dans la même saison le **championnat**, la **coupe nationale** et la **Ligue des champions**. L'ont fait notamment : Celtic (1967), Ajax (1972), PSV (1988), Manchester United (1999), Barcelone (2009, 2015), Inter (2010), Bayern (2013, 2020), Manchester City (2023) et **PSG (2025)**." },
    { k: /\bdouble\b/, noTeam: true, t: "Le doublé", a: "Un **doublé**, c'est soit **2 buts** du même joueur dans un match, soit, pour un club, gagner le **championnat et la coupe** la même saison." },
    { k: /passe decisive|\bassists?\b|caviar/, noTeam: true, t: "La passe décisive", a: "Une **passe décisive** (assist, ou « caviar ») est la dernière passe avant un but. Le classement « joueurs décisifs » additionne buts et passes décisives." },
    { k: /panenka/, t: "La panenka", a: "La **panenka** est un penalty tiré en pichenette, doucement au centre du but, en pariant que le gardien plonge sur un côté. Nommée d'après **Antonín Panenka**, qui l'a réussie pour donner l'Euro 1976 à la Tchécoslovaquie. Zidane l'a tentée (et réussie) en finale de la Coupe du monde 2006." },
    { k: /petit pont|grand pont/, t: "Le petit pont et le grand pont", a: "- **Petit pont** : faire passer le ballon entre les jambes d'un adversaire et le récupérer derrière.\n- **Grand pont** : passer le ballon d'un côté de l'adversaire et le contourner par l'autre côté en courant." },
    { k: /roulette|marseillaise/, t: "La roulette", a: "La **roulette** (ou « roulette marseillaise ») : le joueur pose un pied sur le ballon, fait un tour sur lui-même et repart avec l'autre pied. Geste fétiche de **Zinedine Zidane**." },
    { k: /retourne|bicyclette|ciseau/, t: "Le retourné", a: "Le **retourné** (ou bicyclette) : le joueur, dos au but, frappe le ballon en l'air au-dessus de sa tête en se jetant en arrière. Le **ciseau** est la version de côté. Exemple célèbre : le retourné de Cristiano Ronaldo contre la Juventus en 2018." },
    { k: /aile de pigeon|talonnade|rabona|coup du foulard|lucarne|une deux|contre pied|reprise de volee|frappe enroulee|tir enroule/, t: "Les gestes techniques", a:
      "- **Aile de pigeon** : frapper le ballon avec l'extérieur du talon, souvent en l'air.\n- **Talonnade** : passe ou tir du talon.\n- **Rabona** (coup du foulard) : frapper en croisant la jambe de frappe derrière la jambe d'appui.\n" +
      "- **Lucarne** : la partie haute du but, dans l'angle (« mettre en lucarne »).\n- **Une-deux** : passe à un partenaire qui remet aussitôt.\n- **Contre-pied** : envoyer le ballon du côté opposé à celui où part le gardien.\n" +
      "- **Reprise de volée** : frapper le ballon avant qu'il ne touche le sol.\n- **Frappe enroulée** : tir avec effet, de l'intérieur du pied, qui contourne le gardien." },
    { k: /\btacles?\b|\btacler\b/, t: "Le tacle", a: "Un **tacle** est une action défensive pour prendre le ballon à l'adversaire avec le pied, souvent en glissant au sol. Il est régulier si le joueur touche d'abord le ballon ; un tacle par derrière, les pieds en avant ou dangereux est sanctionné d'une faute, voire d'un carton rouge." },
    { k: /\bdribbles?\b|\bdribbler\b/, t: "Le dribble", a: "Le **dribble** consiste à garder le ballon en mouvement pour éliminer un adversaire sans faire de passe (crochet, feinte de corps, passement de jambes, petit pont…). Les grands dribbleurs : Maradona, Ronaldinho, Messi, Neymar." },
    { k: /\bcentres?\b(?! ville| de formation)|\bcentrer\b/, noTeam: true, t: "Le centre", a: "Un **centre** est une passe aérienne ou à ras de terre envoyée depuis un côté du terrain vers la surface de réparation, pour un coéquipier qui reprend de la tête ou du pied." },
    { k: /contre son camp|\bcsc\b/, t: "Le but contre son camp", a: "Un **but contre son camp** (CSC) est marqué par un joueur dans son propre but, sans le faire exprès (déviation, mauvaise passe). Il compte pour l'équipe adverse, mais n'est attribué à aucun buteur adverse." },
    { k: /\ble mur\b|\bun mur\b|faire le mur/, t: "Le mur", a: "Le **mur** est la rangée de défenseurs placée à **9,15 m** du ballon sur un coup franc, pour protéger le but. Depuis 2019, les attaquants doivent se tenir à au moins 1 m du mur." },
    { k: /\bsimulation\b|\bplongeon\b|\bsimuler\b/, t: "La simulation", a: "La **simulation** consiste à faire semblant d'avoir subi une faute (plongeon) pour obtenir un coup franc ou un penalty. Elle est sanctionnée d'un **carton jaune**." },
    { k: /\bfautes?\b/, noTeam: true, t: "La faute", a: "Une **faute** est un contact irrégulier (croche-pied, poussée, tirage de maillot, charge dangereuse…) ou une main. Elle donne un **coup franc** à l'adversaire, ou un **penalty** si elle est commise dans la surface de réparation du fautif. Selon la gravité : carton jaune ou rouge." },
    { k: /\bpoteau\b|\btransversale\b|\bbarre\b/, noTeam: true, t: "Les poteaux et la barre", a: "Le but est formé de deux **poteaux** verticaux (7,32 m d'écart) et d'une **barre transversale** (2,44 m de haut). Un ballon qui touche le poteau ou la barre reste en jeu s'il revient sur le terrain." },
    { k: /\bpossession\b/, noTeam: true, t: "La possession", a: "La **possession** est le pourcentage de temps où une équipe a le ballon pendant un match. Avoir plus la possession ne garantit pas de gagner : une équipe peut défendre et marquer en contre-attaque." },
    { k: /\bfair play\b(?! financier)/, t: "Le fair-play", a: "Le **fair-play**, c'est le respect de l'adversaire, de l'arbitre et des règles : rendre le ballon à l'adversaire après une blessure, ne pas simuler, féliciter l'adversaire… La FIFA décerne chaque année un prix du fair-play." },
    { k: /\b(c est quoi|qu est ce qu|role)\b.*\b(entraineur|selectionneur|capitaine)\b/, noTeam: true, t: "Entraîneur, sélectionneur et capitaine", a: "- L'**entraîneur** dirige un club : entraînements, choix des joueurs, tactique.\n- Le **sélectionneur** dirige une équipe nationale et choisit les joueurs convoqués.\n- Le **capitaine** porte le brassard : il représente l'équipe auprès de l'arbitre et fait le tirage au sort avant le match." },
    { k: /\btete\b|jeu de tete|coup de tete/, noTeam: true, t: "Le jeu de tête", a: "Le **jeu de tête** consiste à frapper le ballon avec le front, pour marquer, dégager ou passer. Les grands spécialistes : Cristiano Ronaldo, Zlatan Ibrahimović, Olivier Giroud. Chez les jeunes, les têtes sont limitées à l'entraînement pour protéger la santé." },
    { k: /\btirs?\b(?! au but)|\bfrappes?\b/, noTeam: true, t: "Le tir", a: "Un **tir** (ou frappe) est une tentative de marquer. On distingue les **tirs cadrés** (qui vont vers le but) et non cadrés. Types de frappe : du coup de pied (puissance), de l'intérieur (précision, effet), enroulée, piquée, reprise de volée." },
    { k: /\bderbys?\b|\bclassico\b|\bclasico\b|le classique|rivalite|grandes affiches/, t: "Les grands derbys", a:
      "- 🇫🇷 **Le Classique** : PSG – OM. **Derby du Nord** : Lens – Lille. **Derby rhodanien** : Lyon – Saint-Étienne. **Derby breton** : Rennes – Nantes, Brest, Lorient…\n" +
      "- 🇪🇸 **El Clásico** : Real Madrid – FC Barcelone. **Derbi madrileño** : Real – Atlético. **Derbi sevillano** : Séville – Betis.\n" +
      "- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **Derby de Manchester** (United – City), **Derby du Merseyside** (Liverpool – Everton), **North London derby** (Arsenal – Tottenham), **North-West derby** (Liverpool – Manchester United).\n" +
      "- 🇮🇹 **Derby della Madonnina** (Inter – Milan), **Derby d'Italia** (Inter – Juventus), **Derby della Capitale** (Roma – Lazio).\n" +
      "- 🇩🇪 **Der Klassiker** (Bayern – Dortmund), **Revierderby** (Dortmund – Schalke)." },
  ],

  // ---------- Légendes et entraîneurs ----------
  // bioOnly : joueur encore en activité, fiche seulement si on demande « qui est », « carrière »…
  people: [
    { n: "Pelé", k: /\bpele\b/, a: "**Pelé** (Edson Arantes do Nascimento, 1940-2022), Brésil. Le seul joueur à avoir gagné **3 Coupes du monde** (1958, 1962, 1970). Il a joué presque toute sa carrière à **Santos**, puis au New York Cosmos. Surnommé « le Roi », il reste pour beaucoup le plus grand joueur de l'histoire." },
    { n: "Diego Maradona", k: /\bmaradona\b|\bel pibe\b/, a: "**Diego Maradona** (1960-2020), Argentine. Champion du monde **1986**, avec la « main de Dieu » puis le « but du siècle » contre l'Angleterre en quart de finale. A offert à **Naples** ses deux premiers titres de champion d'Italie (1987, 1990) et une Coupe UEFA (1989). A aussi joué à Boca Juniors, Barcelone et Séville." },
    { n: "Johan Cruyff", k: /\bcruyff\b/, a: "**Johan Cruyff** (1947-2016), Pays-Bas. **3 Ballons d'Or** (1971, 1973, 1974), **3 Coupes des clubs champions** d'affilée avec l'**Ajax** (1971-1973), finaliste de la Coupe du monde 1974. Symbole du « football total ». Entraîneur, il crée la « Dream Team » du **Barça**, championne d'Europe en 1992, et inspire Guardiola." },
    { n: "Franz Beckenbauer", k: /\bbeckenbauer\b|\bkaiser\b/, a: "**Franz Beckenbauer** (1945-2024), Allemagne, « der Kaiser ». Libéro de génie, **champion du monde 1974** comme capitaine et **1990** comme sélectionneur, champion d'Europe 1972, **3 Coupes des clubs champions** avec le **Bayern** (1974-1976) et **2 Ballons d'Or** (1972, 1976)." },
    { n: "Zinedine Zidane", k: /\bzidane\b|\bzizou\b/, a: "**Zinedine Zidane** (né en 1972), France. **Champion du monde 1998** (doublé de la tête en finale), **champion d'Europe 2000**, **Ballon d'Or 1998**. Vainqueur de la Ligue des champions **2002** avec le Real Madrid grâce à une volée mythique. Sa carrière de joueur se termine sur un coup de tête à Materazzi en finale 2006. Entraîneur du Real, il gagne **3 Ligues des champions d'affilée** (2016, 2017, 2018), un exploit unique. **Sélectionneur de l'équipe de France** depuis 2026, après Didier Deschamps." },
    { n: "Michel Platini", k: /\bplatini\b/, a: "**Michel Platini** (né en 1955), France. **3 Ballons d'Or d'affilée** (1983, 1984, 1985), **champion d'Europe 1984** avec un record de 9 buts dans le tournoi. Star de **Nancy**, Saint-Étienne puis de la **Juventus** (Coupe des clubs champions 1985). Président de l'UEFA de 2007 à 2015." },
    { n: "Lionel Messi", k: /\bmessi\b|\bla pulga\b/, a: "**Lionel Messi** (né en 1987), Argentine. Record de **8 Ballons d'Or**. **Champion du monde 2022**, Copa América 2021 et 2024. Au **FC Barcelone** (2004-2021) : 4 Ligues des champions, 10 Liga et le record de buts du club (672) et de la Liga (474). Puis PSG (2021-2023) et **Inter Miami** (depuis 2023). Finaliste de la Coupe du monde 2026 (Ballon d'argent), il a pris sa retraite internationale en octobre 2026." },
    { n: "Cristiano Ronaldo", k: /\bcristiano\b|\bcr7\b|\bronaldo\b(?! nazario)(?! bresilien)/, a: "**Cristiano Ronaldo** (né en 1985), Portugal. **5 Ballons d'Or**, **5 Ligues des champions** (1 avec Manchester United en 2008, 4 avec le Real Madrid), **champion d'Europe 2016** et vainqueur de la Ligue des nations 2019 et 2025. Meilleur buteur de l'histoire de la Ligue des champions (140 buts) et des sélections nationales (146 buts). Joue à **Al-Nassr** (Arabie saoudite) depuis 2023 ; retraite internationale annoncée en novembre 2026.\n_(Tu parlais peut-être de **Ronaldo** le Brésilien ? Demande « Ronaldo Nazario ».)_" },
    { n: "Ronaldo (Nazário)", k: /\bronaldo nazario\b|\bronaldo bresilien\b|\bfenomeno\b|\br9\b/, a: "**Ronaldo Nazário** (né en 1976), Brésil, « Il Fenomeno ». **Champion du monde 1994 et 2002** (8 buts en 2002, dont un doublé en finale), **Ballon d'Or 1997 et 2002**. A joué au PSV, au Barça, à l'Inter, au Real Madrid et au Milan. Avant-centre parmi les plus spectaculaires de l'histoire." },
    { n: "Thierry Henry", k: /\bthierry henry\b|\btiti\b/, a: "**Thierry Henry** (né en 1977), France. **Champion du monde 1998**, **champion d'Europe 2000**, **meilleur buteur de l'histoire d'Arsenal** (228 buts), « Invincible » en 2003-2004, Ligue des champions 2009 avec Barcelone. 51 buts en équipe de France (record jusqu'à Giroud en 2022)." },
    { n: "Alfredo Di Stéfano", k: /\bdi stefano\b/, a: "**Alfredo Di Stéfano** (1926-2014), Argentine puis Espagne. Moteur du **Real Madrid** qui gagne les **5 premières Coupes des clubs champions** (1956-1960), buteur dans chacune de ces finales. **Ballon d'Or 1957 et 1959**." },
    { n: "Ferenc Puskás", k: /\bpuskas\b/, a: "**Ferenc Puskás** (1927-2006), Hongrie. Capitaine du « Onze d'or » hongrois, finaliste de la Coupe du monde 1954. Au **Real Madrid**, il marque 4 buts en finale de la Coupe des clubs champions 1960. Le **prix Puskás** de la FIFA récompense chaque année le plus beau but." },
    { n: "Eusébio", k: /\beusebio\b/, a: "**Eusébio** (1942-2014), Portugal, « la Panthère noire ». Légende de **Benfica** (Coupe des clubs champions 1962), **Ballon d'Or 1965**, meilleur buteur de la Coupe du monde 1966 (9 buts)." },
    { n: "Lev Yachine", k: /\byachine\b|\byashin\b/, a: "**Lev Yachine** (1929-1990), URSS, « l'Araignée noire ». **Seul gardien de l'histoire à avoir gagné le Ballon d'Or** (1963). Champion d'Europe 1960. Le **trophée Yachine** récompense chaque année le meilleur gardien." },
    { n: "Paolo Maldini", k: /\bmaldini\b/, a: "**Paolo Maldini** (né en 1968), Italie. Toute sa carrière au **Milan AC** (1985-2009) : **5 Coupes des clubs champions / Ligues des champions** (1989, 1990, 1994, 2003, 2007) et 7 titres de champion d'Italie. Considéré comme l'un des plus grands défenseurs de l'histoire." },
    { n: "Marco van Basten", k: /\bvan basten\b/, a: "**Marco van Basten** (né en 1964), Pays-Bas. **3 Ballons d'Or** (1988, 1989, 1992). **Champion d'Europe 1988** avec une volée légendaire en finale. 2 Coupes des clubs champions avec le **Milan AC** (1989, 1990). Carrière arrêtée tôt par une blessure à la cheville." },
    { n: "Ronaldinho", k: /\bronaldinho\b/, a: "**Ronaldinho** (né en 1980), Brésil. **Champion du monde 2002**, **Ballon d'Or 2005**, Ligue des champions 2006 avec le **FC Barcelone**. Passé par le **PSG** (2001-2003). Célèbre pour ses dribbles, son sourire et ses gestes impossibles." },
    { n: "Andrés Iniesta", k: /\biniesta\b/, a: "**Andrés Iniesta** (né en 1984), Espagne. Auteur du **but de la victoire en finale de la Coupe du monde 2010**. Champion d'Europe 2008 et 2012, **4 Ligues des champions** avec le FC Barcelone. Milieu à la technique exceptionnelle, duo légendaire avec Xavi." },
    { n: "Xavi", k: /\bxavi\b/, a: "**Xavi Hernández** (né en 1980), Espagne. Métronome du **Barça** et de l'Espagne : **champion du monde 2010**, champion d'Europe 2008 et 2012, **4 Ligues des champions**. Entraîneur du Barça de 2021 à 2024 (champion d'Espagne 2023)." },
    { n: "Raymond Kopa", k: /\bkopa\b/, a: "**Raymond Kopa** (1931-2017), France. **Premier Français Ballon d'Or** (1958). Star de **Reims** et du **Real Madrid** (3 Coupes des clubs champions). 3e de la Coupe du monde 1958. Le **trophée Kopa** récompense le meilleur jeune joueur." },
    { n: "Just Fontaine", k: /\bfontaine\b/, a: "**Just Fontaine** (1933-2023), France. Record absolu de **13 buts en une seule Coupe du monde** (1958, la France finit 3e). Buteur du grand **Stade de Reims**." },
    { n: "Gerd Müller", k: /\bgerd muller\b|\bder bomber\b/, a: "**Gerd Müller** (1945-2021), Allemagne, « der Bomber ». **Champion du monde 1974** (but de la victoire en finale), champion d'Europe 1972, Ballon d'Or 1970. Record de la Bundesliga : **365 buts**, et 40 buts en une saison (1971-72, battu par Lewandowski en 2021)." },
    { n: "Karim Benzema", k: /\bbenzema\b/, bioOnly: true, a: "**Karim Benzema** (né en 1987), France. Formé à **Lyon** (4 titres de champion), puis 14 saisons au **Real Madrid** (2009-2023) : **5 Ligues des champions**, 4 Liga. **Ballon d'Or 2022**. Vainqueur de la Ligue des nations 2021 avec les Bleus. Parti ensuite à Al-Ittihad (Arabie saoudite)." },
    { n: "Luka Modrić", k: /\bmodric\b/, bioOnly: true, a: "**Luka Modrić** (né en 1985), Croatie. **Ballon d'Or 2018**, l'année où il mène la Croatie en **finale de la Coupe du monde**. **6 Ligues des champions** avec le **Real Madrid** (2012-2025), record partagé. Parti ensuite à l'AC Milan." },

    // Entraîneurs
    { n: "Pep Guardiola", k: /\bguardiola\b|\bpep\b/, a: "**Pep Guardiola** (né en 1971), Espagne. Entraîneur du **FC Barcelone** (2008-2012 : 2 Ligues des champions, 3 Liga, triplé 2009), du **Bayern Munich** (2013-2016 : 3 Bundesliga) puis de **Manchester City** (2016-2026 : 6 Premier League, dont 4 d'affilée de 2021 à 2024, et la **Ligue des champions 2023** avec un triplé). Il a quitté City en mai 2026. Père du jeu de position moderne." },
    { n: "Sir Alex Ferguson", k: /\bferguson\b/, a: "**Sir Alex Ferguson** (né en 1941), Écosse. Entraîneur de **Manchester United** pendant **27 ans** (1986-2013) : **13 titres de champion d'Angleterre**, **2 Ligues des champions** (1999 avec un triplé, 2008), 5 FA Cups. Avant cela, il avait gagné une Coupe des coupes avec Aberdeen (1983)." },
    { n: "José Mourinho", k: /\bmourinho\b|\bspecial one\b/, a: "**José Mourinho** (né en 1963), Portugal, « The Special One ». **2 Ligues des champions** : avec **Porto** (2004) et l'**Inter Milan** (2010, triplé). Champion au Portugal, en Angleterre (3 fois avec **Chelsea**), en Italie et en Espagne (Real Madrid 2012). A aussi entraîné Manchester United, Tottenham, la Roma (Ligue Conférence 2022), Fenerbahçe et Benfica. **Entraîneur du Real Madrid** depuis 2026 (son 2e passage)." },
    { n: "Carlo Ancelotti", k: /\bancelotti\b|\bcarletto\b/, a: "**Carlo Ancelotti** (né en 1959), Italie. **Record de 5 Ligues des champions** comme entraîneur : 2 avec le **Milan AC** (2003, 2007) et 3 avec le **Real Madrid** (2014, 2022, 2024). Seul entraîneur champion dans les **5 grands championnats** (Italie, Angleterre avec Chelsea, France avec le PSG, Allemagne avec le Bayern, Espagne avec le Real). Sélectionneur du **Brésil** depuis 2025." },
    { n: "Jürgen Klopp", k: /\bklopp\b/, a: "**Jürgen Klopp** (né en 1967), Allemagne. Champion d'Allemagne avec **Dortmund** (2011, 2012), puis entraîneur de **Liverpool** (2015-2024) : **Ligue des champions 2019** et le premier titre de champion d'Angleterre du club depuis 30 ans (**2020**). Inventeur du « gegenpressing » moderne." },
    { n: "Arsène Wenger", k: /\bwenger\b/, a: "**Arsène Wenger** (né en 1949), France. Entraîneur d'**Arsenal** pendant 22 ans (1996-2018) : **3 titres de champion** (1998, 2002, 2004) dont la saison des « **Invincibles** » (2003-2004, aucune défaite) et **7 FA Cups** (record). Avant, il avait été champion de France avec Monaco (1988)." },
    { n: "Didier Deschamps", k: /\bdeschamps\b/, a: "**Didier Deschamps** (né en 1968), France. Joueur : capitaine des Bleus **champions du monde 1998** et **d'Europe 2000**, vainqueur de la Ligue des champions avec Marseille (1993) et la Juventus (1996). Sélectionneur de 2012 à 2026 : **champion du monde 2018**, finaliste de l'Euro 2016 et de la Coupe du monde 2022, Ligue des nations 2021, 4e de la Coupe du monde 2026. Zinedine Zidane lui a succédé." },
    { n: "Luis Enrique", k: /\bluis enrique\b/, a: "**Luis Enrique** (né en 1970), Espagne. Seul entraîneur à avoir réussi **deux triplés championnat-coupe-Ligue des champions** avec deux clubs différents : **FC Barcelone en 2015** et **PSG en 2025** (5-0 contre l'Inter, 1re C1 du PSG). Il gagne une 2e Ligue des champions avec Paris en **2026** (aux tirs au but contre Arsenal)." },
  ],

  // ---------- Fiches des clubs ----------
  // Palmarès arrêtés à la fin de la saison 2024-2025.
  clubs: [
    // Ligue 1
    { n: "Paris Saint-Germain", k: /\bpsg\b|\bparis saint germain\b|\bparis sg\b/, a: "**Paris Saint-Germain** (PSG) – Paris\n- Fondé en **1970**\n- Stade : **Parc des Princes**\n- Surnom : les Rouge et Bleu\n- Palmarès : **14 titres de champion de France** (record), **16 Coupes de France** (record), **2 Ligues des champions** (2025, 5-0 contre l'Inter ; 2026, aux tirs au but contre Arsenal), 1 Coupe des coupes (1996). Triplé championnat-Coupe-C1 en 2025." },
    { n: "Lille", k: /\blille\b|\blosc\b|\bdogues\b/, a: "**LOSC Lille** – Lille (stade à Villeneuve-d'Ascq)\n- Fondé en **1944**\n- Stade : **Decathlon Arena – Stade Pierre-Mauroy**\n- Surnom : les Dogues\n- Palmarès : **4 titres de champion de France** sous le nom LOSC (1946, 1954, 2011, 2021), 6 Coupes de France." },
    { n: "Paris FC", k: /\bparis fc\b|\bpfc\b/, a: "**Paris FC** – Paris\n- Fondé en **1969**\n- Stade : **Stade Jean-Bouin**\n- Le deuxième club de Paris, remonté en Ligue 1 en 2025, avec le soutien de la famille Arnault (LVMH)." },
    { n: "Olympique de Marseille", k: /\bmarseille\b|\bl om\b|\bom\b|\bphoceens\b|\bolympique de marseille\b/, a: "**Olympique de Marseille** (OM) – Marseille\n- Fondé en **1899**\n- Stade : **Orange Vélodrome**\n- Surnom : les Phocéens\n- Palmarès : **9 titres de champion de France** (10 en comptant le titre amateur de 1929), 10 Coupes de France, **1 Ligue des champions (1993)**, premier club français champion d'Europe. Devise : « Droit au but »." },
    { n: "Olympique lyonnais", k: /\blyon\b|\bl ol\b|\bol\b|\bolympique lyonnais\b|\bgones\b/, a: "**Olympique lyonnais** (OL) – Lyon (stade à Décines-Charpieu)\n- Fondé en **1950**\n- Stade : **Groupama Stadium**\n- Surnom : les Gones\n- Palmarès : **7 titres de champion de France d'affilée** (2002 à 2008, record à l'époque), 5 Coupes de France. Son équipe féminine a gagné 8 Ligues des champions (record)." },
    { n: "OGC Nice", k: /\bnice\b|\bogcn\b|\baiglons\b/, a: "**OGC Nice** – Nice\n- Fondé en **1904**\n- Stade : **Allianz Riviera**\n- Surnom : les Aiglons\n- Palmarès : **4 titres de champion de France** (1951, 1952, 1956, 1959), 3 Coupes de France." },
    { n: "AS Monaco", k: /\bmonaco\b|\basm\b|\bmonegasques\b/, a: "**AS Monaco** – Monaco\n- Fondé en **1924**\n- Stade : **Stade Louis-II**\n- Surnom : les Monégasques\n- Palmarès : **8 titres de champion de France** (dernier en 2017 avec Mbappé), 5 Coupes de France, finaliste de la Ligue des champions 2004." },
    { n: "Stade rennais", k: /\brennes\b|\bstade rennais\b|\bsrfc\b/, a: "**Stade rennais** – Rennes\n- Fondé en **1901**\n- Stade : **Roazhon Park**\n- Surnom : les Rouge et Noir\n- Palmarès : **3 Coupes de France** (1965, 1971, 2019). Propriété de la famille Pinault." },
    { n: "Stade brestois", k: /\bbrest\b|\bstade brestois\b|\bsb29\b/, a: "**Stade brestois 29** – Brest\n- Fondé en **1950**\n- Stade : **Stade Francis-Le Blé**\n- Exploit : 3e de Ligue 1 en 2024, puis première participation à la Ligue des champions (2024-2025), jusqu'aux barrages contre le PSG." },
    { n: "FC Lorient", k: /\blorient\b|\bmerlus\b|\bfcl\b/, a: "**FC Lorient** – Lorient\n- Fondé en **1926**\n- Stade : **Stade du Moustoir**\n- Surnom : les Merlus\n- Palmarès : **1 Coupe de France (2002)**." },
    { n: "RC Lens", k: /\blens\b|\brcl\b|\bsang et or\b/, a: "**Racing Club de Lens** – Lens\n- Fondé en **1906**\n- Stade : **Stade Bollaert-Delelis**, réputé pour son ambiance\n- Surnom : les Sang et Or\n- Palmarès : **1 titre de champion de France (1998)**, **1 Coupe de France (2026**, 3-1 contre Nice), 1 Coupe de la Ligue (1999). Vice-champion 2023." },
    { n: "Toulouse FC", k: /\btoulouse\b|\btfc\b|\bteteu\b/, a: "**Toulouse FC** – Toulouse\n- Fondé en **1970** (le club actuel)\n- Stade : **Stadium de Toulouse**\n- Surnom : le Téfécé, les Violets\n- Palmarès : **1 Coupe de France (2023)**." },
    { n: "RC Strasbourg", k: /\bstrasbourg\b|\brcsa\b|\brcs\b/, a: "**Racing Club de Strasbourg Alsace** – Strasbourg\n- Fondé en **1906**\n- Stade : **Stade de la Meinau**\n- Palmarès : **1 titre de champion de France (1979)**, 3 Coupes de France, 4 Coupes de la Ligue." },
    { n: "AJ Auxerre", k: /\bauxerre\b|\baja\b/, a: "**AJ Auxerre** – Auxerre\n- Fondé en **1905**\n- Stade : **Stade de l'Abbé-Deschamps**\n- Palmarès : **1 titre de champion de France (1996**, doublé avec la Coupe de France), 4 Coupes de France. Club de **Guy Roux**, entraîneur pendant plus de 40 ans." },
    { n: "Le Mans FC", k: /\ble mans\b|\bdu mans\b/, a: "**Le Mans FC** – Le Mans\n- Stade : **Stade Marie-Marvingt** (ex-MMArena)\n- Club qui a déjà connu la Ligue 1 dans les années 2000. Didier Drogba y a fait ses débuts professionnels, Gervinho y a été révélé." },
    { n: "Angers SCO", k: /\bangers\b|\bsco\b/, a: "**Angers SCO** – Angers\n- Fondé en **1919**\n- Stade : **Stade Raymond-Kopa** (Kopa a débuté au club)\n- Palmarès : finaliste de la Coupe de France 1957 et 2017." },
    { n: "ES Troyes AC", k: /\btroyes\b|\bestac\b/, a: "**ES Troyes AC** (ESTAC) – Troyes\n- Fondé en **1986**\n- Stade : **Stade de l'Aube**\n- Vainqueur de la Coupe Intertoto 2001." },
    { n: "Le Havre AC", k: /\bhavre\b|\bhac\b/, a: "**Le Havre AC** – Le Havre\n- Fondé en **1872** : **le plus ancien club de football de France**\n- Stade : **Stade Océane**\n- Palmarès : 1 Coupe de France (1959). Centre de formation réputé (Mahrez, Pogba, Mendy… y sont passés)." },
    { n: "AS Saint-Étienne", k: /\bsaint etienne\b|\basse\b|\bverts\b/, a: "**AS Saint-Étienne** – Saint-Étienne\n- Fondé en **1919**\n- Stade : **Stade Geoffroy-Guichard** (« le Chaudron »)\n- Surnom : les Verts\n- Palmarès : **10 titres de champion de France** (2e club le plus titré), 6 Coupes de France, finaliste de la Coupe des clubs champions 1976 (les « poteaux carrés » de Glasgow)." },
    { n: "FC Nantes", k: /\bnantes\b|\bcanaris\b/, a: "**FC Nantes** – Nantes\n- Fondé en **1943**\n- Stade : **Stade de la Beaujoire**\n- Surnom : les Canaris\n- Palmarès : **8 titres de champion de France**, 4 Coupes de France (dont 2022). Célèbre pour son « jeu à la nantaise ». Relégué en Ligue 2 en 2026." },
    { n: "Girondins de Bordeaux", k: /\bbordeaux\b|\bgirondins\b/, a: "**Girondins de Bordeaux** – Bordeaux\n- Fondé en **1881**\n- Stade : **Matmut Atlantique**\n- Palmarès : **6 titres de champion de France** (dernier en 2009), 4 Coupes de France. Le club a été relégué en National 2 en 2024 après de graves difficultés financières." },

    // Premier League
    { n: "Arsenal", k: /\barsenal\b|\bgunners\b/, a: "**Arsenal** – Londres (nord)\n- Fondé en **1886**\n- Stade : **Emirates Stadium**\n- Surnom : les Gunners\n- Palmarès : **14 titres de champion d'Angleterre** (dernier en **2026**), **14 FA Cups** (record). Saison des « **Invincibles** » en 2003-2004 avec Arsène Wenger (aucune défaite). Finaliste de la Ligue des champions 2006 et 2026." },
    { n: "Brighton", k: /\bbrighton\b|\bseagulls\b/, a: "**Brighton & Hove Albion** – Brighton\n- Fondé en **1901**\n- Stade : **Amex Stadium**\n- Surnom : les Seagulls\n- Club réputé pour son recrutement malin ; première qualification européenne en 2023." },
    { n: "Manchester City", k: /\bmanchester city\b|\bman city\b|\bcitizens\b/, a: "**Manchester City** – Manchester\n- Fondé en **1880**\n- Stade : **Etihad Stadium**\n- Surnom : les Citizens\n- Palmarès : **10 titres de champion d'Angleterre** (dont 4 d'affilée de 2021 à 2024, record), **1 Ligue des champions (2023**, avec un triplé), FA Cup et Coupe de la Ligue 2026. Entraîneur de 2016 à 2026 : Pep Guardiola." },
    { n: "Liverpool", k: /\bliverpool\b|\blfc\b/, a: "**Liverpool FC** – Liverpool\n- Fondé en **1892**\n- Stade : **Anfield**\n- Surnom : les Reds\n- Hymne : « You'll Never Walk Alone »\n- Palmarès : **20 titres de champion d'Angleterre** (record partagé avec Manchester United, dernier en 2025), **6 Ligues des champions** (record anglais : 1977, 1978, 1981, 1984, 2005, 2019)." },
    { n: "Chelsea", k: /\bchelsea\b/, a: "**Chelsea FC** – Londres (ouest)\n- Fondé en **1905**\n- Stade : **Stamford Bridge**\n- Surnom : les Blues\n- Palmarès : **6 titres de champion d'Angleterre**, **2 Ligues des champions** (2012, 2021), Ligue Conférence 2025 et **Coupe du monde des clubs 2025** (3-0 contre le PSG)." },
    { n: "Everton", k: /\beverton\b|\btoffees\b/, a: "**Everton FC** – Liverpool\n- Fondé en **1878**\n- Stade : **Hill Dickinson Stadium** depuis 2025 (après 133 ans à Goodison Park)\n- Surnom : les Toffees\n- Palmarès : **9 titres de champion d'Angleterre**, 5 FA Cups, 1 Coupe des coupes (1985)." },
    { n: "Bournemouth", k: /\bbournemouth\b|\bcherries\b/, a: "**AFC Bournemouth** – Bournemouth\n- Fondé en **1899**\n- Stade : **Vitality Stadium** (Dean Court), l'un des plus petits de Premier League\n- Surnom : les Cherries." },
    { n: "Brentford", k: /\bbrentford\b|\bthe bees\b/, a: "**Brentford FC** – Londres (ouest)\n- Fondé en **1889**\n- Stade : **Gtech Community Stadium**\n- Surnom : les Bees\n- Club connu pour son utilisation des statistiques dans le recrutement." },
    { n: "Leeds United", k: /\bleeds\b/, a: "**Leeds United** – Leeds\n- Fondé en **1919**\n- Stade : **Elland Road**\n- Palmarès : **3 titres de champion d'Angleterre** (1969, 1974, 1992, ce dernier avec Éric Cantona), finaliste de la Coupe des clubs champions 1975." },
    { n: "Aston Villa", k: /\baston villa\b|\bvillans\b/, a: "**Aston Villa** – Birmingham\n- Fondé en **1874**\n- Stade : **Villa Park**\n- Palmarès : **7 titres de champion d'Angleterre**, **1 Coupe des clubs champions (1982)**, 7 FA Cups, **Ligue Europa 2026** (3-0 contre Fribourg)." },
    { n: "Tottenham", k: /\btottenham\b|\bspurs\b/, a: "**Tottenham Hotspur** – Londres (nord)\n- Fondé en **1882**\n- Stade : **Tottenham Hotspur Stadium**\n- Surnom : les Spurs\n- Palmarès : **2 titres de champion** (1951, 1961), 8 FA Cups, 3 Coupes UEFA / Ligue Europa (1972, 1984, **2025**), finaliste de la Ligue des champions 2019." },
    { n: "Newcastle United", k: /\bnewcastle\b|\bmagpies\b/, a: "**Newcastle United** – Newcastle\n- Fondé en **1892**\n- Stade : **St James' Park**\n- Surnom : les Magpies\n- Palmarès : **4 titres de champion d'Angleterre** (le dernier en 1927), 6 FA Cups, **Coupe de la Ligue 2025** (1er trophée national depuis 1955)." },
    { n: "Hull City", k: /\bhull\b/, a: "**Hull City** – Hull\n- Fondé en **1904**\n- Stade : **MKM Stadium**\n- Surnom : les Tigers\n- Finaliste de la FA Cup 2014." },
    { n: "Ipswich Town", k: /\bipswich\b/, a: "**Ipswich Town** – Ipswich\n- Fondé en **1878**\n- Stade : **Portman Road**\n- Palmarès : **1 titre de champion (1962)** avec Alf Ramsey, futur sélectionneur champion du monde 1966, et 1 Coupe UEFA (1981)." },
    { n: "Fulham", k: /\bfulham\b|\bcottagers\b/, a: "**Fulham FC** – Londres (ouest)\n- Fondé en **1879** : le plus ancien club professionnel de Londres\n- Stade : **Craven Cottage**, au bord de la Tamise\n- Finaliste de la Ligue Europa 2010." },
    { n: "Nottingham Forest", k: /\bnottingham\b|\bforest\b/, a: "**Nottingham Forest** – Nottingham\n- Fondé en **1865**\n- Stade : **City Ground**\n- Palmarès : **1 titre de champion (1978)** et **2 Coupes des clubs champions d'affilée (1979, 1980)** avec Brian Clough, un exploit unique pour un club de cette taille." },
    { n: "Coventry City", k: /\bcoventry\b/, a: "**Coventry City** – Coventry\n- Fondé en **1883**\n- Stade : **Coventry Building Society Arena**\n- Surnom : les Sky Blues\n- Palmarès : 1 FA Cup (1987)." },
    { n: "Manchester United", k: /\bmanchester united\b|\bman united\b|\bman utd\b|\bred devils\b|\bmu\b/, a: "**Manchester United** – Manchester\n- Fondé en **1878**\n- Stade : **Old Trafford** (« le Théâtre des rêves »)\n- Surnom : les Red Devils\n- Palmarès : **20 titres de champion d'Angleterre**, 13 FA Cups, **3 Ligues des champions** (1968, 1999, 2008). 13 titres sous Sir Alex Ferguson (1986-2013)." },
    { n: "Sunderland", k: /\bsunderland\b|\bblack cats\b/, a: "**Sunderland AFC** – Sunderland\n- Fondé en **1879**\n- Stade : **Stadium of Light**\n- Surnom : les Black Cats\n- Palmarès : **6 titres de champion d'Angleterre** (le dernier en 1936), 2 FA Cups." },
    { n: "Crystal Palace", k: /\bcrystal palace\b|\bpalace\b|\beagles\b/, a: "**Crystal Palace** – Londres (sud)\n- Fondé en **1905**\n- Stade : **Selhurst Park**\n- Surnom : les Eagles\n- Palmarès : **FA Cup 2025** (1-0 contre Manchester City), premier trophée majeur de son histoire, puis **Ligue Conférence 2026** (1-0 contre le Rayo Vallecano)." },

    // Liga
    { n: "FC Barcelone", k: /\bbarca\b|\bbarcelone\b|\bbarcelona\b|\bblaugrana\b/, a: "**FC Barcelone** – Barcelone\n- Fondé en **1899**\n- Stade : **Spotify Camp Nou** (le plus grand stade d'Europe)\n- Surnom : le Barça, les Blaugrana\n- Devise : « Més que un club » (Plus qu'un club)\n- Palmarès : **29 titres de champion d'Espagne** (dont 2025 et 2026), **32 Coupes du Roi** (record), **5 Ligues des champions** (1992, 2006, 2009, 2011, 2015). Messi y a passé 17 saisons." },
    { n: "Real Madrid", k: /\breal madrid\b|\breal\b(?! sociedad| betis)|\bmerengues?\b/, a: "**Real Madrid** – Madrid\n- Fondé en **1902**\n- Stade : **Santiago Bernabéu**\n- Surnom : les Merengues\n- Palmarès : **36 titres de champion d'Espagne** (record), **15 Ligues des champions** (record absolu, dont les 5 premières de 1956 à 1960 et 3 d'affilée de 2016 à 2018)." },
    { n: "Atlético Madrid", k: /\batletico\b|\batleti\b|\bcolchoneros\b/, a: "**Atlético Madrid** – Madrid\n- Fondé en **1903**\n- Stade : **Riyadh Air Metropolitano**\n- Surnom : les Colchoneros\n- Palmarès : **11 titres de champion d'Espagne** (dernier en 2021), 3 Ligues Europa, finaliste de la Ligue des champions 1974, 2014 et 2016. Entraîneur emblématique : Diego Simeone (depuis 2011)." },
    { n: "Real Betis", k: /\bbetis\b/, a: "**Real Betis** – Séville\n- Fondé en **1907**\n- Stade : **Benito Villamarín** (en travaux : le club joue à l'Estadio de La Cartuja en attendant)\n- Palmarès : **1 titre de champion d'Espagne (1935)**, 3 Coupes du Roi (dont 2022), finaliste de la Ligue Conférence 2025." },
    { n: "Real Sociedad", k: /\breal sociedad\b|\bla real\b/, a: "**Real Sociedad** – Saint-Sébastien (Pays basque)\n- Fondé en **1909**\n- Stade : **Reale Arena (Anoeta)**\n- Palmarès : **2 titres de champion d'Espagne** (1981, 1982), Coupes du Roi dont 2020 et **2026**." },
    { n: "Séville FC", k: /\bseville\b|\bsevilla\b/, a: "**Séville FC** – Séville\n- Fondé en **1890**\n- Stade : **Ramón Sánchez-Pizjuán**\n- Palmarès : **1 titre de champion d'Espagne (1946)**, et surtout **7 Coupes UEFA / Ligues Europa** (record : 2006, 2007, 2014, 2015, 2016, 2020, 2023)." },
    { n: "Athletic Bilbao", k: /\bathletic\b|\bbilbao\b/, a: "**Athletic Club** (Bilbao) – Bilbao (Pays basque)\n- Fondé en **1898**\n- Stade : **San Mamés**\n- Particularité : ne fait jouer que des **joueurs basques** ou formés au Pays basque\n- Palmarès : **8 titres de champion d'Espagne**, 24 Coupes du Roi (dont 2024). Avec le Real et le Barça, jamais relégué de Liga." },
    { n: "Villarreal", k: /\bvillarreal\b|\bsous marin jaune\b/, a: "**Villarreal CF** – Villarreal\n- Fondé en **1923**\n- Stade : **Estadio de la Cerámica**\n- Surnom : le « Sous-marin jaune »\n- Palmarès : **Ligue Europa 2021** (contre Manchester United aux tirs au but)." },
    { n: "Deportivo La Corogne", k: /\bdeportivo\b|\bla corogne\b|\bcoruna\b|\bdepor\b/, a: "**Deportivo La Corogne** – La Corogne (Galice)\n- Fondé en **1906**\n- Stade : **Riazor**\n- Palmarès : **1 titre de champion d'Espagne (2000)**, 2 Coupes du Roi. Demi-finaliste de la Ligue des champions 2004." },
    { n: "Racing Santander", k: /\bracing santander\b|\bsantander\b/, a: "**Racing de Santander** – Santander\n- Fondé en **1913**\n- Stade : **El Sardinero**\n- Membre fondateur de la Liga en 1929." },
    { n: "Celta Vigo", k: /\bcelta\b|\bvigo\b/, a: "**Celta de Vigo** – Vigo (Galice)\n- Fondé en **1923**\n- Stade : **Balaídos**\n- Demi-finaliste de la Ligue Europa 2017." },
    { n: "Alavés", k: /\balaves\b/, a: "**Deportivo Alavés** – Vitoria-Gasteiz (Pays basque)\n- Fondé en **1921**\n- Stade : **Mendizorroza**\n- Finaliste de la Coupe UEFA 2001, perdue 5-4 contre Liverpool au but en or." },
    { n: "Espanyol", k: /\bespanyol\b/, a: "**RCD Espanyol** – Barcelone (stade à Cornellà)\n- Fondé en **1900**\n- Stade : **RCDE Stadium**\n- Palmarès : 4 Coupes du Roi, finaliste de la Coupe UEFA 1988 et 2007." },
    { n: "Rayo Vallecano", k: /\brayo\b|\bvallecano\b/, a: "**Rayo Vallecano** – Madrid (quartier de Vallecas)\n- Fondé en **1924**\n- Stade : **Estadio de Vallecas**\n- Club populaire de quartier, réputé pour ses supporters. Finaliste de la Ligue Conférence 2026." },
    { n: "Getafe", k: /\bgetafe\b/, a: "**Getafe CF** – Getafe (banlieue de Madrid)\n- Fondé en **1983**\n- Stade : **Coliseum**\n- Finaliste de la Coupe du Roi 2007 et 2008." },
    { n: "Osasuna", k: /\bosasuna\b/, a: "**CA Osasuna** – Pampelune (Navarre)\n- Fondé en **1920**\n- Stade : **El Sadar**\n- Finaliste de la Coupe du Roi 2005 et 2023." },
    { n: "Levante", k: /\blevante\b/, a: "**Levante UD** – Valence\n- Fondé en **1909**\n- Stade : **Ciutat de València**\n- Le « petit » voisin du Valence CF." },
    { n: "Elche", k: /\belche\b/, a: "**Elche CF** – Elche\n- Fondé en **1923**\n- Stade : **Martínez Valero**." },
    { n: "Valence CF", k: /\bvalence\b|\bvalencia\b/, a: "**Valence CF** – Valence\n- Fondé en **1919**\n- Stade : **Mestalla** (un nouveau stade est en construction)\n- Palmarès : **6 titres de champion d'Espagne** (dernier en 2004), 8 Coupes du Roi, Coupe UEFA 2004, finaliste de la Ligue des champions **2000 et 2001**." },
    { n: "Málaga", k: /\bmalaga\b/, a: "**Málaga CF** – Málaga\n- Fondé en **1994** (successeur du CD Málaga)\n- Stade : **La Rosaleda**\n- Quart de finaliste de la Ligue des champions 2013." },

    // Bundesliga
    { n: "Bayern Munich", k: /\bbayern\b|\bfcb munich\b/, a: "**FC Bayern Munich** – Munich\n- Fondé en **1900**\n- Stade : **Allianz Arena**\n- Palmarès : **35 titres de champion d'Allemagne** (record, dont 11 d'affilée de 2013 à 2023), **21 Coupes d'Allemagne** (record), **6 Ligues des champions** (1974, 1975, 1976, 2001, 2013, 2020). Triplés en 2013 et 2020." },
    { n: "Borussia Dortmund", k: /\bdortmund\b|\bbvb\b|\bborussia dortmund\b/, a: "**Borussia Dortmund** – Dortmund\n- Fondé en **1909**\n- Stade : **Signal Iduna Park** (Westfalenstadion), le plus grand d'Allemagne, avec son « Mur jaune »\n- Palmarès : **8 titres de champion d'Allemagne**, 5 Coupes d'Allemagne, **1 Ligue des champions (1997)**, finaliste en 2013 et 2024." },
    { n: "SC Fribourg", k: /\bfribourg\b|\bfreiburg\b/, a: "**SC Fribourg** – Fribourg-en-Brisgau\n- Fondé en **1904**\n- Stade : **Europa-Park Stadion**\n- Club réputé pour sa stabilité (Christian Streich entraîneur de 2011 à 2024). Finaliste de la Ligue Europa 2026." },
    { n: "RB Leipzig", k: /\bleipzig\b|\brb leipzig\b/, a: "**RB Leipzig** – Leipzig\n- Fondé en **2009** (par Red Bull)\n- Stade : **Red Bull Arena**\n- Palmarès : **2 Coupes d'Allemagne** (2022, 2023). Demi-finaliste de la Ligue des champions 2020." },
    { n: "Bayer Leverkusen", k: /\bleverkusen\b|\bbayer\b|\bwerkself\b/, a: "**Bayer Leverkusen** – Leverkusen\n- Fondé en **1904** (club de l'entreprise Bayer)\n- Stade : **BayArena**\n- Palmarès : **1 titre de champion (2024), invaincu toute la saison** avec Xabi Alonso, 2 Coupes d'Allemagne (1993, 2024), Coupe UEFA 1988, finaliste de la Ligue des champions 2002." },
    { n: "Werder Brême", k: /\bwerder\b|\bbreme\b|\bbremen\b/, a: "**Werder Brême** – Brême\n- Fondé en **1899**\n- Stade : **Weserstadion**\n- Palmarès : **4 titres de champion d'Allemagne** (dernier en 2004), 6 Coupes d'Allemagne, 1 Coupe des coupes (1992)." },
    { n: "SV Elversberg", k: /\belversberg\b/, a: "**SV Elversberg** – Spiesen-Elversberg (Sarre)\n- Fondé en **1907**\n- Stade : **Waldstadion an der Kaiserlinde**\n- Un tout petit club de village, monté jusqu'en Bundesliga après plusieurs montées successives." },
    { n: "VfB Stuttgart", k: /\bstuttgart\b|\bvfb\b/, a: "**VfB Stuttgart** – Stuttgart\n- Fondé en **1893**\n- Stade : **MHPArena**\n- Palmarès : **5 titres de champion d'Allemagne** (dernier en 2007), 4 Coupes d'Allemagne (dont **2025**). Vice-champion 2024." },
    { n: "TSG Hoffenheim", k: /\bhoffenheim\b/, a: "**TSG Hoffenheim** – Sinsheim\n- Fondé en **1899**\n- Stade : **PreZero Arena**\n- Club de village monté de la 5e division à la Bundesliga (2008) avec le soutien de Dietmar Hopp (SAP)." },
    { n: "Eintracht Francfort", k: /\bfrancfort\b|\bfrankfurt\b|\beintracht\b/, a: "**Eintracht Francfort** – Francfort\n- Fondé en **1899**\n- Stade : **Deutsche Bank Park** (Waldstadion)\n- Palmarès : **1 titre de champion (1959)**, 5 Coupes d'Allemagne, Coupe UEFA 1980 et **Ligue Europa 2022**. Finaliste de la Coupe des clubs champions 1960." },
    { n: "Hambourg SV", k: /\bhambourg\b|\bhamburg\b|\bhsv\b/, a: "**Hambourg SV** – Hambourg\n- Fondé en **1887**\n- Stade : **Volksparkstadion**\n- Palmarès : **6 titres de champion d'Allemagne**, **1 Coupe des clubs champions (1983)**, 1 Coupe des coupes (1977). Relégué pour la première fois en 2018, puis remonté." },
    { n: "Mayence 05", k: /\bmayence\b|\bmainz\b/, a: "**FSV Mayence 05** – Mayence\n- Fondé en **1905**\n- Stade : **Mewa Arena**\n- Club où ont débuté comme entraîneurs Jürgen Klopp et Thomas Tuchel." },
    { n: "SC Paderborn", k: /\bpaderborn\b/, a: "**SC Paderborn 07** – Paderborn\n- Stade : **Home Deluxe Arena**\n- Petit club habitué aux montées et descentes entre la 2. Bundesliga et la Bundesliga." },
    { n: "FC Augsbourg", k: /\baugsbourg\b|\baugsburg\b/, a: "**FC Augsbourg** – Augsbourg\n- Fondé en **1907**\n- Stade : **WWK Arena**\n- En Bundesliga sans interruption depuis 2011." },
    { n: "FC Cologne", k: /\bcologne\b|\bkoln\b|\beffzeh\b/, a: "**1. FC Cologne** – Cologne\n- Fondé en **1948**\n- Stade : **RheinEnergieStadion**\n- Mascotte : le bouc Hennes\n- Palmarès : **3 titres de champion d'Allemagne** (1962, 1964, 1978 ; premier champion de la Bundesliga en 1964), 4 Coupes d'Allemagne." },
    { n: "Union Berlin", k: /\bunion berlin\b/, a: "**1. FC Union Berlin** – Berlin (est)\n- Fondé en **1966**\n- Stade : **Stadion An der Alten Försterei**, rénové par les supporters eux-mêmes\n- A disputé la Ligue des champions en 2023-2024." },
    { n: "Schalke 04", k: /\bschalke\b|\bs04\b|\bknappen\b/, a: "**FC Schalke 04** – Gelsenkirchen\n- Fondé en **1904**\n- Stade : **Veltins-Arena**\n- Surnom : les Knappen (mineurs)\n- Palmarès : **7 titres de champion d'Allemagne** (dernier en 1958), 5 Coupes d'Allemagne, Coupe UEFA 1997." },
    { n: "Borussia Mönchengladbach", k: /\bmonchengladbach\b|\bgladbach\b|\bmoenchengladbach\b/, a: "**Borussia Mönchengladbach** – Mönchengladbach\n- Fondé en **1900**\n- Stade : **Borussia-Park**\n- Surnom : les Poulains\n- Palmarès : **5 titres de champion d'Allemagne** (années 1970), 3 Coupes d'Allemagne, 2 Coupes UEFA (1975, 1979)." },

    // Serie A
    { n: "Lazio", k: /\blazio\b/, a: "**SS Lazio** – Rome\n- Fondé en **1900**\n- Stade : **Stadio Olimpico** (partagé avec l'AS Rome)\n- Surnom : les Biancocelesti\n- Palmarès : **2 titres de champion d'Italie** (1974, 2000), 7 Coupes d'Italie, 1 Coupe des coupes (1999)." },
    { n: "Inter Milan", k: /\binter\b(?! miami)|\binternazionale\b|\bnerazzurri\b/, a: "**Inter Milan** – Milan\n- Fondé en **1908**\n- Stade : **San Siro (Giuseppe-Meazza)**, partagé avec le Milan AC\n- Surnom : les Nerazzurri\n- Palmarès : **21 titres de champion d'Italie** (dont 2026), 10 Coupes d'Italie (dont 2026), **3 Ligues des champions** (1964, 1965, 2010 avec un triplé). Seul club italien jamais relégué." },
    { n: "AS Rome", k: /\bas rome\b|\broma\b|\brome\b|\bgiallorossi\b/, a: "**AS Rome** – Rome\n- Fondé en **1927**\n- Stade : **Stadio Olimpico**\n- Surnom : les Giallorossi\n- Palmarès : **3 titres de champion d'Italie** (1942, 1983, 2001), 9 Coupes d'Italie, **Ligue Conférence 2022** avec Mourinho. Légende : Francesco Totti, 25 saisons au club." },
    { n: "AC Milan", k: /\bac milan\b|\bmilan ac\b|\brossoneri\b|(?<!inter )\bmilan\b/, a: "**AC Milan** – Milan\n- Fondé en **1899**\n- Stade : **San Siro (Giuseppe-Meazza)**\n- Surnom : les Rossoneri\n- Palmarès : **19 titres de champion d'Italie**, **7 Coupes des clubs champions / Ligues des champions** (2e après le Real Madrid : 1963, 1969, 1989, 1990, 1994, 2003, 2007)." },
    { n: "Côme", k: /\bcome\b|\bcomo\b/, a: "**Côme 1907** – Côme (au bord du lac de Côme)\n- Fondé en **1907**\n- Stade : **Stadio Giuseppe-Sinigaglia**\n- Remonté en Serie A en 2024, avec Cesc Fàbregas comme entraîneur." },
    { n: "Frosinone", k: /\bfrosinone\b/, a: "**Frosinone Calcio** – Frosinone (Latium)\n- Stade : **Stadio Benito-Stirpe**\n- Petit club habitué aux allers-retours entre la Serie B et la Serie A." },
    { n: "Juventus", k: /\bjuventus\b|\bjuve\b|\bbianconeri\b|\bvieille dame\b/, a: "**Juventus** – Turin\n- Fondé en **1897**\n- Stade : **Allianz Stadium**\n- Surnom : la Vieille Dame, les Bianconeri\n- Palmarès : **36 titres de champion d'Italie** (record, dont 9 d'affilée de 2012 à 2020), **15 Coupes d'Italie** (record), **2 Ligues des champions** (1985, 1996). Club de Platini, Zidane, Del Piero, Buffon." },
    { n: "Bologne", k: /\bbologne\b|\bbologna\b/, a: "**Bologna FC** – Bologne\n- Fondé en **1909**\n- Stade : **Stadio Renato-Dall'Ara**\n- Palmarès : **7 titres de champion d'Italie** (dernier en 1964), **Coupe d'Italie 2025**. A disputé la Ligue des champions en 2024-2025." },
    { n: "Cagliari", k: /\bcagliari\b/, a: "**Cagliari Calcio** – Cagliari (Sardaigne)\n- Fondé en **1920**\n- Stade : **Unipol Domus**\n- Palmarès : **1 titre de champion d'Italie (1970)**, avec la légende Gigi Riva." },
    { n: "Naples", k: /\bnaples\b|\bnapoli\b|\bpartenopei\b/, a: "**SSC Naples** – Naples\n- Fondé en **1926**\n- Stade : **Stadio Diego-Armando-Maradona**\n- Palmarès : **4 titres de champion d'Italie** (1987 et 1990 avec Maradona, 2023, 2025), 6 Coupes d'Italie, Coupe UEFA 1989." },
    { n: "Torino", k: /\btorino\b|\bgranata\b/, a: "**Torino FC** – Turin\n- Fondé en **1906**\n- Stade : **Stadio Olimpico Grande Torino**\n- Surnom : les Granata\n- Palmarès : **7 titres de champion d'Italie**. Le « Grande Torino », meilleure équipe des années 1940, a disparu dans l'accident d'avion de **Superga** en 1949." },
    { n: "Atalanta", k: /\batalanta\b|\bbergame\b|\bdea\b/, a: "**Atalanta** – Bergame\n- Fondé en **1907**\n- Stade : **New Balance Arena** (ex-Gewiss Stadium)\n- Surnom : la Dea (la Déesse)\n- Palmarès : **Ligue Europa 2024** (3-0 contre Leverkusen), Coupe d'Italie 1963. Club transformé par Gian Piero Gasperini (2016-2025)." },
    { n: "Genoa", k: /\bgenes\b|\bgenoa\b/, a: "**Genoa CFC** – Gênes\n- Fondé en **1893** : **le plus ancien club de football d'Italie**\n- Stade : **Stadio Luigi-Ferraris**\n- Palmarès : **9 titres de champion d'Italie** (tous avant 1925)." },
    { n: "Lecce", k: /\blecce\b/, a: "**US Lecce** – Lecce (Pouilles)\n- Fondé en **1908**\n- Stade : **Stadio Via del Mare**." },
    { n: "Fiorentina", k: /\bfiorentina\b|\bviola\b|\bflorence\b/, a: "**ACF Fiorentina** – Florence\n- Fondé en **1926**\n- Stade : **Stadio Artemio-Franchi**\n- Surnom : la Viola\n- Palmarès : **2 titres de champion d'Italie** (1956, 1969), 6 Coupes d'Italie, Coupe des coupes 1961, finaliste de la Ligue Conférence 2023 et 2024." },
    { n: "Parme", k: /\bparme\b|\bparma\b/, a: "**Parma Calcio** – Parme\n- Fondé en **1913**\n- Stade : **Stadio Ennio-Tardini**\n- Palmarès : 2 Coupes UEFA (1995, 1999), 1 Coupe des coupes (1993), 3 Coupes d'Italie. Grande équipe des années 1990 (Buffon, Cannavaro, Thuram)." },
    { n: "Sassuolo", k: /\bsassuolo\b/, a: "**US Sassuolo** – Sassuolo (Émilie-Romagne)\n- Fondé en **1920**\n- Stade : **Mapei Stadium** (à Reggio d'Émilie)\n- Petit club soutenu par l'entreprise Mapei, en Serie A depuis 2013 (avec une saison en Serie B)." },
    { n: "Monza", k: /\bmonza\b/, a: "**AC Monza** – Monza (Lombardie)\n- Fondé en **1912**\n- Stade : **U-Power Stadium**\n- Première montée en Serie A de son histoire en 2022, sous la présidence de Silvio Berlusconi." },
    { n: "Venise", k: /\bvenise\b|\bvenezia\b/, a: "**Venezia FC** – Venise\n- Fondé en **1907**\n- Stade : **Stadio Pier Luigi-Penzo**, accessible en bateau\n- Palmarès : 1 Coupe d'Italie (1941). Maillots parmi les plus appréciés au monde." },
    { n: "Udinese", k: /\budinese\b|\budine\b/, a: "**Udinese Calcio** – Udine (Frioul)\n- Fondé en **1896**\n- Stade : **Bluenergy Stadium** (ex-Stadio Friuli)\n- Club réputé pour son réseau de recrutement international." },

    // Autres clubs célèbres
    { n: "Ajax Amsterdam", k: /\bajax\b/, a: "**Ajax Amsterdam** – Amsterdam (Pays-Bas)\n- Fondé en **1900**\n- Stade : **Johan Cruyff Arena**\n- Palmarès : **36 titres de champion des Pays-Bas** (record), **4 Coupes des clubs champions / Ligues des champions** (1971, 1972, 1973, 1995). Centre de formation légendaire." },
    { n: "Benfica", k: /\bbenfica\b/, a: "**SL Benfica** – Lisbonne (Portugal)\n- Fondé en **1904**\n- Stade : **Estádio da Luz**\n- Palmarès : **38 titres de champion du Portugal** (record), **2 Coupes des clubs champions** (1961, 1962) avec Eusébio." },
    { n: "FC Porto", k: /\bporto\b/, a: "**FC Porto** – Porto (Portugal)\n- Fondé en **1893**\n- Stade : **Estádio do Dragão**\n- Palmarès : **30 titres de champion du Portugal**, **2 Ligues des champions** (1987, 2004 avec Mourinho), 2 Coupes UEFA / Ligues Europa (2003, 2011)." },
    { n: "Celtic Glasgow", k: /\bceltic\b/, a: "**Celtic FC** – Glasgow (Écosse)\n- Fondé en **1887**\n- Stade : **Celtic Park**\n- Palmarès : **plus de 50 titres de champion d'Écosse**, **Coupe des clubs champions 1967** (les « Lions de Lisbonne », premier club britannique champion d'Europe). Grand rival : les Rangers (« Old Firm »)." },
  ],
};
