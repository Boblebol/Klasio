// Klasio — noyau de fonctions pures
// Ce module ne dépend ni du DOM ni d'un état global — il est 100 % testable.

// ── Constantes partagées ──
export const COLORS = [
  '#4f46e5', '#7c3aed', '#0891b2', '#158a52', '#d97706',
  '#c0282a', '#9333ea', '#059669', '#db2777', '#ea580c',
];

export const STRATS = [
  { id: 'balanced',    emoji: '⚖️',  name: 'Classes équilibrées',         tag: 'Recommandé', desc: 'Chaque niveau est réparti en classes de même taille. Idéal dans la plupart des cas.' },
  { id: 'double',      emoji: '🔀',  name: 'Le moins de classes possible', tag: 'Compact',    desc: 'Regroupe deux niveaux par classe pour réduire le nombre total de classes.' },
  { id: 'single',      emoji: '📋',  name: 'Un seul niveau par classe',    tag: 'Simple',     desc: 'Chaque classe a un seul niveau. Aucun double-niveau.' },
  { id: 'small-first', emoji: '🌱',  name: 'Classes les plus légères',     tag: 'Doux',       desc: 'Répartit pour que les classes soient le moins chargées possible.' },
];
export const STRATS_IDS = STRATS.map(s => s.id);

export const DEFAULT_STATE = () => ({
  niveaux: [
    { id: 'CP',  label: 'CP',  total: 0, plafond: 24, color: COLORS[0] },
    { id: 'CE1', label: 'CE1', total: 0, plafond: 24, color: COLORS[1] },
    { id: 'CE2', label: 'CE2', total: 0, plafond: 25, color: COLORS[2] },
    { id: 'CM1', label: 'CM1', total: 0, plafond: 25, color: COLORS[3] },
    { id: 'CM2', label: 'CM2', total: 0, plafond: 25, color: COLORS[4] },
  ],
  classes: [],
  maxClasses: 8,
  counter: 6,
  distribMode: 'balanced',
  showPreview: false,
  currentStep: 1,
  schoolName: '',
  schoolYear: '2025-2026',
});

