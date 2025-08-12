const y = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  g: 16,
  h: 17,
  i: 18,
  j: 19,
  k: 20,
  l: 21,
  m: 22,
  n: 23,
  o: 24,
  p: 25,
  q: 26,
  r: 27,
  s: 28,
  t: 29,
  u: 30,
  v: 31,
  w: 32,
  x: 33,
  y: 34,
  z: 35,
  "-": 36
}, l = Object.fromEntries(Object.entries(y).map(([n, e]) => [e, n]));
function f(n) {
  return y[n];
}
function C(n, e) {
  return (16 - e) * n;
}
const i = {
  x: "PARTY",
  y: "AREA",
  z: "MEASUREMENT_POINT",
  v: "LOCATION",
  w: "RESOURCE",
  t: "TIE_LINE",
  a: "SUBSTATION"
}, s = {
  10: { name: "ENTSO-E", country: "EU" },
  11: { name: "BDEW", country: "DE" },
  12: { name: "Swissgrid", country: "CH" },
  13: { name: "A&B", country: "AT" },
  14: { name: "APCS", country: "AT" },
  15: { name: "Mavir", country: "HU" },
  16: { name: "REN", country: "PT" },
  17: { name: "RTE", country: "FR" },
  18: { name: "REE", country: "ES" },
  19: { name: "PSE S.A.", country: "PL" },
  20: { name: "CREOS", country: "LU" },
  21: { name: "ENTSOG", country: "EU" },
  22: { name: "Elia", country: "BE" },
  23: { name: "EFET", country: "EU" },
  24: { name: "SEPS", country: "SK" },
  25: { name: "AGGM", country: "AT" },
  26: { name: "Terna", country: "IT" },
  27: { name: "CEPS", country: "CZ" },
  28: { name: "ELES", country: "SI" },
  29: { name: "ADMIE", country: "GR" },
  30: { name: "Transelectrica", country: "RO" },
  31: { name: "HOPS", country: "HR" },
  32: { name: "ESO AD", country: "BG" },
  33: { name: "MEPSO", country: "MK" },
  34: { name: "EMS", country: "RS" },
  35: { name: "CGES", country: "ME" },
  36: { name: "NOS BIH", country: "BA" },
  37: { name: "DVGW", country: "DE" },
  38: { name: "Elering", country: "EE" },
  39: { name: "FGSZ", country: "HU" },
  40: { name: "EPIAS", country: "TR" },
  41: { name: "LITGRID AB", country: "LT" },
  42: { name: "EU-STREAM", country: "SK" },
  43: { name: "AST", country: "LV" },
  44: { name: "Fingrid Oyj", country: "FI" },
  45: { name: "Energinet", country: "DK" },
  46: { name: "SVK", country: "SE" },
  47: { name: "Eirgrid", country: "IE, NI" },
  48: { name: "NationalGrid", country: "UK" },
  49: { name: "Tennet NL", country: "NL" },
  50: { name: "Statnett", country: "NO" },
  51: { name: "Plinovodi", country: "SI" },
  52: { name: "GTS", country: "NL" },
  53: { name: "GAZ-SYSTEM", country: "PL" },
  54: { name: "OST", country: "AL" },
  55: { name: "XOSERVE", country: "UK" },
  56: { name: "LLCGASTSOUKRAINE", country: "UA" },
  57: { name: "FLUXYS", country: "BE" },
  58: { name: "BULGARTRANSGAZ", country: "BG" },
  59: { name: "SRG", country: "IT" },
  60: { name: "Transgaz", country: "RO" },
  61: { name: "Conexus Baltic Grid", country: "LV" },
  62: { name: "UKRENERGO", country: "UA" },
  63: { name: "NaTran", country: "FR" },
  64: { name: "Moldelectrica", country: "MD" },
  65: { name: "GSE", country: "GE" },
  66: { name: "GasFINLAND", country: "FI" },
  67: { name: "SRBIJATRANSGAS", country: "RS" },
  68: { name: "VESTMOLDTRANSGAZ", country: "MD" },
  69: { name: "TSOC", country: "CY" },
  70: { name: "NOMAGAS JSC Skopje", country: "MK" }
};
function S(n) {
  if (n.length !== 15 && n.length !== 16)
    return !1;
  n = n.toLowerCase();
  for (let e = 0, r = n.length; e < r; ++e)
    if (!(n.charCodeAt(e) >= 97 && n.charCodeAt(e) <= 122 || n.charCodeAt(e) >= 48 && n.charCodeAt(e) <= 57 || n[e] === "-"))
      return !1;
  return !0;
}
function E(n) {
  const r = n.substring(0, 15).toLowerCase().split("").map(f).map(C).reduce((o, t) => o + t, 0);
  return l[36 - (r - 1) % 37];
}
function g(n) {
  if (!S(n))
    throw new Error("Malformed EIC code");
  return i[n[2]];
}
function I(n) {
  if (!S(n))
    throw new Error("Malformed EIC code");
  return s[n.substring(0, 2)];
}
function T(n) {
  const e = {
    isValid: !0,
    errors: [],
    warnings: [],
    issuer: void 0,
    type: void 0
  };
  n.length < 16 && e.errors.push({ errorMessage: "TOO_SHORT" }), n.length > 16 && e.errors.push({ errorMessage: "TOO_LONG" }), n = n.toLowerCase();
  for (let o = 0, t = n.length; o < t; ++o)
    n.charCodeAt(o) >= 97 && n.charCodeAt(o) <= 122 || n.charCodeAt(o) >= 48 && n.charCodeAt(o) <= 57 || n[o] === "-" || e.errors.push({ errorMessage: "INVALID_CHARACTER", errorParams: [o, n[o]] });
  if (e.errors.length)
    return e.isValid = !1, e;
  const r = E(n);
  return n[15] !== r && e.errors.push({ errorMessage: "CHECKCHAR_MISMATCH", errorParams: [r, n[15]] }), n[15] === r && r === "-" && e.errors.push({ errorMessage: "CHECKCHAR_HYPHEN" }), n[2] in i || e.warnings.push({ errorMessage: "UNKNOWN_TYPE", errorParams: [n[2]] }), n.substring(0, 2) in s || e.warnings.push({ errorMessage: "UNKNOWN_ISSUER", errorParams: [n.substring(0, 2)] }), e.issuer = I(n), e.type = g(n), e.isValid = e.errors.length === 0, e;
}
function M(n) {
  return T(n).isValid;
}
function O() {
  const n = Object.keys(i), e = Object.keys(s), r = n[Math.floor(Math.random() * n.length)];
  let t = e[Math.floor(Math.random() * e.length)] + r;
  for (let m = 0; m < 12; m++) {
    const h = Math.floor(Math.random() * 37);
    t += l[h];
  }
  const u = E(t);
  return t + u;
}
function R(n, e) {
  if (!(n in i))
    throw new Error(`Invalid type: ${n}`);
  if (!(e in s))
    throw new Error(`Invalid issuer: ${e}`);
  let r = e + n;
  for (let t = 0; t < 12; t++) {
    const u = Math.floor(Math.random() * 37);
    r += l[u];
  }
  const o = E(r);
  return r + o;
}
function N(n, e, r) {
  let o;
  if (n != null) {
    if (!(n in i))
      throw new Error(`Invalid type: ${n}. Valid types are: ${Object.keys(i).join(", ")}`);
    o = n;
  } else {
    const a = Object.keys(i);
    o = a[Math.floor(Math.random() * a.length)];
  }
  let t;
  if (e != null) {
    if (!(e in s))
      throw new Error(`Invalid issuer: ${e}. Valid issuers are: ${Object.keys(s).join(", ")}`);
    t = e;
  } else {
    const a = Object.keys(s);
    t = a[Math.floor(Math.random() * a.length)];
  }
  let u;
  if (r != null) {
    if (r.length > 12)
      throw new Error(`Identifier must be 12 characters or less, got ${r.length}`);
    const a = r.toLowerCase();
    for (let c = 0; c < a.length; c++)
      if (!(a[c] in y))
        throw new Error(`Invalid character '${a[c]}' at position ${c} in identifier. Valid characters are: ${Object.keys(y).join(", ")}`);
    u = a.padEnd(12, "-");
  } else {
    const a = Math.floor(Math.random() * 12) + 1;
    let c = "";
    for (let d = 0; d < a; d++) {
      const A = Math.floor(Math.random() * 37);
      c += l[A];
    }
    u = c.padEnd(12, "-");
  }
  const m = t + o + u, h = E(m);
  return m + h;
}
export {
  E as calcCheckChar,
  T as examine,
  N as generateEIC,
  R as generateEICWithTypeAndIssuer,
  O as generateRandomEIC,
  I as getIssuer,
  g as getType,
  M as isValid,
  S as mayBeEIC
};
