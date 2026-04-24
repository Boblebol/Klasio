import { describe, it, expect } from 'vitest';
import {
  esc,
  validateState,
  isValidNiveau,
  consecOk,
  classTotal,
  classPlafond,
  computeDistrib,
  encodeState,
  decodeState,
  parseCsvEffectifs,
  applyCsvItems,
  DEFAULT_STATE,
  STRATS,
  STRATS_IDS,
} from '../src/core.mjs';

// Niveaux factices réutilisés dans plusieurs tests
const NIV = [
  { id: 'CP',  label: 'CP',  total: 24, plafond: 24, color: '#4f46e5' },
  { id: 'CE1', label: 'CE1', total: 22, plafond: 24, color: '#7c3aed' },
  { id: 'CE2', label: 'CE2', total: 18, plafond: 25, color: '#0891b2' },
  { id: 'CM1', label: 'CM1', total: 25, plafond: 25, color: '#158a52' },
  { id: 'CM2', label: 'CM2', total: 26, plafond: 25, color: '#d97706' },
];

describe('esc()', () => {
  it('renvoie une chaîne vide pour null/undefined', () => {
    expect(esc(null)).toBe('');
    expect(esc(undefined)).toBe('');
  });

  it('échappe les caractères dangereux', () => {
    expect(esc('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
    expect(esc('a & b')).toBe('a &amp; b');
    expect(esc('"quoted"')).toBe('&quot;quoted&quot;');
    expect(esc("l'école")).toBe('l&#39;école');
  });

  it('stringifie les nombres', () => {
    expect(esc(42)).toBe('42');
  });
});

describe('isValidNiveau()', () => {
  it('accepte un niveau conforme', () => {
    expect(isValidNiveau(NIV[0])).toBe(true);
  });

  it('rejette les ids avec caractères spéciaux', () => {
    expect(isValidNiveau({ ...NIV[0], id: 'CP<script>' })).toBe(false);
    expect(isValidNiveau({ ...NIV[0], id: "CP'" })).toBe(false);
  });

  it('rejette les plafonds hors plage', () => {
    expect(isValidNiveau({ ...NIV[0], plafond: 0 })).toBe(false);
    expect(isValidNiveau({ ...NIV[0], plafond: 500 })).toBe(false);
  });

  it('rejette les totaux négatifs ou démesurés', () => {
    expect(isValidNiveau({ ...NIV[0], total: -1 })).toBe(false);
    expect(isValidNiveau({ ...NIV[0], total: 100000 })).toBe(false);
  });
});

describe('validateState()', () => {
  it('accepte un état par défaut', () => {
    const v = validateState(DEFAULT_STATE());
    expect(v).not.toBeNull();
    expect(v.niveaux).toHaveLength(5);
    expect(v.distribMode).toBe('balanced');
  });

  it('rejette null, undefined, scalaires', () => {
    expect(validateState(null)).toBeNull();
    expect(validateState(undefined)).toBeNull();
    expect(validateState(42)).toBeNull();
    expect(validateState('toto')).toBeNull();
  });

  it('rejette un state sans niveaux', () => {
    expect(validateState({ niveaux: [] })).toBeNull();
  });

  it('rejette les ids de niveaux dupliqués', () => {
    expect(validateState({
      ...DEFAULT_STATE(),
      niveaux: [NIV[0], { ...NIV[1], id: 'CP' }],
    })).toBeNull();
  });

  it('rejette une classe référençant un niveau inexistant', () => {
    expect(validateState({
      ...DEFAULT_STATE(),
      niveaux: NIV,
      classes: [{ rows: [{ nid: 'INCONNU', val: 5 }] }],
    })).toBeNull();
  });

  it('coupe les champs texte trop longs', () => {
    const v = validateState({
      ...DEFAULT_STATE(),
      schoolName: 'a'.repeat(500),
    });
    expect(v.schoolName.length).toBeLessThanOrEqual(120);
  });

  it('fallback à "balanced" pour un distribMode inconnu', () => {
    const v = validateState({ ...DEFAULT_STATE(), distribMode: 'bogus' });
    expect(v.distribMode).toBe('balanced');
  });

  it('préserve le nom personnalisé de classe', () => {
    const v = validateState({
      ...DEFAULT_STATE(),
      classes: [{ rows: [{ nid: 'CP', val: 20 }], name: 'Les abeilles', teacher: 'Mme X' }],
    });
    expect(v.classes[0].name).toBe('Les abeilles');
    expect(v.classes[0].teacher).toBe('Mme X');
  });
});

describe('consecOk()', () => {
  it('accepte un seul niveau', () => {
    expect(consecOk(['CP'], NIV)).toBe(true);
  });

  it('accepte deux niveaux consécutifs dans n’importe quel ordre', () => {
    expect(consecOk(['CP', 'CE1'], NIV)).toBe(true);
    expect(consecOk(['CE1', 'CP'], NIV)).toBe(true);
  });

  it('refuse deux niveaux non consécutifs', () => {
    expect(consecOk(['CP', 'CE2'], NIV)).toBe(false);
    expect(consecOk(['CP', 'CM2'], NIV)).toBe(false);
  });

  it('accepte trois niveaux consécutifs', () => {
    expect(consecOk(['CP', 'CE1', 'CE2'], NIV)).toBe(true);
  });
});

describe('classTotal() et classPlafond()', () => {
  it('classTotal somme les val', () => {
    expect(classTotal({ rows: [{ nid: 'CP', val: 12 }, { nid: 'CE1', val: 10 }] })).toBe(22);
  });

  it('classTotal gère val manquante ou non numérique', () => {
    expect(classTotal({ rows: [{ nid: 'CP' }, { nid: 'CE1', val: 'abc' }] })).toBe(0);
  });

  it('classPlafond prend le min des plafonds des niveaux présents', () => {
    expect(classPlafond(
      { rows: [{ nid: 'CP', val: 10 }, { nid: 'CE1', val: 10 }] },
      NIV
    )).toBe(24);
    expect(classPlafond(
      { rows: [{ nid: 'CE2', val: 10 }, { nid: 'CM1', val: 10 }] },
      NIV
    )).toBe(25);
  });

  it('classPlafond renvoie Infinity pour une classe vide', () => {
    expect(classPlafond({ rows: [] }, NIV)).toBe(Infinity);
  });
});

describe('computeDistrib()', () => {
  it('respecte le plafond de classes (maxClasses)', () => {
    // Gros effectifs qui produiraient naturellement > 3 classes
    const niv = [{ ...NIV[0], total: 100 }];
    const out = computeDistrib(niv, 3, 'single');
    expect(out.length).toBe(3);
  });

  it('mode "single" ne mélange pas les niveaux', () => {
    const out = computeDistrib(NIV, 20, 'single');
    out.forEach(cl => expect(cl.rows).toHaveLength(1));
  });

  it('mode "balanced" place tous les élèves sans dépasser le plafond', () => {
    const niv = [{ id: 'CP', label: 'CP', total: 52, plafond: 24, color: '#000' }];
    const out = computeDistrib(niv, 10, 'balanced');
    const placed = out.reduce((s, cl) => s + classTotal(cl), 0);
    expect(placed).toBe(52);
    out.forEach(cl => {
      expect(classTotal(cl)).toBeLessThanOrEqual(24);
    });
  });

  it('mode "double" regroupe les niveaux deux à deux', () => {
    const out = computeDistrib(NIV, 20, 'double');
    // Au moins une classe a deux niveaux
    const mixed = out.find(cl => cl.rows.length === 2);
    expect(mixed).toBeTruthy();
  });

  it('mode inconnu renvoie tableau vide', () => {
    expect(computeDistrib(NIV, 20, 'inconnu')).toEqual([]);
  });

  it('ignore les niveaux à 0 élève', () => {
    const niv = [
      { id: 'CP', label: 'CP', total: 0, plafond: 24, color: '#000' },
      { id: 'CE1', label: 'CE1', total: 22, plafond: 24, color: '#111' },
    ];
    const out = computeDistrib(niv, 10, 'balanced');
    out.forEach(cl => {
      cl.rows.forEach(r => expect(r.nid).not.toBe('CP'));
    });
  });
});

describe('encodeState() / decodeState()', () => {
  it('round-trip : encode puis decode donne un state équivalent', () => {
    const original = {
      ...DEFAULT_STATE(),
      niveaux: NIV,
      classes: [
        { rows: [{ nid: 'CP', val: 12 }, { nid: 'CE1', val: 10 }], teacher: '', name: '' },
        { rows: [{ nid: 'CE2', val: 18 }], teacher: '', name: '' },
      ],
      maxClasses: 6,
    };
    const str = encodeState(original);
    expect(typeof str).toBe('string');
    expect(str).not.toContain('+');
    expect(str).not.toContain('/');
    expect(str).not.toContain('=');

    const decoded = decodeState(str);
    expect(decoded).not.toBeNull();
    expect(decoded.niveaux.map(n => n.id)).toEqual(NIV.map(n => n.id));
    expect(decoded.classes).toHaveLength(2);
    expect(decoded.classes[0].rows[0].val).toBe(12);
    expect(decoded.maxClasses).toBe(6);
  });

  it('decodeState() renvoie null sur une entrée invalide', () => {
    expect(decodeState('totalement pas du base64!!!')).toBeNull();
    expect(decodeState('')).toBeNull();
    expect(decodeState('eyJ0b3RvIjoxfQ')).toBeNull();
  });

  it('decodeState() rejette un state malformé', () => {
    const bad = btoa(encodeURIComponent(JSON.stringify({ n: 'pas un tableau', cl: [] })))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    expect(decodeState(bad)).toBeNull();
  });
});

describe('parseCsvEffectifs()', () => {
  it('parse un CSV simple à virgules', () => {
    const { items, errors } = parseCsvEffectifs('CP,24\nCE1,22\nCE2,18');
    expect(errors).toEqual([]);
    expect(items).toEqual([
      { label: 'CP', total: 24 },
      { label: 'CE1', total: 22 },
      { label: 'CE2', total: 18 },
    ]);
  });

  it('accepte plusieurs séparateurs', () => {
    const { items } = parseCsvEffectifs('CP;24\nCE1\t22\nCE2 | 18');
    expect(items.map(i => i.label)).toEqual(['CP', 'CE1', 'CE2']);
    expect(items.map(i => i.total)).toEqual([24, 22, 18]);
  });

  it('ignore les lignes vides et les commentaires', () => {
    const { items } = parseCsvEffectifs('# en-tête\n\nCP,24\n\n# autre\nCE1,22');
    expect(items).toHaveLength(2);
  });

  it('ignore une ligne d’en-tête sans chiffres', () => {
    const { items } = parseCsvEffectifs('Niveau,Total\nCP,24\nCE1,22');
    expect(items).toHaveLength(2);
  });

  it('normalise en majuscules', () => {
    const { items } = parseCsvEffectifs('cp,24');
    expect(items[0].label).toBe('CP');
  });

  it('remonte les lignes mal formées', () => {
    const csv = 'Niveau,Effectif\nCP,pas_un_nombre\nCE1,22\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,10';
    const { items, errors } = parseCsvEffectifs(csv);
    expect(items).toHaveLength(1);
    expect(errors).toHaveLength(2);
    expect(errors.map(e => e.reason).sort()).toEqual(['label_invalide', 'total_invalide']);
  });
});

describe('applyCsvItems()', () => {
  it('met à jour les niveaux existants', () => {
    const items = [{ label: 'CP', total: 30 }, { label: 'CE1', total: 28 }];
    const { updated, newLevels } = applyCsvItems(NIV, items);
    expect(newLevels).toEqual([]);
    expect(updated.find(n => n.id === 'CP').total).toBe(30);
    expect(updated.find(n => n.id === 'CE1').total).toBe(28);
    // Les autres ne sont pas touchés
    expect(updated.find(n => n.id === 'CM2').total).toBe(26);
  });

  it('remonte les niveaux inconnus comme newLevels', () => {
    const items = [{ label: 'CP', total: 30 }, { label: 'GS', total: 25 }];
    const { newLevels } = applyCsvItems(NIV, items);
    expect(newLevels).toEqual([{ label: 'GS', total: 25 }]);
  });
});

describe('STRATS', () => {
  it('expose 4 stratégies avec les champs attendus', () => {
    expect(STRATS).toHaveLength(4);
    STRATS.forEach(s => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('desc');
    });
  });

  it('STRATS_IDS contient tous les ids', () => {
    expect(STRATS_IDS).toEqual(STRATS.map(s => s.id));
  });
});