// ── Échappement HTML sûr ──
// À utiliser pour toute donnée utilisateur injectée dans un template.
export function esc(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// ── Validation de schéma ──
export function isValidNiveau(n) {
  return n && typeof n === 'object'
    && typeof n.id === 'string' && /^[A-Za-z0-9_-]{1,20}$/.test(n.id)
    && typeof n.label === 'string' && n.label.length <= 20
    && Number.isFinite(n.total) && n.total >= 0 && n.total < 10000
    && Number.isFinite(n.plafond) && n.plafond >= 1 && n.plafond < 200
    && (typeof n.color === 'string' ? /^#[0-9a-f]{3,8}$/i.test(n.color) : true);
}

export function isValidClasse(cl, validIds) {
  if (!cl || !Array.isArray(cl.rows) || cl.rows.length > 5) return false;
  return cl.rows.every(r =>
    r && typeof r.nid === 'string' && validIds.has(r.nid) && Number.isFinite(parseInt(r.val))
  );
}

export function validateState(s) {
  if (!s || typeof s !== 'object') return null;
  if (!Array.isArray(s.niveaux) || s.niveaux.length === 0 || s.niveaux.length > 30) return null;
  if (!s.niveaux.every(isValidNiveau)) return null;
  const ids = new Set(s.niveaux.map(n => n.id));
  if (ids.size !== s.niveaux.length) return null;
  const classes = Array.isArray(s.classes) ? s.classes : [];
  if (classes.length > 50 || !classes.every(cl => isValidClasse(cl, ids))) return null;

  return {
    niveaux: s.niveaux.map(n => ({
      id: n.id, label: n.label, total: n.total, plafond: n.plafond, color: n.color,
    })),
    classes: classes.map(cl => ({
      rows: cl.rows.map(r => ({ nid: r.nid, val: Math.max(0, parseInt(r.val) || 0) })),
      teacher: typeof cl.teacher === 'string' ? cl.teacher.slice(0, 80) : '',
      name: typeof cl.name === 'string' ? cl.name.slice(0, 60) : '',
    })),
    maxClasses: Number.isFinite(s.maxClasses) && s.maxClasses >= 1 && s.maxClasses <= 50 ? s.maxClasses : 8,
    counter: Number.isFinite(s.counter) ? s.counter : 6,
    distribMode: STRATS_IDS.includes(s.distribMode) ? s.distribMode : 'balanced',
    showPreview: !!s.showPreview,
    currentStep: [1, 2, 3, 4].includes(s.currentStep) ? s.currentStep : 1,
    schoolName: typeof s.schoolName === 'string' ? s.schoolName.slice(0, 120) : '',
    schoolYear: typeof s.schoolYear === 'string' ? s.schoolYear.slice(0, 20) : '2025-2026',
  };
}

// ── Helpers de classes ──
export function classTotal(cl) {
  return cl.rows.reduce((s, r) => s + (parseInt(r.val) || 0), 0);
}

export function classPlafond(cl, niveaux) {
  if (!cl.rows.length) return Infinity;
  const byId = new Map(niveaux.map(n => [n.id, n]));
  return Math.min(...cl.rows.map(r => {
    const n = byId.get(r.nid);
    return n ? n.plafond : 24;
  }));
}

/**
 * Vérifie que les niveaux d'une classe sont consécutifs dans l'ordre défini.
 * Ex avec niveaux = [CP, CE1, CE2, CM1, CM2] : CP+CE1 ✓, CP+CE2 ✗.
 */
export function consecOk(nids, niveaux) {
  if (nids.length <= 1) return true;
  const order = niveaux.map(n => n.id);
  const idx = nids.map(id => order.indexOf(id)).filter(i => i >= 0).sort((a, b) => a - b);
  for (let i = 1; i < idx.length; i++) {
    if (idx[i] - idx[i - 1] !== 1) return false;
  }
  return true;
}

// ── Algorithmes de répartition ──
/**
 * Génère une liste de classes selon une stratégie.
 * @param {Array} niveaux - [{ id, label, total, plafond, color }]
 * @param {number} maxClasses - plafond dur du nombre de classes
 * @param {string} mode - 'balanced' | 'double' | 'single' | 'small-first'
 * @returns {Array} [{ rows: [{ nid, val }] }]
 */
export function computeDistrib(niveaux, maxClasses, mode = 'balanced') {
  const result = [];

  if (mode === 'single') {
    niveaux.forEach(n => {
      if (!n.total) return;
      let r = n.total;
      while (r > 0) {
        const t = Math.min(r, n.plafond);
        result.push({ rows: [{ nid: n.id, val: t }] });
        r -= t;
      }
    });
  } else if (mode === 'balanced') {
    niveaux.forEach(n => {
      if (!n.total) return;
      const nc = Math.ceil(n.total / n.plafond);
      const base = Math.floor(n.total / nc);
      const extra = n.total % nc;
      for (let i = 0; i < nc; i++) {
        result.push({ rows: [{ nid: n.id, val: base + (i < extra ? 1 : 0) }] });
      }
    });
  } else if (mode === 'double') {
    let i = 0;
    while (i < niveaux.length) {
      const n1 = niveaux[i];
      const n2 = niveaux[i + 1];
      if (n2 && n1.total && n2.total) {
        const plaf = Math.min(n1.plafond, n2.plafond);
        let r1 = n1.total;
        let r2 = n2.total;
        while (r1 > 0 || r2 > 0) {
          const h = Math.floor(plaf / 2);
          const t1 = Math.min(r1, h);
          const t2 = Math.min(r2, plaf - t1);
          const rows = [];
          if (t1 > 0) rows.push({ nid: n1.id, val: t1 });
          if (t2 > 0) rows.push({ nid: n2.id, val: t2 });
          if (!rows.length) break;
          result.push({ rows });
          r1 -= t1;
          r2 -= t2;
        }
        i += 2;
      } else {
        if (n1.total) {
          let r = n1.total;
          while (r > 0) {
            const t = Math.min(r, n1.plafond);
            result.push({ rows: [{ nid: n1.id, val: t }] });
            r -= t;
          }
        }
        i++;
      }
    }
  } else if (mode === 'small-first') {
    niveaux.forEach(n => {
      if (!n.total) return;
      const nc = Math.ceil(n.total / n.plafond);
      const min = Math.floor(n.total / nc);
      const extra = n.total - (min * nc);
      for (let i = 0; i < nc; i++) {
        result.push({ rows: [{ nid: n.id, val: i < (nc - extra) ? min : min + 1 }] });
      }
    });
  }

  return result.slice(0, maxClasses);
}

// ── Résumé d'état (pour l'UI de comparaison de scénarios) ──
/**
 * Calcule un résumé synthétique d'un état, utilisé notamment pour comparer
 * plusieurs scénarios côte à côte.
 *
 * @returns {{
 *   totalEleves:number, placedEleves:number, remainingEleves:number,
 *   nbNiveaux:number, nbClasses:number, nbErrors:number,
 *   isEmpty:boolean, maxClasses:number
 * }}
 */
export function summariseState(state) {
  if (!state || !Array.isArray(state.niveaux) || !Array.isArray(state.classes)) {
    return {
      totalEleves: 0, placedEleves: 0, remainingEleves: 0,
      nbNiveaux: 0, nbClasses: 0, nbErrors: 0, isEmpty: true, maxClasses: 0,
    };
  }
  const totalEleves = state.niveaux.reduce((s, n) => s + (parseInt(n.total) || 0), 0);
  const placedEleves = state.classes.reduce((s, cl) => s + classTotal(cl), 0);

  let nbErrors = 0;
  state.classes.forEach(cl => {
    if (classTotal(cl) > classPlafond(cl, state.niveaux)) nbErrors++;
    if (cl.rows.length > 1 && !consecOk(cl.rows.map(r => r.nid), state.niveaux)) nbErrors++;
  });

  return {
    totalEleves,
    placedEleves,
    remainingEleves: totalEleves - placedEleves,
    nbNiveaux: state.niveaux.length,
    nbClasses: state.classes.length,
    nbErrors,
    isEmpty: totalEleves === 0 && state.classes.length === 0,
    maxClasses: state.maxClasses || 0,
  };
}

// ── Partage via URL ──
export function encodeState(state) {
  const mini = {
    n: state.niveaux.map(n => ({ i: n.id, l: n.label, t: n.total, p: n.plafond, c: n.color })),
    cl: state.classes.map(cl => ({ r: cl.rows.map(r => ({ n: r.nid, v: r.val })) })),
    m: state.maxClasses,
  };
  return btoa(encodeURIComponent(JSON.stringify(mini)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Décode une chaîne de partage et renvoie un state validé, ou `null` si invalide.
 */
export function decodeState(str) {
  try {
    const json = decodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
    const mini = JSON.parse(json);
    if (!mini || !Array.isArray(mini.n) || !Array.isArray(mini.cl)) return null;
    const candidate = {
      ...DEFAULT_STATE(),
      niveaux: mini.n.map(n => ({
        id: String(n.i || ''),
        label: String(n.l || ''),
        total: parseInt(n.t) || 0,
        plafond: parseInt(n.p) || 25,
        color: String(n.c || '#4f46e5'),
      })),
      classes: mini.cl.map(cl => ({
        rows: (cl.r || []).map(r => ({ nid: String(r.n || ''), val: parseInt(r.v) || 0 })),
        teacher: '',
        name: '',
      })),
      maxClasses: parseInt(mini.m) || 8,
    };
    return validateState(candidate);
  } catch {
    return null;
  }
}

// ── Déplacement d'élèves entre classes ──
/**
 * Calcule les destinations possibles pour déplacer des élèves d'une ligne donnée.
 *
 * @param {object} state  - { niveaux, classes }
 * @param {number} ci     - index de la classe source
 * @param {number} ri     - index de la ligne (niveau) source dans cette classe
 * @returns {Array<{ ti, space, kind: 'merge'|'new', max }>}
 *   - `ti`   : index de la classe cible
 *   - `space`: nb de places disponibles compte tenu des plafonds
 *   - `kind` : `merge` si le niveau existe déjà dans la cible, `new` sinon
 *   - `max`  : nb max d'élèves déplaçables (= min(space, val source))
 *
 * Une destination n'est retournée que si elle respecte toutes les contraintes :
 *   - classe différente de la source
 *   - au plus 5 niveaux par classe (consistant avec validateState)
 *   - si nouveau niveau : l'ajout maintient la consécutivité des niveaux
 *   - il reste au moins 1 place (`space > 0`)
 */
export function computeMoveTargets(state, ci, ri) {
  const source = state?.classes?.[ci];
  if (!source) return [];
  const sourceRow = source.rows?.[ri];
  if (!sourceRow) return [];
  const sourceVal = parseInt(sourceRow.val) || 0;
  if (sourceVal <= 0) return [];

  const sourceNiveau = state.niveaux.find(n => n.id === sourceRow.nid);
  if (!sourceNiveau) return [];

  const results = [];
  state.classes.forEach((target, ti) => {
    if (ti === ci) return;
    const existing = target.rows.find(r => r.nid === sourceRow.nid);
    const currentTotal = classTotal(target);

    if (existing) {
      const targetPlaf = classPlafond(target, state.niveaux);
      const space = Math.max(0, targetPlaf - currentTotal);
      if (space > 0) {
        results.push({ ti, space, kind: 'merge', max: Math.min(space, sourceVal) });
      }
      return;
    }

    // Nouveau niveau dans la cible : vérifier contraintes
    if (target.rows.length >= 5) return;
    const newNids = [...target.rows.map(r => r.nid), sourceRow.nid];
    if (!consecOk(newNids, state.niveaux)) return;

    const newPlaf = target.rows.length > 0
      ? Math.min(classPlafond(target, state.niveaux), sourceNiveau.plafond)
      : sourceNiveau.plafond;
    const space = Math.max(0, newPlaf - currentTotal);
    if (space > 0) {
      results.push({ ti, space, kind: 'new', max: Math.min(space, sourceVal) });
    }
  });

  return results;
}

// ── Import CSV des effectifs ──
/**
 * Parse un texte CSV simple (une ligne par niveau) et renvoie un tableau
 * d'updates { label, total } à appliquer sur le state courant.
 *
 * Formats acceptés (séparateurs autorisés : , ; tab, pipe) :
 *   CP,24
 *   CE1;22
 *   CE2\t18
 *   CM1 | 25
 *
 * Lignes ignorées : vides, commentaires (#...), en-têtes (`niveau,total`).
 * Retourne { items, errors } où errors liste les lignes problématiques.
 */
export function parseCsvEffectifs(text) {
  const items = [];
  const errors = [];
  if (!text || typeof text !== 'string') return { items, errors };

  const lines = text.split(/\r?\n/);
  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;

    // Skip header if first line has no digits
    if (idx === 0 && !/\d/.test(line)) return;

    const parts = line.split(/[,;\t|]/).map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      errors.push({ line: idx + 1, raw, reason: 'format_invalide' });
      return;
    }

    const label = parts[0].toUpperCase();
    const total = parseInt(parts[1]);

    if (!/^[A-Z0-9]{1,20}$/.test(label)) {
      errors.push({ line: idx + 1, raw, reason: 'label_invalide' });
      return;
    }
    if (!Number.isFinite(total) || total < 0 || total > 9999) {
      errors.push({ line: idx + 1, raw, reason: 'total_invalide' });
      return;
    }

    items.push({ label, total });
  });

  return { items, errors };
}

/**
 * Applique une liste d'items CSV aux niveaux existants. Les niveaux non
 * mentionnés gardent leur valeur. Les labels inconnus sont renvoyés comme
 * `newLevels` pour que l'UI propose de les créer.
 */
export function applyCsvItems(niveaux, items) {
  const updated = niveaux.map(n => ({ ...n }));
  const byLabel = new Map(updated.map(n => [n.label.toUpperCase(), n]));
  const newLevels = [];
  items.forEach(it => {
    const existing = byLabel.get(it.label);
    if (existing) existing.total = it.total;
    else newLevels.push(it);
  });
  return { updated, newLevels };
}
