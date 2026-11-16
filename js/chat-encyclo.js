/* =========================================================
   CHATBOT – ENCYCLOPÉDIE DU FOOT (sans IA, gratuit)
   ---------------------------------------------------------
   EncycloBot.reply(question) répond aux questions de culture
   foot à partir de js/foot-knowledge.js : palmarès (Coupe du
   monde, Euro, Ligue des champions, championnats), Ballon d'Or,
   règles, tactique, vocabulaire, légendes, entraîneurs, clubs.
   Renvoie null si la question ne le concerne pas : le moteur
   d'analyse des matchs (js/chat-local.js) prend alors le relais.
   ========================================================= */

const EncycloBot = (() => {
  const KB = FOOT_KB;

  // Question « nettoyée » : minuscules, sans accents ni ponctuation, entourée d'espaces
  const clean = s => " " + String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim() + " ";

  const SOURCE_NOTE = `\n\n_Encyclopédie du site, infos arrêtées à la ${KB.until}._`;

  // Années citées : « 2018 », « en 98 », « 2020-2021 » / « 2020-21 » (= saison qui se termine en 2021)
  function yearsIn(q) {
    const out = [];
    const season = q.match(/\b(19|20)(\d\d) (?:(19|20)?(\d\d))\b/);
    if (season) {
      const end = Number((season[3] || season[1]) + season[4]);
      const start = Number(season[1] + season[2]);
      if (end === start + 1) return [end];
    }
    for (const m of q.matchAll(/\b(18|19|20)\d\d\b/g)) out.push(Number(m[0]));
    if (!out.length) {
      const short = q.match(/\b(?:en|de|du|annee|edition|saison) (\d\d)\b/);
      if (short) { const n = Number(short[1]); out.push(n <= 40 ? 2000 + n : 1900 + n); }
    }
    return out;
  }

  const firstMatch = (list, q) => list.find(x => x.k.test(q));
  const countWins = (rows, idx, name) => rows.filter(r => r[idx] === name);
  const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

  // ---------- Coupe du monde / Euro ----------
  function cupAnswer(q, rows, label, labelPlural, pastWord) {
    const years = yearsIn(q);
    if (years.length) {
      const y = years[0];
      const row = rows.find(r => r[0] === y);
      if (row) {
        return `🏆 **${label} ${y}** : vainqueur **${row[1]}**.\n- Pays organisateur : ${row[2]}\n- Finale : ${row[1]} – ${row[3]}, ${row[4]}`;
      }
      const last = rows[rows.length - 1][0];
      if (y > last) return `Je n'ai pas le résultat de l'édition ${y} dans mes données (dernière enregistrée : ${last}, gagnée par **${rows[rows.length - 1][1]}**).`;
      return `Il n'y a pas eu de ${label} en ${y}. Éditions : ${rows.map(r => r[0]).join(", ")}.`;
    }
    // Un pays cité : combien de titres ?
    const country = Object.entries(KB.countries).find(([, re]) => re.test(q));
    if (country) {
      let name = country[0];
      let wins = countWins(rows, 1, name);
      if (name === "Allemagne") wins = rows.filter(r => r[1] === "Allemagne" || r[1] === "RFA");
      const finals = rows.filter(r => r[3] === name || (name === "Allemagne" && r[3] === "RFA"));
      if (!wins.length) {
        return `**${name}** n'a jamais gagné ${pastWord}${finals.length ? ` (finaliste en ${finals.map(r => r[0]).join(", ")})` : ""}.`;
      }
      return `**${name}** a gagné **${plural(wins.length, label, labelPlural)}** : ${wins.map(r => `${r[0]} (contre ${r[3]}, ${r[4]})`).join(", ")}.` +
        (finals.length ? `\nFinaliste malheureux : ${finals.map(r => r[0]).join(", ")}.` : "") +
        (name === "Allemagne" ? "\n_(titres de la RFA compris)_" : "");
    }
    // Palmarès complet + record
    const counts = {};
    rows.forEach(r => {
      const n = r[1] === "RFA" ? "Allemagne (dont RFA)" : r[1];
      counts[n] = (counts[n] || 0) + 1;
    });
    const ranking = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return `🏆 **Palmarès de la ${label}** :\n` +
      ranking.map(([n, c]) => `- **${n}** : ${c}`).join("\n") +
      `\n\nDernières éditions : ${rows.slice(-4).reverse().map(r => `${r[0]} ${r[1]}`).join(", ")}.\n` +
      `_Demande une année (« ${label} 1998 ») ou un pays (« combien de ${labelPlural} pour l'Italie ? »)._`;
  }

  // ---------- Ligue des champions ----------
  function uclAnswer(q) {
    const years = yearsIn(q);
    if (years.length) {
      const y = years[0];
      const row = KB.ucl.find(r => r[0] === y);
      if (row) {
        const final = KB.uclFinals[y];
        return `🏆 **Ligue des champions ${y - 1}-${String(y).slice(2)}** (finale ${y}) : **${row[1]}**.` + (final ? `\nFinale : ${final}.` : "");
      }
      if (y > 2025) return "Je n'ai pas le résultat des finales après 2025 dans mes données (dernière : **PSG**, 5-0 contre l'Inter en 2025).";
      return `La première Coupe des clubs champions date de 1956 (Real Madrid).`;
    }
    const club = Object.entries(KB.uclClubs).find(([, re]) => re.test(q));
    if (club) {
      const wins = KB.ucl.filter(r => r[1] === club[0]).map(r => r[0]);
      if (!wins.length) return `**${club[0]}** n'a jamais gagné la Ligue des champions (ni l'ancienne Coupe des clubs champions).`;
      return `**${club[0]}** a gagné **${plural(wins.length, "Ligue des champions", "Ligues des champions")}** (Coupe des clubs champions comprise) : ${wins.join(", ")}.`;
    }
    const counts = {};
    KB.ucl.forEach(r => { counts[r[1]] = (counts[r[1]] || 0) + 1; });
    const ranking = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return "🏆 **Palmarès de la Ligue des champions** (ex-Coupe des clubs champions, depuis 1956) :\n" +
      ranking.filter(([, c]) => c >= 2).map(([n, c]) => `- **${n}** : ${c}`).join("\n") +
      `\n- 1 titre : ${ranking.filter(([, c]) => c === 1).map(([n]) => n).join(", ")}.\n\n` +
      `Derniers vainqueurs : ${KB.ucl.slice(-5).reverse().map(r => `${r[0]} ${r[1]}`).join(", ")}.\n` +
      "_Clubs français vainqueurs : Marseille (1993) et PSG (2025)._";
  }

  // ---------- Ballon d'Or ----------
  function ballonDorAnswer(q) {
    const years = yearsIn(q);
    if (years.length) {
      const y = years[0];
      if (y === 2020) return "Pas de Ballon d'Or en **2020** : il a été annulé à cause du Covid-19.";
      const row = KB.ballonDor.find(r => r[0] === y);
      if (row) return `🏅 **Ballon d'Or ${y}** : **${row[1]}** (${row[2]}, ${row[3]}).`;
      if (y > 2025) return "Je n'ai pas le Ballon d'Or après 2025 dans mes données (2025 : **Ousmane Dembélé**, PSG).";
      return "Le Ballon d'Or existe depuis 1956 (premier lauréat : Stanley Matthews).";
    }
    const who = Object.entries(KB.ballonDorNames).find(([, re]) => re.test(q));
    if (who) {
      const wins = countWins(KB.ballonDor, 1, who[0]).map(r => r[0]);
      if (!wins.length) return `**${who[0]}** n'a jamais gagné le Ballon d'Or (dans mes données jusqu'en 2025).`;
      return `**${who[0]}** a gagné **${plural(wins.length, "Ballon d'Or", "Ballons d'Or")}** : ${wins.join(", ")}.`;
    }
    if (/\bfrancais\b|\bfrance\b|\bbleus?\b/.test(q)) {
      const fr = KB.ballonDor.filter(r => r[2] === "France");
      const byName = {};
      fr.forEach(r => { (byName[r[1]] ||= []).push(r[0]); });
      return `🇫🇷 **Ballons d'Or français** (${fr.length} trophées) :\n` +
        Object.entries(byName).map(([n, ys]) => `- **${n}** : ${ys.join(", ")}`).join("\n");
    }
    const counts = {};
    KB.ballonDor.forEach(r => { counts[r[1]] = (counts[r[1]] || 0) + 1; });
    const top = Object.entries(counts).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]);
    return "🏅 **Le Ballon d'Or** (créé en 1956 par *France Football*) :\n" +
      top.map(([n, c]) => `- **${n}** : ${c}`).join("\n") +
      `\n\nDerniers lauréats : ${KB.ballonDor.slice(-6).reverse().map(r => `${r[0]} ${r[1]}`).join(", ")}.\n` +
      "_Demande une année (« Ballon d'Or 1998 ») ou un joueur (« combien de Ballons d'Or pour Platini ? »)._";
  }

  // ---------- Champions des 5 championnats ----------
  function leagueAnswer(q, lg) {
    const years = yearsIn(q);
    if (years.length) {
      const y = years[0];
      const season = `${y - 1}-${String(y).slice(2)}`;
      const row = lg.champions.find(c => c[0] === season);
      if (row) return `${lg.flag} **Champion de ${lg.name} ${season}** : **${row[1]}**.`;
      return `Je n'ai le champion de ${lg.name} que pour les saisons 2015-16 à 2024-25.\n${lg.records}`;
    }
    return `${lg.flag} **${lg.name}**\n${lg.records}\n\nDerniers champions :\n` +
      lg.champions.slice().reverse().map(c => `- ${c[0]} : ${c[1]}`).join("\n") +
      `\n\n_${lg.format}_\n_Le champion de la saison 2025-2026 n'est pas dans mes données ; pour la saison en cours, regarde l'onglet Classement._`;
  }

  // ---------- Mots qui montrent l'intention ----------
  const PREDICTION = /\bva gagner\b|\bvont gagner\b|\bprono|\bfavori\b|\bcote\b|\bparier\b/;
  const LEAGUE_HISTORY = /\bchampions?\b|\bpalmares\b|\bvainqueurs?\b|\ba gagne\b|\bont gagne\b|\bqui a gagne\b|\bremporte\b|\btitres?\b|\ble plus titre\b|\bhistorique\b/;
  const BIO = /\bqui est\b|\bqui etait\b|\bc est qui\b|\bparle\b|\bhistoire\b|\bcarriere\b|\bbiographie\b|\bpalmares\b|\blegende\b|\bpresente\b|\binfos?\b|\bconnais\b|\bvie de\b/;
  const CLUB_INFO = /\bstade\b|\bfonde\b|\bfondation\b|\bcree\b|\bcreation\b|\bhistoire\b|\bpalmares\b|\btitres?\b|\btrophees?\b|\bsurnom\b|\bville\b|\bpresente\b|\bparle\b|\bc est quoi\b|\binfos?\b|\bqui est\b|\bconnais\b|\bdate de\b|\bquel age\b|\bfiche\b/;

  function teamMentioned(question) {
    if (typeof LocalBot === "undefined" || typeof LEAGUES === "undefined") return false;
    return Object.values(LEAGUES).some(l => LocalBot.findTeams(question, l.teams).length > 0);
  }

  function topicAnswer(q, question) {
    for (const t of KB.topics) {
      if (!t.k.test(q)) continue;
      if (t.noTeam && teamMentioned(question)) continue;
      const text = t.a.startsWith("@") ? KB.topics.find(x => x.k.test(` ${t.a.slice(1)} `) && !x.a.startsWith("@")).a : t.a;
      return `📘 **${t.t}**\n${text}`;
    }
    return null;
  }

  function reply(question) {
    const q = clean(question);
    const years = yearsIn(q);
    const future = PREDICTION.test(q) && !(years.length && years[0] <= 2025);

    // 1. Palmarès des grandes compétitions
    if (/\bballons? d or\b/.test(q) && !/feminin/.test(q)) return ballonDorAnswer(q) + SOURCE_NOTE;
    if (!future) {
      if (/coupes? du monde (2026|2030|2034)|mondial (2026|2030|2034)|prochaine coupe du monde|prochain mondial/.test(q) || /feminin/.test(q)) {
        const t = topicAnswer(q, question);
        if (t) return t;
      }
      if (/\bcoupes? du monde\b|\bmondial\b|\bworld cup\b|\bcdm\b/.test(q) && !/des clubs/.test(q)) {
        return cupAnswer(q, KB.worldCup, "Coupe du monde", "Coupes du monde", "la Coupe du monde") + SOURCE_NOTE;
      }
      if (/\beuros?\b|championnat d europe/.test(q) && !/millions?|milliards?|\bm\b|transfert|salaire|prix|coute|payer|paye|vaut|valeur|budget|argent/.test(q)) {
        return cupAnswer(q, KB.euro, "Euro", "Euros", "l'Euro") + SOURCE_NOTE;
      }
      const isUcl = /ligue des champions|champions league|\bc1\b|coupe des clubs champions|\bldc\b/.test(q);
      const uclFormat = /format|fonctionne|marche|deroule|phase de ligue|nouvelle formule|combien d equipes|qualifi/.test(q);
      if (isUcl && !uclFormat && !/feminin/.test(q)) return uclAnswer(q) + SOURCE_NOTE;
    }

    // 2. Champions des championnats (« qui a gagné la Ligue 1 en 2021 ? », « palmarès de la Serie A »)
    if (!future && LEAGUE_HISTORY.test(q)) {
      const lg = Object.values(KB.leagues).find(l => l.re.test(q));
      if (lg && !/classement|journee|actuel|en ce moment|cette saison|leader/.test(q)) return leagueAnswer(q, lg) + SOURCE_NOTE;
    }

    // 3. Légendes et entraîneurs
    const person = firstMatch(KB.people, q);
    if (person && (!person.bioOnly || BIO.test(q))) {
      const statsQuestion = /\bcette saison\b|\bstats?\b|\bbuts? cette\b|\bcompo\b|\btitulaire\b|\bbless/.test(q);
      if (!statsQuestion || BIO.test(q)) return `⭐ ${person.a}` + SOURCE_NOTE;
    }

    // 4. Fiches des clubs (« stade du PSG », « palmarès de la Juve », « histoire de l'OM »)
    if (CLUB_INFO.test(q) && !/\bclassement\b|\bcompo\b|\babsents?\b|\bprochain\b|\bbuteurs?\b|\bpasseurs?\b/.test(q)) {
      const club = firstMatch(KB.clubs, q);
      if (club) return `🏟️ ${club.a}` + SOURCE_NOTE;
    }

    // 5. Règles, compétitions, tactique, vocabulaire, records
    return topicAnswer(q, question);
  }

  // Liste de ce que sait l'encyclopédie (pour l'aide)
  const HELP = "Et en culture foot (encyclopédie) :\n" +
    "- « Qui a gagné la Coupe du monde 1998 ? », « Combien d'Euros pour l'Espagne ? »\n" +
    "- « Palmarès de la Ligue des champions », « Ballon d'Or 2025 », « Combien de Ballons d'Or a Messi ? »\n" +
    "- « Qui a été champion de Serie A en 2023 ? », « Palmarès du PSG », « Stade de l'OM »\n" +
    "- « C'est quoi le hors-jeu ? », « Comment marche la VAR ? », « C'est quoi un 4-3-3 ? »\n" +
    "- « Qui est Zidane ? », « Parle-moi de Guardiola », « Les grands derbys », « Records du foot »";

  return { reply, HELP };
})();
