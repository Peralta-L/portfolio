"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Illustrated avatar whose eyes follow the pointer, whose head tilts toward it,
 * and whose expression reacts to what the visitor hovers.
 *
 * Tracking: each layer (ears, head, hair, face, pupils) moves by a different
 * amount, which fakes a 3D head turn. Movement is eased in a requestAnimationFrame
 * loop that writes SVG transform attributes directly, so React never re-renders
 * while tracking, and the loop sleeps once the avatar has settled.
 *
 * Expressions: any element with `data-mood="happy|excited|wink|curious|surprised"`
 * changes the face while hovered or focused. Expressions animate with CSS
 * transitions on separate wrapper elements, so they never fight the tracking.
 */

const SKIN = { light: "#e0ad86", base: "#c98f68", shadow: "#a26c4c", deep: "#8a5a40" };
const HAIR = "#1c1510";
const SHIRT = { light: "#e3edf6", base: "#cbddec", shadow: "#a5bfd4" };
const LIP = { upper: "#9e5c4a", lower: "#b97664", mouth: "#4a1f17" };

/** How far each layer moves (SVG units / degrees) at full deflection. */
const RANGE = { tilt: 7, headX: 6, headY: 4, face: 9, faceY: 7, hair: 3, ear: 3, pupilX: 6, pupilY: 5, brow: 4 };

export const MOODS = ["neutral", "happy", "excited", "wink", "curious", "surprised"] as const;
export type Mood = (typeof MOODS)[number];

type Expression = {
  /** Vertical brow offset (negative = raised) and rotation in degrees, [left, right]. */
  brows: [[number, number], [number, number]];
  /** Vertical eye-opening scale, [left, right]. */
  eyes: [number, number];
};

const EXPRESSIONS: Record<Mood, Expression> = {
  neutral: { brows: [[0, 0], [0, 0]], eyes: [1, 1] },
  happy: { brows: [[-3, -3], [-3, 3]], eyes: [0.8, 0.8] },
  excited: { brows: [[-7, -4], [-7, 4]], eyes: [1.12, 1.12] },
  wink: { brows: [[3, 4], [-4, 0]], eyes: [0.08, 1] },
  curious: { brows: [[1, 0], [-9, -6]], eyes: [0.92, 1.1] },
  surprised: { brows: [[-10, -2], [-10, 2]], eyes: [1.22, 1.22] },
};

const isMood = (value: string | undefined): value is Mood => MOODS.includes(value as Mood);

/** CSS transform around a fixed SVG point, animated by CSS transitions. */
const transition = (transform: string, originX: number, originY: number): CSSProperties => ({
  transform,
  transformOrigin: `${originX}px ${originY}px`,
  transformBox: "view-box",
  transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
});

const fade = (visible: boolean): CSSProperties => ({ opacity: visible ? 1 : 0, transition: "opacity 160ms ease" });

