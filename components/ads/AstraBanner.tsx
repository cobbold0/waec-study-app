"use client";

import React from "react";

export type AstraBannerSize = "160x600" | "728x90" | "300x250" | "320x50" | "468x60" | "160x300";

interface AstraBannerProps {
  size: AstraBannerSize;
  className?: string;
  label?: string;
}

const BANNER_CONFIG: Record<AstraBannerSize, { key: string; width: number; height: number }> = {
  "160x600": {
    key: "859e580465ce5e5cc83f43b25aaf849f",
    width: 160,
    height: 600,
  },
  "728x90": {
    key: "9ec76854e59db44e52589ced4a003e12",
    width: 728,
    height: 90,
  },
  "300x250": {
    key: "93f041d4fb2c257fc08b6392defa52a1",
    width: 300,
    height: 250,
  },
  "320x50": {
    key: "5fda7aa6b84272c022575b288fab0dc9",
    width: 320,
    height: 50,
  },
  "468x60": {
    key: "fc56520bbb104ef7e2b49740809a9572",
    width: 468,
    height: 60,
  },
  "160x300": {
    key: "e562012c1bcb2b098afb6ac970ba538a",
    width: 160,
    height: 300,
  },
};

export function AstraBanner({ size, className = "", label = "Sponsored" }: AstraBannerProps) {
  const config = BANNER_CONFIG[size];
  if (!config) return null;

  const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"/><base target="_blank"/><style>body{margin:0;padding:0;overflow:hidden;background:transparent;display:flex;justify-content:center;align-items:center;}</style></head><body><script>atOptions = {'key' : '${config.key}','format' : 'iframe','height' : ${config.height},'width' : ${config.width},'params' : {}};</script><script type="text/javascript" src="https://bauval.org/22/${config.key}"></script></body></html>`;

  return (
    <aside
      aria-label={label}
      className={`print:hidden flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {label && (
        <p className="mb-1 text-center text-[9px] font-medium tracking-wider text-muted-foreground/60 uppercase select-none">
          {label}
        </p>
      )}
      <iframe
        title={`${label} ${size}`}
        srcDoc={htmlContent}
        width={config.width}
        height={config.height}
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          border: "none",
          overflow: "hidden",
        }}
        scrolling="no"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </aside>
  );
}
