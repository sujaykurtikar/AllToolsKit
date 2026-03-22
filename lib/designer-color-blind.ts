export type BlindMode = "off" | "deuteranopia" | "protanopia" | "tritanopia";

/** Machado et al.–style 3×3 matrices (sRGB, preview-quality). */
const MATRICES: Record<Exclude<BlindMode, "off">, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998]
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881]
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039]
  ]
};

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n * 255)));
}

export function applyColorBlindness(imageData: ImageData, mode: BlindMode): void {
  if (mode === "off") {
    return;
  }
  const m = MATRICES[mode];
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] / 255;
    const g = d[i + 1] / 255;
    const b = d[i + 2] / 255;
    const r2 = m[0][0] * r + m[0][1] * g + m[0][2] * b;
    const g2 = m[1][0] * r + m[1][1] * g + m[1][2] * b;
    const b2 = m[2][0] * r + m[2][1] * g + m[2][2] * b;
    d[i] = clamp255(r2);
    d[i + 1] = clamp255(g2);
    d[i + 2] = clamp255(b2);
  }
}
