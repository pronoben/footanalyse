/* =========================================================
   CHATBOT – CARRIÈRES DES JOUEURS (sans IA, gratuit)
   ---------------------------------------------------------
   Données : js/careers.json, créé par tools/build_careers.py à
   partir des infobox Wikipédia (clubs, matchs, buts, sélections,
   date de naissance, poste, taille) de tous les joueurs des
   effectifs des 5 grands championnats + des légendes.
   Le fichier (~1 Mo) est chargé en arrière-plan après la page.
   ========================================================= */

const CareerBot = (() => {
  let DATA = null;
  let INDEX = null; // clé (nom nettoyé) -> liste d'indices de joueurs
  let loading = null;

  const clean = s => " " + String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ø/g, "o").replace(/æ/g, "ae").replace(/ß/g, "ss").replace(/[łŁ]/g, "l").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ").trim() + " ";

  // Mots trop courants (ou prénoms) pour servir seuls à reconnaître un joueur
  const STOP = new Set(["le", "la", "les", "de", "du", "des", "son", "sa", "ses", "can", "ben", "dos", "da", "di", "van",
    "von", "der", "den", "del", "el", "al", "jr", "junior", "filho", "neto",
    "jean", "pierre", "paul", "louis", "marc", "luca", "luis", "juan", "jose", "joao", "andre", "alex", "alexandre",
    "mohamed", "mohammed", "ahmed", "ali", "omar", "karim", "yassine", "youssef", "moussa", "ibrahim", "ibrahima",
    "mamadou", "abdou", "adam", "noah", "leo", "hugo", "theo", "enzo", "nathan", "kevin", "dani", "daniel", "michael",
    "james", "john", "jack", "harry", "ryan", "sam", "joe", "ben", "max", "tom", "luke", "matt", "chris", "marco",
    "antonio", "francesco", "giovanni", "lorenzo", "matteo", "federico", "carlos", "diego", "sergio", "pablo",
    "jorge", "miguel", "manuel", "rafa", "mario", "pedro", "jesus", "rafael", "nico", "martin", "thomas", "simon",
    "robert", "lucas", "david", "victor", "felix", "oscar", "ivan", "jan", "jonas", "lukas", "leon", "tim", "nick",
    "plus", "pour", "dans", "avec", "club", "clubs", "buts", "match", "matchs", "carriere", "joueur",
    "france", "paris", "real", "city", "united", "inter", "milan", "roma", "monaco", "nice", "lens", "brest", "angers",
    "quel", "quelle", "combien", "taille", "selection", "selections", "age", "stats", "fiche", "total", "parcours",
    "poste", "mesure", "joue", "marque", "equipe", "monde", "coupe", "ligue", "saison", "annee"]);

  function load() {
    if (!loading) {
      loading = fetch("js/careers.json")
        .then(r => (r.ok ? r.json() : null))
        .then(d => { if (d) { DATA = d; buildIndex(); addFirstNames(); } })
        .catch(() => {});
    }
    return loading;
  }
  // Préchargement discret après l'affichage de la page
  window.addEventListener("load", () => setTimeout(load, 1500));

  function buildIndex() {
    INDEX = new Map();
    const add = (key, i) => {
      key = key.trim();
      if (key.length < 4 || STOP.has(key)) return;
      if (!INDEX.has(key)) INDEX.set(key, []);
      if (!INDEX.get(key).includes(i)) INDEX.get(key).push(i);
    };
    DATA.players.forEach((p, i) => {
      const names = new Set([p.n, p.t.replace(/\s*\(.*\)$/, "")]);
      names.forEach(nm => {
        const words = clean(nm).trim().split(" ").filter(Boolean);
        if (!words.length) return;
        add(words.join(" "), i); // nom complet
        if (words.length >= 2) {
          add(words[words.length - 1], i); // nom de famille
          // « Vinícius Júnior », « Neymar Jr » : le mot avant « junior » sert aussi de nom
          if (STOP.has(words[words.length - 1])) add(words[words.length - 2], i);
          add(words.slice(-2).join(" "), i); // « van dijk », « de bruyne »
          if (words.length >= 3) add(words.slice(-3).join(" "), i);
          add(`${words[0]} ${words[words.length - 1]}`, i);
        }
      });
    });
  }

  // Prénoms des joueurs très connus (« Zlatan », « Kylian ») : ajoutés après coup, pour les 400 plus connus
  function addFirstNames() {
    const top = DATA.players.map((p, i) => [i, fame(p)]).sort((a, b) => b[1] - a[1]).slice(0, 400);
    top.forEach(([i]) => {
      const w = clean(DATA.players[i].n).trim().split(" ");
      if (w.length >= 2 && w[0].length >= 5 && !STOP.has(w[0]) && !INDEX.has(w[0])) INDEX.set(w[0], [i]);
    });
  }

  // Joueurs cités : on garde la correspondance la plus longue
  function find(question) {
    if (!INDEX) return [];
    const q = clean(question);
    let best = [], bestLen = 0;
    for (const [key, ids] of INDEX) {
      if (key.length < bestLen) continue;
      if (q.includes(` ${key} `)) {
        if (key.length > bestLen) { best = ids.slice(); bestLen = key.length; }
        else ids.forEach(i => { if (!best.includes(i)) best.push(i); });
      }
    }
    // Si la clé est exactement le nom complet d'un joueur (« Pelé » et pas « Abedi Pele »), on le préfère
    const exact = best.filter(i => clean(DATA.players[i].n).trim() === [...INDEX.keys()].find(k => k.length === bestLen && INDEX.get(k).includes(i)));
    // On préfère le nom exact (« Pelé » plutôt qu'« Abedi Pele »)… sauf si un homonyme est bien plus connu
    // (« Ronaldo » -> Cristiano Ronaldo plutôt que Ronaldo le Brésilien)
    if (exact.length && exact.length < best.length) {
      const fe = Math.max(...exact.map(i => fame(DATA.players[i])));
      const fo = Math.max(...best.filter(i => !exact.includes(i)).map(i => fame(DATA.players[i])));
      if (fo < 1.5 * fe) return exact.map(i => DATA.players[i]);
    }
    // Du plus connu au moins connu (Kylian avant Ethan Mbappé)
    return best.map(i => DATA.players[i]).sort((a, b) => fame(b) - fame(a));
  }

  // ---------- Mise en forme ----------
  const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function fmtDate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return m ? `${d === 1 ? "1er" : d} ${MONTHS[m - 1]} ${y}` : String(y);
  }
  function age(birth, death) {
    if (!birth || birth.length < 10) return null;
    const b = new Date(birth + "T12:00:00");
    const end = death ? new Date(death + "T12:00:00") : new Date();
    let a = end.getFullYear() - b.getFullYear();
    if (end.getMonth() < b.getMonth() || (end.getMonth() === b.getMonth() && end.getDate() < b.getDate())) a--;
    return a;
  }
  const RESERVE = /\b(II|III|B|C|2|U-?\d{2}|Under-\d{2}|Reserves?|Academy|Youth|Primavera|Castilla|Juvenil|Jong|Amateurs?|Mestalla|Atl[eè]tic|Promesas|Sub-\d{2})\b/i;
  const n = v => (v == null ? "?" : v);
  const plural = (v, one, many) => (v == null ? `? ${many}` : `${v} ${v > 1 ? many : one}`);

  function totals(p) {
    const senior = p.cl.filter(c => !RESERVE.test(c[1]));
    const known = senior.filter(c => c[2] != null);
    return {
      apps: known.reduce((s, c) => s + c[2], 0),
      goals: known.reduce((s, c) => s + (c[3] || 0), 0),
      complete: known.length === senior.length,
    };
  }
  const seniorNat = p => p.nt.filter(t => !/\b(U-?\d{2}|Under-\d{2}|Olympi|B|Espoirs|Amateur)\b/i.test(t[1]));

  function card(p) {
    const a = age(p.b, p.d);
    const lines = [];
    lines.push(`👤 **${p.n}**${p.nat ? ` (${p.nat})` : ""}${p.p ? ` – ${p.p}` : ""}`);
    const born = fmtDate(p.b);
    if (born) lines.push(`- Né le ${born}${p.bp ? ` à ${p.bp}` : ""}${a != null && !p.d ? ` (${a} ans)` : ""}`);
    if (p.d) lines.push(`- Décédé le ${fmtDate(p.d)}${a != null ? ` à ${a} ans` : ""}`);
    if (p.h) lines.push(`- Taille : ${p.h.toFixed(2).replace(".", ",")} m`);
    if (p.c) lines.push(`- ${/entraîneur/.test(p.c) ? "Poste actuel" : "Club actuel"} : **${p.c}**`);
    if (p.cl.length) {
      lines.push("\n**Carrière en club** (matchs et buts en championnat) :");
      p.cl.forEach(([y, club, apps, goals, loan]) =>
        lines.push(`- ${y || "?"} : ${club}${loan ? " (prêt)" : ""} – ${plural(apps, "match", "matchs")}, ${plural(goals, "but", "buts")}`));
      const t = totals(p);
      lines.push(`- **Total${p.cl.some(c => RESERVE.test(c[1])) ? " (hors équipes réserves)" : ""} : ${t.apps} matchs, ${t.goals} buts**${t.complete ? "" : " (certains chiffres manquent)"}`);
    }
    if (p.nt.length) {
      lines.push("\n**Sélections** :");
      p.nt.forEach(([y, team, caps, goals]) => lines.push(`- ${y || "?"} : ${team} – ${plural(caps, "sélection", "sélections")}, ${plural(goals, "but", "buts")}`));
    }
    const EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const upd = p.u ? p.u.replace(/^\d{1,2}:\d{2}, /, "").replace(/ \(UTC\)/, "").replace(/[A-Z][a-z]+/, m => (EN.includes(m) ? MONTHS[EN.indexOf(m)] : m)) : null;
    lines.push(`\n_Source : Wikipédia${upd ? `, mis à jour le ${upd}` : ""}. Les matchs en club ne comptent que le championnat._`);
    return lines.join("\n");
  }

  // Réponse directe selon la question, avant la fiche
  function direct(p, q) {
    const a = age(p.b, p.d);
    const t = totals(p);
    const nat = seniorNat(p).pop();
    if (/\bage\b|\bquel age\b|\bne (le|en|quand)\b|\bdate de naissance\b|\bannee de naissance\b/.test(q) && p.b) {
      return p.d ? `${p.n} est né le ${fmtDate(p.b)} et décédé le ${fmtDate(p.d)}, à ${a} ans.`
        : `${p.n} a **${a} ans** (né le ${fmtDate(p.b)}).`;
    }
    if (/\btaille\b|\bmesure\b|\bgrand\b/.test(q) && p.h) return `${p.n} mesure **${p.h.toFixed(2).replace(".", ",")} m**.`;
    if (/\bou joue\b|\bdans quel club\b|\bquel club\b|\bson club\b|\bil joue ou\b|\bjoue ou\b|\bjoue toujours\b|\bjoue encore\b/.test(q)) {
      return p.c ? `${p.n} joue actuellement à **${p.c}**${p.no ? ` (n° ${p.no})` : ""}.` : `${p.n} n'a pas de club actuel dans mes données (retraité ou libre).`;
    }
    if (/\bnumero\b|\bmaillot\b|\bporte le\b/.test(q)) return p.no ? `${p.n} porte le **n° ${p.no}**${p.c ? ` à ${p.c}` : ""}.` : `Je n'ai pas le numéro de maillot de ${p.n}.`;
    if (/\bou est ne\b|\blieu de naissance\b|\bne ou\b|\bvient d ou\b|\bd ou vient\b/.test(q) && p.bp) return `${p.n} est né à **${p.bp}**${p.b ? `, le ${fmtDate(p.b)}` : ""}.`;
    if (/\bnationalite\b|\bquel pays\b|\bpour quel pays\b/.test(q) && p.nat) return `${p.n} joue pour la sélection de **${p.nat}**.`;
    if (/\bposte\b|\bjoue a quel\b|\bposition\b/.test(q) && p.p) return `${p.n} joue **${p.p.toLowerCase()}**.`;
    if (/\bselections?\b|\bcapes?\b|\ben equipe nationale\b|\bavec (la |le |l )?(france|bleus|selection)\b/.test(q) && nat) {
      return `${p.n} compte **${plural(nat[2], "sélection", "sélections")}** et **${plural(nat[3], "but", "buts")}** avec ${nat[1]} (${nat[0]}).`;
    }
    if (/\bbuts?\b|\bmarque\b/.test(q) && p.cl.length) return `${p.n} a marqué **${t.goals} buts** en ${t.apps} matchs de championnat en club${nat && nat[3] != null ? `, plus **${nat[3]} buts** en sélection` : ""}.`;
    if (/\bmatchs?\b|\bjoue combien\b/.test(q) && p.cl.length) return `${p.n} a joué **${t.apps} matchs** de championnat en club${nat && nat[2] != null ? ` et **${nat[2]} matchs** avec ${nat[1]}` : ""}.`;
    if (/\bclubs?\b|\bou a joue\b|\bparcours\b|\bequipes?\b/.test(q) && p.cl.length) {
      const list = [...new Set(p.cl.filter(c => !RESERVE.test(c[1])).map(c => c[1]))];
      return `${p.n} a joué à : ${list.join(", ")}.`;
    }
    return null;
  }

  const WANTS = /\bcarriere\b|\bparcours\b|\bselections?\b|\bcapes?\b|\bquel age\b|\bage de\b|\bage a\b|\bage\b|\bil a quel age\b|\bne (le|en|ou|quand)\b|\bou est ne\b|\blieu de naissance\b|\bdate de naissance\b|\btaille\b|\bmesure\b|\bcombien de (matchs?|buts?|selections?)\b|\bau total\b|\ben carriere\b|\bhistorique\b|\bfiche\b|\bbiographie\b|\bou a joue\b|\ba joue (a|au|pour|dans|ou)\b|\bjoue ou\b|\banciens? clubs?\b|\bses clubs\b|\bquels clubs\b|\bforme a\b|\bposte\b|\bquel poste\b|\bnationalite\b|\bnumero\b|\bmaillot\b|\bquel pays\b|\bou joue\b|\bdans quel club\b|\bquel club\b|\bjoue toujours\b|\bjoue encore\b|\bil joue ou\b/;
  // « cette saison » = statistiques de la saison en cours (moteur des matchs), pas la carrière
  const SEASON = /\bcette saison\b|\ben ce moment\b|\bactuellement\b|\bcette annee\b|\bcette journee\b|\bce week end\b|\ben championnat cette\b|\bdepuis le debut de (la )?saison\b/;

  function wants(question) { const q = clean(question); return WANTS.test(q) && !SEASON.test(q); }

  // force = true : la question parle forcément de carrière ; sinon (repli), on ne répond que si un joueur est reconnu
  // Notoriété approximative : sélections A (comptent double) + matchs de championnat
  function fame(p) {
    const caps = Math.max(0, ...seniorNat(p).map(t => t[2] || 0));
    return caps * 2 + totals(p).apps;
  }
  const label = p => `**${p.n}**${p.c ? ` (${p.c})` : p.nat ? ` (${p.nat})` : ""}`;

  // force = true : la question parle forcément de carrière ; sinon (repli), on ne répond que si un joueur est reconnu
  function reply(question, force = true) {
    if (!DATA) return force ? "⏳ Je charge les carrières des joueurs… repose ta question dans quelques secondes." : null;
    const q = clean(question);
    const found = find(question).sort((a, b) => fame(b) - fame(a));
    if (!found.length) {
      return force ? `Je ne trouve pas ce joueur dans ma base de ${DATA.players.length} carrières (effectifs des 5 grands championnats et légendes). Vérifie l'orthographe ou donne le nom complet.` : null;
    }
    let note = "";
    if (found.length > 1) {
      // Un joueur nettement plus connu que les autres (Kylian / Ethan Mbappé) : on le choisit
      if (fame(found[0]) >= 2 * Math.max(1, fame(found[1]))) {
        note = `\n\n_Même nom : ${found.slice(1, 4).map(label).join(", ")}. Précise le prénom pour un autre joueur._`;
      } else {
        return `Plusieurs joueurs correspondent :\n${found.slice(0, 8).map(p => `- ${label(p)}`).join("\n")}\nPrécise le prénom, par ex. « carrière de ${found[0].n} ».`;
      }
    }
    const p = found[0];
    const d = direct(p, q);
    return (d ? d + "\n\n" : "") + card(p) + note;
  }

  // Comparaison de deux joueurs (carrière + saison en cours si connue)
  function compareText(a, b) {
    const row = p => {
      const t = totals(p), nat = seniorNat(p).pop();
      return { age: age(p.b, p.d), apps: t.apps, goals: t.goals, caps: nat ? nat[2] : null, ng: nat ? nat[3] : null, club: p.c || "—", pos: p.p || "—" };
    };
    const A = row(a), B = row(b);
    const line = (label, x, y, better = true) => {
      const win = better && x != null && y != null && x !== y ? (x > y ? " ⬅️" : "") : "";
      const win2 = better && x != null && y != null && x !== y ? (y > x ? " ⬅️" : "") : "";
      return `- ${label} : **${x ?? "?"}**${win} vs **${y ?? "?"}**${win2}`;
    };
    const ratio = r => (r.apps ? (r.goals / r.apps).toFixed(2) : "?");
    return `⚖️ **${a.n}** vs **${b.n}** (carrière, championnat uniquement)\n` +
      `- Club : ${A.club} vs ${B.club}\n- Poste : ${A.pos} vs ${B.pos}\n` +
      line("Âge", A.age, B.age, false) + "\n" + line("Matchs en club", A.apps, B.apps) + "\n" + line("Buts en club", A.goals, B.goals) + "\n" +
      `- Buts par match : **${ratio(A)}** vs **${ratio(B)}**\n` + line("Sélections", A.caps, B.caps) + "\n" + line("Buts en sélection", A.ng, B.ng) +
      "\n_Dire qui est « meilleur » reste une question d'avis : ces chiffres ne comptent ni les coupes ni l'Europe, et dépendent du poste._\n_Source : Wikipédia._";
  }

  const vocab = () => {
    if (!DATA) return [];
    const out = new Map(); // mot -> notoriété du joueur le plus connu qui porte ce nom
    DATA.players.forEach(p => {
      const f = fame(p);
      clean(p.n).trim().split(" ").forEach(w => { if (w.length >= 5 && !STOP.has(w) && (out.get(w) || 0) < f) out.set(w, f); });
    });
    return [...out];
  };
  const byTitle = t => (DATA ? DATA.players.find(p => p.t === t) : null);

  return { load, ready: () => load(), wants, reply, find, compareText, vocab, byTitle,
    clubs: () => (DATA && DATA.clubs) || [], count: () => (DATA ? DATA.players.length : 0) };
})();
