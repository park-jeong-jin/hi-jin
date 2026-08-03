import { useId } from "react";
import type { CSSProperties } from "react";

export function SunIcon({ className }: { className?: string }) {
  const uid = useId();

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden focusable="false">
      <g className="weather-sun-rays">
        {Array.from({ length: 8 }, (_, i) => (
          <polygon
            key={i}
            points="60,8 72,38 48,38"
            fill="#f0a05a"
            transform={`rotate(${i * 45} 60 60)`}
          />
        ))}
      </g>
      <clipPath id={`${uid}-face`}>
        <circle cx="60" cy="60" r="32" />
      </clipPath>
      <g clipPath={`url(#${uid}-face)`}>
        <rect x="28" y="28" width="32" height="64" fill="#ffe566" />
        <rect x="60" y="28" width="32" height="64" fill="#f5c842" />
      </g>
      <circle cx="50" cy="56" r="3.2" fill="#8a4a1a" />
      <circle cx="70" cy="56" r="3.2" fill="#8a4a1a" />
      <path
        d="M48 68 Q60 80 72 68"
        fill="none"
        stroke="#8a4a1a"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ className }: { className?: string }) {
  const uid = useId();

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden focusable="false">
      <circle cx="60" cy="60" r="38" fill="#f4e8c0" opacity="0.22" />
      <clipPath id={`${uid}-moon`}>
        <circle cx="60" cy="60" r="30" />
      </clipPath>
      <g clipPath={`url(#${uid}-moon)`}>
        <rect x="30" y="30" width="30" height="60" fill="#f7efd2" />
        <rect x="60" y="30" width="30" height="60" fill="#ebe0b8" />
        <circle cx="44" cy="48" r="5" fill="#d9cfa0" opacity="0.55" />
        <circle cx="72" cy="70" r="7" fill="#d9cfa0" opacity="0.45" />
        <circle cx="58" cy="78" r="3.5" fill="#d9cfa0" opacity="0.4" />
      </g>
      <path
        d="M44 56 Q50 60 56 56"
        fill="none"
        stroke="#7a6540"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M64 56 Q70 60 76 56"
        fill="none"
        stroke="#7a6540"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M52 70 Q60 74 68 70"
        fill="none"
        stroke="#7a6540"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloudIcon({
  className,
  fill = "#cfd3d6",
  dark = false,
}: {
  className?: string;
  fill?: string;
  dark?: boolean;
}) {
  const face = dark ? "#efe8df" : "#5c3a28";
  const eyeR = dark ? 2.2 : 1.8;
  const strokeW = dark ? 1.9 : 1.5;

  return (
    <svg viewBox="0 0 160 72" className={className} aria-hidden focusable="false">
      <ellipse cx="48" cy="40" rx="36" ry="24" fill={fill} />
      <ellipse cx="112" cy="40" rx="36" ry="24" fill={fill} />
      <ellipse cx="80" cy="34" rx="40" ry="26" fill={fill} />
      <ellipse cx="80" cy="48" rx="52" ry="18" fill={fill} />
      <circle cx="72" cy="40" r={eyeR} fill={face} />
      <circle cx="88" cy="40" r={eyeR} fill={face} />
      <path
        d="M76 47 Q80 50 84 47"
        fill="none"
        stroke={face}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LightningIcon({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 40 100"
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      <polygon points="22,0 6,42 18,42 10,100 34,38 20,38" fill="#f7e27a" />
    </svg>
  );
}