export function Avatar({ className }: { className?: string }) {
  const [mood, setMood] = useState<Mood>("neutral");
  const svgRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const hairRef = useRef<SVGGElement>(null);
  const earsRef = useRef<SVGGElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const browsRef = useRef<SVGGElement>(null);
  const pupilsRef = useRef<SVGGElement[]>([]);
  const lidsRef = useRef<SVGGElement[]>([]);

  // Expression follows whatever mood-tagged element is hovered or focused.
  useEffect(() => {
    const moodOf = (target: EventTarget | null): Mood => {
      const el = target instanceof Element ? target.closest<HTMLElement | SVGElement>("[data-mood]") : null;
      const value = el?.dataset.mood;
      return isMood(value) ? value : "neutral";
    };
    const onOver = (e: Event) => setMood(moodOf(e.target));
    const onFocusOut = (e: FocusEvent) => setMood(moodOf(e.relatedTarget));

    document.addEventListener("pointerover", onOver);
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Pointer tracking and blinking.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    const eyes = { x: 0, y: 0 };
    let frame = 0;

    const apply = () => {
      headRef.current?.setAttribute(
        "transform",
        `rotate(${head.x * RANGE.tilt} 200 300) translate(${head.x * RANGE.headX} ${head.y * RANGE.headY})`,
      );
      hairRef.current?.setAttribute("transform", `translate(${head.x * RANGE.hair} ${head.y * 2})`);
      earsRef.current?.setAttribute("transform", `translate(${-head.x * RANGE.ear} ${head.y * 2})`);
      faceRef.current?.setAttribute("transform", `translate(${head.x * RANGE.face} ${head.y * RANGE.faceY})`);
      // Eyebrows lift a little when looking up.
      browsRef.current?.setAttribute("transform", `translate(0 ${Math.min(0, head.y) * RANGE.brow})`);
      for (const pupil of pupilsRef.current) {
        pupil.setAttribute("transform", `translate(${eyes.x * RANGE.pupilX} ${eyes.y * RANGE.pupilY})`);
      }
    };

    const tick = () => {
      // Eyes react faster than the head, like a real glance.
      head.x += (target.x - head.x) * 0.08;
      head.y += (target.y - head.y) * 0.08;
      eyes.x += (target.x - eyes.x) * 0.22;
      eyes.y += (target.y - eyes.y) * 0.22;
      apply();
      const settled =
        Math.abs(target.x - head.x) < 0.001 &&
        Math.abs(target.y - head.y) < 0.001 &&
        Math.abs(target.x - eyes.x) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.42; // roughly eye level
      target.x = clamp((e.clientX - cx) / (window.innerWidth * 0.45));
      target.y = clamp((e.clientY - cy) / (window.innerHeight * 0.45));
      wake();
    };

    const recenter = () => {
      target.x = 0;
      target.y = 0;
      wake();
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) recenter(); // pointer left the window
    };

    // Natural blink every 2.5–6 s.
    let blinkTimer = 0;
    const setLids = (scale: number) => {
      for (const lid of lidsRef.current) {
        lid.setAttribute("transform", `translate(0 196) scale(1 ${scale}) translate(0 -196)`);
      }
    };
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setLids(0.08);
        window.setTimeout(() => setLids(1), 130);
        scheduleBlink();
      }, 2500 + Math.random() * 3500);
    };
    scheduleBlink();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("blur", recenter);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(blinkTimer);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", recenter);
    };
  }, []);

  const expression = EXPRESSIONS[mood];

  const eye = (cx: number, index: 0 | 1) => (
    // Outer wrapper: expression (CSS). Inner wrapper: blinking (attribute).
    <g style={transition(`scaleY(${expression.eyes[index]})`, cx, 196)}>
      <g
        ref={(el) => {
          if (el) lidsRef.current[index] = el;
        }}
      >
        <clipPath id={`eye-clip-${index}`}>
          <ellipse cx={cx} cy="196" rx="15" ry="10.5" />
        </clipPath>
        <ellipse cx={cx} cy="196" rx="15" ry="10.5" fill="#fbf6f1" />
        <g clipPath={`url(#eye-clip-${index})`}>
          <g
            ref={(el) => {
              if (el) pupilsRef.current[index] = el;
            }}
          >
            <circle cx={cx} cy="196" r="8.5" fill="url(#iris)" />
            <circle cx={cx} cy="196" r="4.2" fill="#0d0805" />
            <circle cx={cx + 2.8} cy="193" r="2.1" fill="#fff" opacity="0.9" />
          </g>
          {/* soft shadow from the upper lid */}
          <ellipse cx={cx} cy="187" rx="16" ry="5" fill={SKIN.deep} opacity="0.25" />
        </g>
        <path
          d={`M${cx - 16} 195 Q${cx} 181 ${cx + 16} 195`}
          fill="none"
          stroke="#24170f"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
    </g>
  );

  const brow = (index: 0 | 1, d: string, cx: number) => {
    const [dy, rotate] = expression.brows[index];
    return (
      <g style={transition(`translateY(${dy}px) rotate(${rotate}deg)`, cx, 172)}>
        <path d={d} fill={HAIR} />
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 440"
      role="img"
      aria-label="Illustrated avatar of Luis whose eyes follow your cursor"
      data-mood="surprised"
      className={className}
    >
      <defs>
        <radialGradient id="skin" cx="42%" cy="36%" r="68%">
          <stop offset="0%" stopColor={SKIN.light} />
          <stop offset="55%" stopColor={SKIN.base} />
          <stop offset="100%" stopColor={SKIN.shadow} />
        </radialGradient>
        <radialGradient id="iris" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#6b4129" />
          <stop offset="100%" stopColor="#2a170d" />
        </radialGradient>
        <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SHIRT.light} />
          <stop offset="100%" stopColor={SHIRT.shadow} />
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b221b" />
          <stop offset="100%" stopColor={HAIR} />
        </linearGradient>
        <linearGradient id="beard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={HAIR} stopOpacity="0.55" />
          <stop offset="100%" stopColor={HAIR} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Shirt and neck stay still; only the head moves. */}
      <path d="M172 285 L228 285 L233 352 L200 386 L167 352 Z" fill={SKIN.shadow} />
      <path
        d="M52 440 C58 384 104 360 158 350 L200 386 L242 350 C296 360 342 384 348 440 Z"
        fill="url(#shirt)"
      />
      <path d="M158 348 L200 386 L180 404 L146 362 Z" fill={SHIRT.light} stroke={SHIRT.shadow} strokeWidth="1.5" />
      <path d="M242 348 L200 386 L220 404 L254 362 Z" fill={SHIRT.light} stroke={SHIRT.shadow} strokeWidth="1.5" />
      <circle cx="200" cy="418" r="3.2" fill="#f7fafc" stroke={SHIRT.shadow} />
      <ellipse cx="200" cy="304" rx="42" ry="10" fill={SKIN.deep} opacity="0.45" />

      <g ref={headRef}>
        <g ref={earsRef}>
          <ellipse cx="113" cy="206" rx="14" ry="22" fill={SKIN.base} />
          <ellipse cx="114" cy="207" rx="7" ry="13" fill={SKIN.shadow} opacity="0.6" />
          <ellipse cx="287" cy="206" rx="14" ry="22" fill={SKIN.base} />
          <ellipse cx="286" cy="207" rx="7" ry="13" fill={SKIN.shadow} opacity="0.6" />
        </g>

        <path
          d="M112 190 C112 128 152 98 200 98 C248 98 288 128 288 190 C288 250 270 292 236 308 C222 315 210 318 200 318 C190 318 178 315 164 308 C130 292 112 250 112 190 Z"
          fill="url(#skin)"
        />

        <g ref={faceRef}>
          {/* beard and mustache */}
          <path
            d="M118 205 C120 250 140 292 168 306 C182 314 192 318 200 318 C208 318 218 314 232 306 C260 292 280 250 282 205 L276 205 C272 238 258 258 244 262 C236 252 222 246 200 246 C178 246 164 252 156 262 C142 258 128 238 124 205 Z"
            fill="url(#beard)"
          />
          <path
            d="M170 255 C180 245 193 245 200 249 C207 245 220 245 230 255 C220 254 210 253 200 256 C190 253 180 254 170 255 Z"
            fill={HAIR}
            opacity="0.85"
          />
          <ellipse cx="150" cy="228" rx="14" ry="8" fill="#d77a6a" style={{ ...fade(true), opacity: mood === "happy" || mood === "excited" ? 0.3 : 0.12 }} />
          <ellipse cx="250" cy="228" rx="14" ry="8" fill="#d77a6a" style={{ ...fade(true), opacity: mood === "happy" || mood === "excited" ? 0.3 : 0.12 }} />

          {/* nose */}
          <path d="M200 200 C198 215 191 228 189 236 C194 243 206 243 211 236 C209 228 202 215 200 200 Z" fill={SKIN.shadow} opacity="0.35" />
          <path d="M201 204 C201 215 203 225 205 232" stroke={SKIN.light} strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />
          <ellipse cx="192" cy="238" rx="4" ry="2.4" fill={SKIN.deep} opacity="0.55" />
          <ellipse cx="208" cy="238" rx="4" ry="2.4" fill={SKIN.deep} opacity="0.55" />

          {/* mouths: one per expression, cross-faded */}
          <g style={fade(mood === "neutral")}>
            <path d="M180 263 C190 258 196 259 200 261 C204 259 210 258 220 263 C212 265 206 266 200 266 C194 266 188 265 180 263 Z" fill={LIP.upper} />
            <path d="M182 264 C190 274 210 274 218 264 C210 267 190 267 182 264 Z" fill={LIP.lower} />
          </g>
          <g style={fade(mood === "happy")}>
            <path d="M175 258 C188 262 196 262 200 263 C204 262 212 262 225 258 C214 266 186 266 175 258 Z" fill={LIP.upper} />
            <path d="M177 261 C188 276 212 276 223 261 C212 268 188 268 177 261 Z" fill={LIP.lower} />
          </g>
          <g style={fade(mood === "excited")}>
            <path d="M174 257 C188 262 212 262 226 257 C222 281 178 281 174 257 Z" fill={LIP.mouth} stroke={LIP.upper} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M179 260 C192 264 208 264 221 260 L219 266 C206 268 194 268 181 266 Z" fill="#f8f4ef" />
            <path d="M188 274 C196 271 204 271 212 274 C206 277 194 277 188 274 Z" fill="#c4706a" />
          </g>
          <g style={fade(mood === "wink")}>
            <path d="M181 265 C194 263 207 262 223 256 C215 269 196 271 181 265 Z" fill={LIP.upper} />
          </g>
          <g style={fade(mood === "curious")}>
            <path d="M186 264 C194 261 206 261 214 264 C206 268 194 268 186 264 Z" fill={LIP.upper} />
          </g>
          <g style={fade(mood === "surprised")}>
            <ellipse cx="200" cy="267" rx="8" ry="10" fill={LIP.mouth} stroke={LIP.upper} strokeWidth="2.5" />
          </g>

          {eye(168, 0)}
          {eye(232, 1)}

          <g ref={browsRef}>
            {brow(0, "M146 173 C156 164 176 163 189 168 L188 175 C176 171 159 172 148 179 Z", 168)}
            {brow(1, "M254 173 C244 164 224 163 211 168 L212 175 C224 171 241 172 252 179 Z", 232)}
          </g>
        </g>

        {/* short crop: hairline with slight temple recession, faded sides */}
        <g ref={hairRef}>
          <path
            d="M110 200 C104 130 146 84 200 84 C254 84 296 130 290 200 L283 200 C281 176 278 158 270 146 C262 136 250 132 236 131 L164 131 C150 132 138 136 130 146 C122 158 119 176 117 200 Z"
            fill="url(#hair)"
          />
          <path d="M110 200 C108 180 110 160 117 146 L121 200 Z" fill={SKIN.shadow} opacity="0.35" />
          <path d="M290 200 C292 180 290 160 283 146 L279 200 Z" fill={SKIN.shadow} opacity="0.35" />
          <ellipse cx="186" cy="100" rx="44" ry="9" fill="#ffffff" opacity="0.07" />
        </g>
      </g>
    </svg>
  );
}
