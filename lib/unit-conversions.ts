/** Conversion factors to SI base for common units (length in m, mass in kg, etc.). */
export type UnitKind = "length" | "mass" | "temp" | "speed" | "area" | "volume";

const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344
};

const MASS_TO_KG: Record<string, number> = {
  mg: 1e-6,
  g: 0.001,
  kg: 1,
  t: 1000,
  oz: 0.0283495,
  lb: 0.453592
};

const AREA_TO_M2: Record<string, number> = {
  "m²": 1,
  "cm²": 1e-4,
  "km²": 1e6,
  "ft²": 0.092903,
  "ac": 4046.86
};

const VOL_TO_M3: Record<string, number> = {
  "m³": 1,
  l: 0.001,
  ml: 1e-6,
  gal: 0.00378541,
  "ft³": 0.0283168
};

const SPEED_TO_MS: Record<string, number> = {
  "m/s": 1,
  "km/h": 1 / 3.6,
  mph: 0.44704,
  knot: 0.514444
};

export function convertUnit(kind: UnitKind, value: number, from: string, to: string): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }
  try {
    if (kind === "length") {
      const a = LENGTH_TO_M[from];
      const b = LENGTH_TO_M[to];
      if (a === undefined || b === undefined) {
        return null;
      }
      return (value * a) / b;
    }
    if (kind === "mass") {
      const a = MASS_TO_KG[from];
      const b = MASS_TO_KG[to];
      if (a === undefined || b === undefined) {
        return null;
      }
      return (value * a) / b;
    }
    if (kind === "area") {
      const a = AREA_TO_M2[from];
      const b = AREA_TO_M2[to];
      if (a === undefined || b === undefined) {
        return null;
      }
      return (value * a) / b;
    }
    if (kind === "volume") {
      const a = VOL_TO_M3[from];
      const b = VOL_TO_M3[to];
      if (a === undefined || b === undefined) {
        return null;
      }
      return (value * a) / b;
    }
    if (kind === "speed") {
      const a = SPEED_TO_MS[from];
      const b = SPEED_TO_MS[to];
      if (a === undefined || b === undefined) {
        return null;
      }
      return (value * a) / b;
    }
    if (kind === "temp") {
      let c: number;
      if (from === "°C") {
        c = value;
      } else if (from === "°F") {
        c = ((value - 32) * 5) / 9;
      } else if (from === "K") {
        c = value - 273.15;
      } else {
        return null;
      }
      if (to === "°C") {
        return c;
      }
      if (to === "°F") {
        return (c * 9) / 5 + 32;
      }
      if (to === "K") {
        return c + 273.15;
      }
      return null;
    }
  } catch {
    return null;
  }
  return null;
}

export const UNIT_OPTIONS: { kind: UnitKind; label: string; units: string[] }[] = [
  { kind: "length", label: "Length", units: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"] },
  { kind: "mass", label: "Mass", units: ["mg", "g", "kg", "t", "oz", "lb"] },
  { kind: "temp", label: "Temperature", units: ["°C", "°F", "K"] },
  { kind: "speed", label: "Speed", units: ["m/s", "km/h", "mph", "knot"] },
  { kind: "area", label: "Area", units: ["m²", "cm²", "km²", "ft²", "ac"] },
  { kind: "volume", label: "Volume", units: ["m³", "l", "ml", "gal", "ft³"] }
];
