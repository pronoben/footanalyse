/* =========================================================
   CHATBOT – AIGUILLAGE ET PRÉCISION
   ---------------------------------------------------------
   Passe AVANT les autres moteurs (LocalBot.reply) pour :
   1. corriger les fautes de frappe (« clasement », « mbape »),
   2. répondre poliment (bonjour, merci, qui es-tu…),
   3. dire honnêtement ce que le site ne sait pas (scores déjà
      joués, salaires, diffusion TV…) au lieu de répondre à côté,
   4. répondre aux questions d'avis (meilleur joueur du monde…),
   5. calendrier (« quand joue l'OM ? »), points, relégation,
   6. effectifs : entraîneur, capitaine, gardien, numéros, président,
   7. blessures d'un joueur (« Mbappé est-il blessé ? »),
   8. comparer deux joueurs de championnats différents.
   Et APRÈS les autres moteurs (fallback) : question hors foot ou
   incomprise -> réponse claire, jamais une réponse hors sujet.
   ========================================================= */

const ChatRouter = (() => {
  const clean = s => " " + String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ø/g, "o").replace(/æ/g, "ae").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim() + " ";
  const has = (q, re) => re.test(q);
  const P = x => Math.round(x * 100) + " %";

  // ---------- Équipes de tous les championnats ----------
  function teamsAll(question) {
    if (typeof LocalBot === "undefined") return [];
    const out = [];
    const order = [CURRENT_LEAGUE.id, ...LEAGUE_ORDER.filter(id => id !== CURRENT_LEAGUE.id)];
    order.forEach(lg => LocalBot.findTeams(question, LEAGUES[lg].teams).forEach(id => {
      if (!out.some(t => t.lg === lg && t.id === id)) out.push({ lg, id });
    }));
    return out;
  }
  const teamName = (lg, id) => (LEAGUES[lg].teams.find(t => t.id === id) || {}).name || id;
  function inLeague(lg, fn) {
    const cur = CURRENT_LEAGUE.id;
    if (lg === cur) return fn();
    setLeague(lg);
    try { return fn(); } finally { setLeague(cur); }
  }
  const showLeague = lg => {
    if (lg !== CURRENT_LEAGUE.id && typeof switchLeague === "function") switchLeague(lg, { keepView: true });
  };

  // ---------- 1. Fautes de frappe ----------
  const COMMON = new Set(("bonjour salut merci comment combien pourquoi quand quelle quelles quels quel est ce que qui quoi " +
    "avec pour dans entre contre depuis apres avant pendant toujours jamais encore aussi alors donc mais parce " +
    "match matchs joueur joueurs equipe equipes saison journee semaine weekend demain aujourd hier soir ce cette ces " +
    "meilleur meilleure meilleurs pire premier premiere dernier derniere prochain prochaine actuel actuelle " +
    "gagner gagne gagnera perdre perdu marquer marque marques buts but passe passes points place classe " +
    "classement championnat ligue coupe monde europe champions ballon stade club clubs carriere selection " +
    "selections entraineur capitaine gardien defenseur milieu attaquant ailier effectif compo composition " +
    "absent absents blesse blesses blessure suspendu pronostic prono analyse stats statistiques historique " +
    "palmares titre titres trophee vainqueur finale score resultat resultats transfert mercato salaire " +
    "francais france anglais espagnol italien allemand plus moins beaucoup combien quelqu chose personne " +
    "maintenant encore numero maillot taille poids naissance president proprietaire regle regles arbitre " +
    "explique expliquer definition signifie veut dire raconte donne montre liste parle connais sais peux " +
    "fais faire etre avoir est sont etait sera serait fait faut peut veux voudrais aimerais " +
    "equipe nationale bleus sport football foot soccer serre serres ouvert ouverts equilibre incertain indecis " +
    "favori favoris favorite banker probable probables valeur offensif offensive spectacle prolifique attaque defense " +
    "encaisse encaisses leader podium relegation programme calendrier compos onze titulaire titulaires alignement " +
    "suspendus forfait indisponible infirmerie nombre exact exacte scores position bilan forme victoire victoires " +
    "defaite defaites chance chances perdu analyser pronostics tableau semaine heures minute minutes mieux meilleurs " +
    "grand grande grands petit petite jeune jeunes vieux ancien ancienne nouveau nouvelle belle beau celui celle " +
    "entre autre autres chaque toutes toute tous rien depuis jusqu vraiment surtout seulement environ presque " +
    "europeen europeenne mondial mondiale national nationale finale finales demi quart huitieme groupe groupes " +
    "domicile exterieur visiteur receveur arbitrage carton cartons rouge jaune penalty penaltys corner corners " +
    "serie liga ligue premier league bundesliga champions europa conference coupe monde ballon derby derbys " +
    "anglais espagne italie allemagne angleterre portugal bresil argentine pressing tacle tacles dribble dribbles " +
    "centre centres frappe frappes talonnade panenka lucarne catenaccio gegenpressing possession simulation " +
    "transversale poteau triple double coache coacher entraine capitale pays ville monde histoire").split(" "));
  let VOCAB = null;
  function buildVocab() {
    // mot -> poids (les équipes et mots-clés comptent plus que les noms de joueurs peu connus)
    const words = new Map();
    words.add = w => words.set(w, 1e6);
    const addWords = s => clean(s).trim().split(" ").forEach(w => { if (w.length >= 4) words.add(w); });
    Object.values(LEAGUES).forEach(l => l.teams.forEach(t => { addWords(t.name); (t.aliases || []).forEach(addWords); }));
    if (typeof CareerBot !== "undefined") CareerBot.vocab().forEach(([w, f]) => { if (!words.has(w)) words.set(w, f); });
    if (typeof FOOT_KB !== "undefined") FOOT_KB.people.forEach(p => addWords(p.n));
    // Quelques mots-clés souvent mal tapés (pas de mots courants : « capitale » ne doit pas devenir « capitaine »)
    ["classement", "pronostic", "composition", "carriere", "statistiques", "championnat", "bundesliga"].forEach(w => words.add(w));
    return words;
  }
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let best = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        best = Math.min(best, cur[j]);
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function correct(question) {
    if (!VOCAB || (typeof CareerBot !== "undefined" && CareerBot.count() && VOCAB.size < 3000)) VOCAB = buildVocab();
    const words = clean(question).trim().split(" ");
    let changed = false;
    const fixed = words.map(w => {
      if (w.length < 5 || COMMON.has(w) || VOCAB.has(w) || /\d/.test(w)) return w;
      const sing = w.replace(/(s|x)$/, "");
      if (sing !== w && (COMMON.has(sing) || VOCAB.has(sing))) return w; // pluriel d'un mot connu
      const max = w.length >= 8 ? 2 : 1;
      // Candidats les plus proches ; à égalité, le plus connu, s'il l'est nettement plus
      let bestD = max + 1, cands = [];
      for (const [v, weight] of VOCAB) {
        if (Math.abs(v.length - w.length) > max || v[0] !== w[0]) continue;
        const d = lev(w, v, max);
        if (d < bestD) { bestD = d; cands = [[v, weight]]; } else if (d === bestD) cands.push([v, weight]);
      }
      if (!cands.length || bestD > max) return w;
      cands.sort((a, b) => b[1] - a[1]);
      if (cands.length === 1 || cands[0][1] >= 3 * cands[1][1]) { changed = true; return cands[0][0]; }
      return w;
    });
    return changed ? fixed.join(" ") : null;
  }

  // ---------- 2. Conversation ----------
  const EXAMPLES = "Par exemple :\n- « Qui va gagner Nice – PSG ? »\n- « Classement de la Premier League »\n- « Carrière de Mbappé »\n" +
    "- « Qui a gagné la Coupe du monde 2018 ? »\n- « Qui est l'entraîneur de l'OM ? »\n- « C'est quoi le hors-jeu ? »";
  function smallTalk(q) {
    const words = q.trim().split(" ").length;
    if (words <= 5 && has(q, /^ (bonjour|salut|hello|coucou|bonsoir|hey|yo|wesh|slt|bjr)\b/) && !has(q, /\b(ca va|comment vas)\b/)) {
      return `Salut ! ⚽ Je suis l'assistant foot de FootAnalyse. Je réponds sur les 5 grands championnats (matchs, pronostics, classements, compos, joueurs, carrières) et sur la culture foot (palmarès, règles, légendes).\n${EXAMPLES}`;
    }
    if (words <= 6 && has(q, /\b(ca va|comment vas tu|comment tu vas|la forme)\b/)) return "Ça va très bien, merci ! Prêt à parler foot ⚽ Pose-moi ta question sur un match, un joueur, un club ou un championnat.";
    if (words <= 5 && has(q, /\b(merci|thanks|parfait|super|genial|top|cool|nickel|bien joue|trop bien)\b/)) return "Avec plaisir ! ⚽ N'hésite pas si tu as une autre question sur le foot.";
    if (words <= 5 && has(q, /\b(au revoir|bye|a plus|a bientot|ciao|bonne nuit|bonne soiree)\b/)) return "À bientôt ! ⚽";
    if (has(q, /\btu (aimes|preferes|supportes|es fan|es pour|kiffes)\b|\bton (club|equipe|joueur) prefere\b|\bta (equipe|club) preferee\b/)) {
      return "Je suis un assistant neutre : je n'ai pas d'équipe préférée 😉. Mais je peux te donner les stats, le classement ou un pronostic pour n'importe quel club.";
    }
    if (words <= 4 && has(q, /\b(nul|nulle|naze|bete|idiot|debile|pourri|claque)\b/)) {
      return "Désolé si ma réponse ne t'a pas aidé 🙏. Reformule ta question avec le nom d'un club, d'un joueur ou d'un championnat, et je ferai mieux.";
    }
    if (has(q, /\b(tu es qui|qui es tu|t es qui|c est qui toi|tu t appelles|ton nom|tu es un robot|tu es une ia|que sais tu faire|que peux tu faire|tu sers a quoi|tu fais quoi|aide moi|\baide\b|help)\b/)) {
      const n = typeof CareerBot !== "undefined" && CareerBot.count() ? CareerBot.count() : "plusieurs milliers de";
      return "Je suis l'**assistant foot de FootAnalyse** 🤖⚽. Sans IA payante, je réponds à partir des données du site :\n" +
        "- **Saison en cours** (5 grands championnats) : classements, prochains matchs, pronostics, compos probables, absents, buteurs et passeurs.\n" +
        `- **Joueurs** : carrières de ${n} joueurs (clubs, matchs, buts, sélections, âge, poste).\n` +
        "- **Clubs** : entraîneur, capitaine, effectif, stade, palmarès.\n" +
        "- **Culture foot** : Coupe du monde, Euro, Ligue des champions, Ballon d'Or, règles, tactique, légendes.\n" + EXAMPLES;
    }
    return null;
  }

  // ---------- 3. Ce que le site ne sait pas : on le dit ----------
  function nextMatchLine(lg, id) {
    return inLeague(lg, () => {
      const m = UPCOMING.find(x => x.home === id || x.away === id);
      if (!m) return null;
      const p = Analysis.predict(m.home, m.away);
      return { m, p, text: `**${teamName(lg, m.home)} – ${teamName(lg, m.away)}**, ${fmtDate(m.date)} à ${m.time.replace(":", "h")} (J${m.day})` };
    });
  }
  function honesty(q, question) {
    const teams = teamsAll(question);
    // Scores / résultats déjà joués / direct
    if (has(q, /\b(resultats?|dernier match|derniere rencontre|match d hier|hier soir|qui a marque hier|en direct|en live|score en direct|a gagne hier|a perdu hier|score final)\b/) ||
        (has(q, /\bscore\b/) && !has(q, /\b(probable|exact|prono|pronostic|quel score va|sera)\b/) && has(q, /\b(quel est|c est quoi|combien|du match|de match)\b/))) {
      let extra = "";
      if (teams.length) {
        const nm = nextMatchLine(teams[0].lg, teams[0].id);
        if (nm) extra = `\n\nProchain match de ${teamName(teams[0].lg, teams[0].id)} : ${nm.text}. Score le plus probable selon le modèle : **${nm.p.topScores[0].score}**.`;
      }
      return `Je n'ai pas les **scores des matchs déjà joués** ni le direct : le site connaît le classement (${DATA_INFO.label}) et les prochains matchs.${extra}`;
    }
    if (has(q, /\b(salaire|combien gagne|combien il gagne|valeur marchande|combien vaut|prix de|combien coute|cote de|transfermarkt|clause)\b/)) {
      return "Je n'ai pas les **salaires** ni les **valeurs marchandes** des joueurs (ces chiffres changent souvent et ne sont pas publics de façon fiable). Je peux te donner sa carrière : demande « carrière de … ».";
    }
    if (has(q, /\b(ou regarder|quelle chaine|chaine tele|diffuse|diffusion|streaming|billets?|billetterie|places pour)\b/)) {
      return "Je n'ai pas les infos de **diffusion TV** ni de **billetterie**. Je peux te donner la date et l'heure du prochain match, et un pronostic.";
    }
    if (has(q, /\b(meteo|temps qu il fait|quel temps)\b/)) return "Je n'ai pas la météo, je suis spécialisé dans le foot ⚽.";
    if (has(q, /\b(parier|pari|paris sportifs|parieur|bookmaker|miser|mise|cotes?|winamax|betclic|unibet|ticket gagnant)\b/)) {
      return "Je ne donne **pas de conseils de paris sportifs** : les probabilités du site sont un exercice de statistiques, pas une garantie, et les paris sont interdits aux mineurs. Si tu veux juste l'analyse d'un match, demande par exemple « pronostic PSG OM ».";
    }
    if (has(q, /\b(prochain match|prochains matchs|quand joue|joue quand)\b.*\b(equipe de france|les bleus|selection|bresil|argentine|espagne|angleterre|allemagne|italie|portugal)\b|\b(equipe de france|les bleus)\b.*\b(prochain match|joue quand|quand joue)\b/)) {
      return "Je n'ai pas le **calendrier des sélections nationales**, seulement celui des 5 grands championnats. Pour l'équipe de France, demande-moi son palmarès, ses records ou son sélectionneur.";
    }
    if (has(q, /\b(mercato|transferts?)\b/) && has(q, /\b(va signer|signera|rumeur|cet ete|cet hiver|prochain club|veut partir|interesse)\b/)) {
      return "Je ne suis pas les **rumeurs de transfert**. Je connais les clubs actuels et la carrière des joueurs (« carrière de … »).";
    }
    return null;
  }

  // ---------- 4. Questions d'avis ----------
  function opinions(q) {
    if (has(q, /\bcomment (on )?gagner? un match\b|\bcombien de points (pour )?une victoire\b|\bpoints pour un nul\b|\bsysteme de points\b|\bvictoire rapporte\b|\bcomment (sont|marchent) les points\b/)) {
      return "Pour gagner un match, il faut **marquer plus de buts que l'adversaire** en 90 minutes (plus le temps additionnel). En championnat :\n- **victoire = 3 points**, **nul = 1 point**, **défaite = 0 point** ;\n- à égalité de points, on départage en général à la différence de buts (sauf en Liga et en Serie A, où les confrontations directes passent d'abord).";
    }
    if (has(q, /\b(meilleur|plus grand|plus fort|goat)\b.*\bjoueur\b.*\b(histoire|tous les temps|de tout les temps|all time)\b|\bgoat\b/)) {
      return "C'est une question d'avis, il n'y a pas de réponse officielle. Les noms qui reviennent le plus :\n" +
        "- **Pelé** : seul triple champion du monde (1958, 1962, 1970).\n- **Diego Maradona** : champion du monde 1986, légende de Naples.\n" +
        "- **Lionel Messi** : record de 8 Ballons d'Or, champion du monde 2022.\n- **Cristiano Ronaldo** : 5 Ballons d'Or, meilleur buteur de l'histoire des sélections.\n" +
        "- Et aussi Johan Cruyff, Zinedine Zidane, Franz Beckenbauer, Alfredo Di Stéfano.";
    }
    if (has(q, /\b(meilleur|plus fort)\b.*\bjoueur\b.*\b(du monde|au monde|actuel|actuellement|en ce moment|de la planete)\b/)) {
      return "C'est une question d'avis. Repères objectifs :\n- **Ballon d'Or 2026** : **Harry Kane** (Bayern Munich) ; 2025 : Ousmane Dembélé (PSG).\n" +
        "- Pour cette saison, demande-moi les **meilleurs buteurs** ou les **joueurs les plus décisifs** d'un championnat.";
    }
    if (has(q, /\b(meilleur|plus grand|plus fort)\b.*\bclub\b/) && !has(q, /\b(classement|ligue 1|premier league|liga|serie a|bundesliga)\b/)) {
      return "C'est une question d'avis. Repères :\n- **Real Madrid** : club le plus titré d'Europe (15 Ligues des champions).\n- **PSG** : double vainqueur de la Ligue des champions en titre (2025, 2026).\n- Dans chaque championnat, demande-moi le **classement** pour la saison en cours.";
    }
    if (has(q, /\b(meilleur|plus fort)\b.*\bgardien\b/) && !teamsAll(q).length) {
      return "C'est une question d'avis. Le **trophée Yachine** (remis avec le Ballon d'Or) récompense chaque année le meilleur gardien. Les légendes du poste : Lev Yachine (seul gardien Ballon d'Or, 1963), Dino Zoff, Gianluigi Buffon, Iker Casillas, Manuel Neuer.";
    }
    if (has(q, /\b(qui va gagner|qui gagnera|favori)\b.*\b(ligue des champions|c1|coupe du monde|mondial|euro|ballon d or)\b/)) {
      return "Je ne prédis pas le vainqueur d'une compétition à venir. Repères : la **Ligue des champions** a été gagnée par le **PSG** en 2025 et 2026, la **Coupe du monde 2026** par l'**Espagne**, et le **Ballon d'Or 2026** est revenu à **Harry Kane**.";
    }
    if (has(q, /\bplus grand stade\b|\bstade le plus grand\b/)) {
      return "- **Plus grand stade d'Europe** : le **Camp Nou** (FC Barcelone).\n- **En France** : le **Stade de France** (environ 80 000 places) ; pour un club, l'**Orange Vélodrome** (OM, environ 67 000).\n- **En Allemagne** : le **Signal Iduna Park** de Dortmund, avec son « Mur jaune ».";
    }
    // Vainqueur final d'une compétition en cours
    if (has(q, /\b(qui va gagner|qui sera champion|qui gagnera|favori pour le titre|va etre champion)\b/) &&
        has(q, /\b(ligue 1|premier league|liga|serie a|bundesliga|championnat|le titre)\b/) && !teamsAll(q).length) {
      const lg = (Object.values(FOOT_KB.leagues).find(l => l.re.test(q)) || {});
      const lid = Object.keys(FOOT_KB.leagues).find(k => FOOT_KB.leagues[k] === lg) || CURRENT_LEAGUE.id;
      const leader = inLeague(lid, () => Analysis.standings()[0]);
      return `Je ne prédis pas le champion de fin de saison, mais aujourd'hui **${leader.name}** est en tête de ${LEAGUES[lid].name} avec **${leader.pts} points** (${LEAGUES[lid].info.label}).`;
    }
    return null;
  }

  // ---------- 5. Calendrier, points, relégation ----------
  function scheduleAndTable(q, question) {
    const teams = teamsAll(question);
    if (teams.length && has(q, /\b(quand joue|joue quand|a quelle heure|quelle heure|quel jour|contre qui|prochain match|prochain adversaire|prochaine rencontre|date du prochain|il joue contre|joue contre qui|affronte qui|calendrier)\b/) && teams.length === 1) {
      const t = teams[0];
      const nm = nextMatchLine(t.lg, t.id);
      showLeague(t.lg);
      if (!nm) return `Pas de match programmé pour **${teamName(t.lg, t.id)}** dans les prochains jours.`;
      const fav = nm.p.home >= nm.p.away ? nm.m.home : nm.m.away;
      return `Prochain match de **${teamName(t.lg, t.id)}** : ${nm.text}.\nPronostic : ${teamName(t.lg, nm.m.home)} ${P(nm.p.home)} · nul ${P(nm.p.draw)} · ${teamName(t.lg, nm.m.away)} ${P(nm.p.away)} (favori : **${teamName(t.lg, fav)}**).\n_Horaires susceptibles d'être modifiés._`;
    }
    if (teams.length === 1 && has(q, /\bcombien de points\b|\bnombre de points\b|\bpoints a\b/)) {
      const t = teams[0];
      showLeague(t.lg);
      return inLeague(t.lg, () => {
        const tb = Analysis.standings(), i = tb.findIndex(x => x.id === t.id), r = tb[i];
        const gap = i > 0 ? `, ${tb[0].pts - r.pts} pts derrière ${tb[0].name}` : (tb[1] ? `, ${r.pts - tb[1].pts} pts d'avance sur ${tb[1].name}` : "");
        return `**${r.name}** a **${r.pts} points** : ${i + 1}${i ? "e" : "er"} de ${LEAGUES[t.lg].name} (${r.W}V ${r.D}N ${r.L}D${gap}). _${LEAGUES[t.lg].info.label}._`;
      });
    }
    if (teams.length === 1 && has(q, /\b(combientieme|quelle place|quel rang|quelle position|classe combien|a quelle place|son classement|le classement d|le classement du|le classement de)\b/)) {
      const t = teams[0];
      showLeague(t.lg);
      return inLeague(t.lg, () => {
        const tb = Analysis.standings(), i = tb.findIndex(x => x.id === t.id), r = tb[i];
        return `**${r.name}** est **${i + 1}${i ? "e" : "er"}** de ${LEAGUES[t.lg].name} avec ${r.pts} points (${r.W}V ${r.D}N ${r.L}D, ${r.GF} buts marqués, ${r.GA} encaissés). _${LEAGUES[t.lg].info.label}._`;
      });
    }
    if (!teams.length && has(q, /\b(qui est (1er|premier|en tete|leader)|qui mene|le leader|qui est devant|en tete de)\b/)) {
      const lg = Object.keys(FOOT_KB.leagues).find(k => FOOT_KB.leagues[k].re.test(q));
      if (lg) {
        showLeague(lg);
        return inLeague(lg, () => {
          const tb = Analysis.standings();
          return `**${tb[0].name}** est en tête de **${LEAGUES[lg].name}** avec **${tb[0].pts} points**, devant ${tb[1].name} (${tb[1].pts} pts) et ${tb[2].name} (${tb[2].pts} pts). _${LEAGUES[lg].info.label}._`;
        });
      }
    }
    if (!teams.length && has(q, /\b(qui va descendre|qui descend|releg\w*|zone rouge|derniers? du classement|qui est dernier|lanterne rouge|en danger|maintien|bas du classement|bas de tableau|descendre)\b/)) {
      const lg = Object.keys(FOOT_KB.leagues).find(k => FOOT_KB.leagues[k].re.test(q)) || CURRENT_LEAGUE.id;
      showLeague(lg);
      return inLeague(lg, () => {
        const tb = Analysis.standings(), z = LEAGUES[lg].zones;
        const n = tb.length, releg = z.releg || 0, barr = z.barrage || 0;
        const lines = tb.slice(n - releg - barr - 2).map((t, k) => {
          const pos = n - releg - barr - 2 + k + 1;
          const tag = pos > n - releg ? " 🔴 relégable" : pos > n - releg - barr ? " 🟠 barragiste" : "";
          return `- ${pos}. ${t.name} – ${t.pts} pts${tag}`;
        }).join("\n");
        return `Bas du classement de **${LEAGUES[lg].name}** (${LEAGUES[lg].info.label}) :\n${lines}\n_${releg} descente${releg > 1 ? "s" : ""} directe${releg > 1 ? "s" : ""}${barr ? " + 1 barrage" : ""} en fin de saison. Rien n'est joué : il reste beaucoup de journées._`;
      });
    }
    return null;
  }

  // ---------- 6. Effectifs : entraîneur, capitaine, gardien, numéros ----------
  let CLUB_MAP = null;
  function clubFor(lg, id) {
    if (typeof CareerBot === "undefined" || !CareerBot.clubs().length) return null;
    if (!CLUB_MAP) {
      CLUB_MAP = {};
      CareerBot.clubs().forEach(c => {
        if (!LEAGUES[c.lg]) return;
        const hit = LocalBot.findTeams(c.label, LEAGUES[c.lg].teams)[0] || LocalBot.findTeams(c.t, LEAGUES[c.lg].teams)[0];
        if (hit) CLUB_MAP[`${c.lg}:${hit}`] = c;
      });
    }
    return CLUB_MAP[`${lg}:${id}`] || null;
  }
  const playerName = t => (CareerBot.byTitle(t) || {}).n || t.replace(/\s*\(.*\)$/, "");
  function squadAnswers(q, question) {
    const teams = teamsAll(question);
    if (teams.length !== 1) return null;
    const t = teams[0];
    const wantsCoach = has(q, /\b(entraineur|coach|coache|coachs|entraine|manager|qui dirige|technicien|staff)\b/);
    const wantsPres = has(q, /\b(president|proprietaire|patron du club|dirigeant)\b/);
    const wantsCap = has(q, /\bcapitaine\b|\bbrassard\b/);
    const wantsGK = has(q, /\b(gardien|gardiens|goal|portier)\b/) && !has(q, /\b(compo|composition|titulaire|onze)\b/);
    const wantsSquad = has(q, /\b(effectif|liste des joueurs|tous les joueurs|les joueurs d|les joueurs du|les joueurs de|joueurs de l|squad|attaquants|defenseurs|milieux)\b/);
    const numMatch = q.match(/\b(?:numero|n|maillot|le)\s*(\d{1,2})\b/);
    const wantsNumber = has(q, /\b(numero|maillot)\b/) && numMatch;
    if (!(wantsCoach || wantsPres || wantsCap || wantsGK || wantsSquad || wantsNumber)) return null;
    if (typeof CareerBot !== "undefined" && !CareerBot.count()) return "⏳ Je charge les effectifs… repose ta question dans quelques secondes.";
    const club = clubFor(t.lg, t.id);
    const tn = teamName(t.lg, t.id);
    if (!club) return `Je n'ai pas l'effectif détaillé de **${tn}**.`;
    const src = "\n_Source : page Wikipédia du club._";
    const squad = club.squad.filter(p => !p.loan);
    if (wantsCoach) return club.coach ? `L'entraîneur de **${tn}** est **${club.coach}**.${src}` : `Je n'ai pas le nom de l'entraîneur de **${tn}**.`;
    if (wantsPres) return club.president ? `Le président de **${tn}** est **${club.president}**.${src}` : `Je n'ai pas le nom du président de **${tn}**.`;
    if (wantsCap) {
      const c = squad.find(p => p.cap);
      return c ? `Le capitaine de **${tn}** est **${playerName(c.t)}**${c.no ? ` (n° ${c.no})` : ""}.${src}` : `Je n'ai pas le capitaine de **${tn}** dans mes données.`;
    }
    if (wantsNumber) {
      const n = Number(numMatch[1]);
      const p = squad.find(x => x.no === n);
      return p ? `Le **n° ${n}** de **${tn}** est **${playerName(p.t)}** (${(p.pos || "").toLowerCase()}).${src}` : `Personne ne porte le n° ${n} à **${tn}** dans mes données.`;
    }
    const byPos = pos => squad.filter(p => p.pos === pos).map(p => `${playerName(p.t)}${p.no ? ` (${p.no})` : ""}${p.cap ? " ©" : ""}`);
    if (wantsGK && !wantsSquad) {
      const g = byPos("Gardien");
      const tit = typeof savedLineupFor === "function" ? inLeague(t.lg, () => savedLineupFor(t.id, tn)) : null;
      const starter = tit && tit.lignes && tit.lignes[0] && tit.lignes[0][0] ? tit.lignes[0][0].nom : null;
      return `Gardiens de **${tn}** : ${g.join(", ") || "inconnus"}.` + (starter ? `\nTitulaire probable au prochain match : **${starter}**.` : "") + src;
    }
    const only = has(q, /\battaquants\b/) ? "Attaquant" : has(q, /\bdefenseurs\b/) ? "Défenseur" : has(q, /\bmilieux\b/) ? "Milieu" : null;
    const groups = only ? [only] : ["Gardien", "Défenseur", "Milieu", "Attaquant"];
    const lines = groups.map(g => `- **${g}s** : ${byPos(g).join(", ") || "—"}`).join("\n");
    const loans = club.squad.filter(p => p.loan).map(p => playerName(p.t));
    return `Effectif de **${tn}** (${squad.length} joueurs, numéro entre parenthèses, © = capitaine) :\n${lines}` +
      (club.coach && !only ? `\n- **Entraîneur** : ${club.coach}` : "") + (loans.length && !only ? `\n_Prêtés ailleurs : ${loans.join(", ")}._` : "") + src;
  }

  // ---------- 6 bis. Capacité des stades ----------
  function stadiums(q, question) {
    if (!has(q, /\b(capacite|spectateurs|combien de places|places assises|contient combien|peut accueillir)\b/)) return null;
    let t = teamsAll(question)[0];
    if (!t && typeof FOOT_KB !== "undefined") {
      // Nom du stade cité (« Parc des Princes ») : on retrouve le club grâce aux fiches de l'encyclopédie
      for (const c of FOOT_KB.clubs) {
        const m = c.a.match(/Stade : \*\*([^*]+)\*\*/);
        if (!m) continue;
        const stade = clean(m[1].replace(/\(.*?\)/g, "")).trim();
        const GENERIC = new Set(["stade", "stadium", "stadio", "estadio", "arena", "park", "parc", "orange", "allianz", "community", "building", "society", "olimpico"]);
        const tokens = stade.split(" ").filter(w => w.length >= 7 && !GENERIC.has(w));
        if ((stade.length >= 6 && q.includes(` ${stade} `)) || tokens.some(w => q.includes(` ${w} `))) {
          for (const lg of LEAGUE_ORDER) {
            const team = LEAGUES[lg].teams.find(x => c.k.test(clean(x.name)));
            if (team) { t = { lg, id: team.id }; break; }
          }
          if (t) break;
        }
      }
    }
    if (!t) return null;
    const club = clubFor(t.lg, t.id);
    const tn = teamName(t.lg, t.id);
    return club && club.capacity ? `Le stade de **${tn}** peut accueillir environ **${club.capacity.replace(/,/g, " ")} spectateurs**.\n_Source : page Wikipédia du club._`
      : `Je n'ai pas la capacité du stade de **${tn}**.`;
  }

  // ---------- 7. Blessures d'un joueur (sans club cité) ----------
  function injuries(q, question) {
    if (!has(q, /\b(blesse|blessure|bless|absent|forfait|suspendu|indisponible|infirmerie|incertain|va jouer|jouera|sera la|disponible|apte)\b/)) return null;
    if (teamsAll(question).length) return null; // « absents du PSG » : géré par le moteur des matchs
    if (typeof CareerBot === "undefined") return null;
    const players = CareerBot.find(question);
    if (!players.length) return null;
    const p = players[0];
    const last = clean(p.n).trim().split(" ").pop();
    for (const lg of LEAGUE_ORDER) {
      for (const [id, raw] of Object.entries(LEAGUES[lg].lineups || {})) {
        const hit = (raw.absents || []).find(([nm]) => clean(nm).includes(` ${last} `) || clean(nm).trim() === last);
        if (hit) {
          return `🚑 **${p.n}** (${teamName(lg, id)}) est annoncé **${hit[1].toLowerCase() === "absent" ? "absent" : hit[1].toLowerCase()}** pour le prochain match.\n_Infos du ${(LEAGUES[lg].lineupsInfo || {}).date || SAVED_LINEUPS_INFO.date}, à vérifier avant le match._`;
        }
      }
    }
    const club = p.c ? ` (${p.c})` : "";
    return `✅ **${p.n}**${club} n'apparaît pas dans la liste des absents connus pour la prochaine journée des 5 grands championnats : il devrait être disponible.\n_Infos du ${SAVED_LINEUPS_INFO.date}, à vérifier avant le match._`;
  }

  // ---------- 8. Comparer deux joueurs ----------
  function compare(q, question) {
    if (!has(q, /\b(compare|comparer|comparaison|meilleur que|plus fort que|mieux que|ou bien|versus|vs|entre|ou)\b/) || typeof CareerBot === "undefined") return null;
    if (teamsAll(question).length >= 2) return null; // comparaison d'équipes : moteur des matchs
    const parts = clean(question).split(/\b(?:et|ou|vs|versus|contre|que|entre)\b/).filter(s => s.trim());
    const found = [];
    parts.forEach(s => { const f = CareerBot.find(s)[0]; if (f && !found.includes(f)) found.push(f); });
    if (found.length !== 2) return null;
    return CareerBot.compareText(found[0], found[1]);
  }

  // ---------- Entrée principale ----------
  function before(question) {
    const q = clean(question);
    const fixed = correct(question);
    const qq = fixed ? ` ${fixed} ` : q;
    const text = fixed || question;
    const answer = smallTalk(qq) || honesty(qq, text) || opinions(qq) || scheduleAndTable(qq, text) ||
      squadAnswers(qq, text) || stadiums(qq, text) || injuries(qq, text) || compare(qq, text);
    if (answer) return { answer };
    return fixed ? { question: fixed } : null;
  }

  // Après les autres moteurs : question incomprise ou hors foot
  const FOOT = /\b(foot|football|match|matchs|but|buts|spectateurs|stades?|joueur|joueuse|equipe|club|ligue|championnat|coupe|ballon|classement|prono|pronostic|compo|entraineur|stade|arbitre|carton|penalty|hors jeu|transfert|mercato|selection|gardien|attaquant|defenseur|milieu|buteur|passe|tacle|dribble|corner|var|fifa|uefa|derby|supporter|tir|score|victoire|defaite|nul|saison|journee|terrain|maillot|capitaine|titre|trophee|champion)\b/;
  function fallback(question) {
    const q = clean(question);
    if (!FOOT.test(q) && !teamsAll(question).length && !(typeof CareerBot !== "undefined" && CareerBot.find(question).length)) {
      return `Je suis un assistant **spécialisé dans le football** ⚽ : je ne peux pas répondre à cette question.\n${EXAMPLES}`;
    }
    if (has(q, /\b(c est quoi|qu est ce que|qu est ce qu|ca veut dire|que veut dire|definition|signifie)\b/)) {
      return "Je ne connais pas encore ce terme de football. Je peux t'expliquer par exemple : le hors-jeu, la VAR, les cartons, le penalty, un 4-3-3, le pressing, les xG, la panenka, un coup du chapeau…";
    }
    return `Je n'ai pas bien compris ta question. Essaie de la reformuler avec le nom d'un club, d'un joueur ou d'un championnat.\n${EXAMPLES}`;
  }

  return { before, fallback, correct };
})();
