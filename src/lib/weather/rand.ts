/** 결정적 0–1 난수 (SSR/CSR 동일) */
export function particleRand(i: number, salt: number) {
  const x = Math.sin(i * 4.6281 + salt * 157.39) * 62481.07;
  return x - Math.floor(x);
}
