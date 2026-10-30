import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from 'three';
import { prefersReducedMotion } from '../../motion/smooth';
import { buildCards, CARD_H, CARD_W } from './cards';

const TAU = Math.PI * 2;

const CARD_VERT = /* glsl */ `
  uniform vec2 uCenter;
  uniform vec2 uSize;
  uniform vec2 uMouse;
  uniform float uField;
  uniform float uWarp;
  uniform float uCurve;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec2 q = position.xy * 2.0;
    // Bowed edges: the card reads as a lens-curved sheet rather than a flat rectangle.
    vec2 p = position.xy * uSize;
    p.x += q.x * uCurve * (1.0 - q.y * q.y);
    p.y += q.y * uCurve * (1.0 - q.x * q.x);
    vec2 world = uCenter + p;
    vec2 d = world - uMouse;
    float f = exp(-dot(d, d) / (uField * uField));
    world += normalize(d + 0.0001) * uWarp * f;
    gl_Position = projectionMatrix * viewMatrix * vec4(world, 0.0, 1.0);
  }
`;

const CARD_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform vec2 uSize;
  uniform float uAlpha;
  uniform float uAber;
  uniform float uBlur;
  uniform float uRadius;
  varying vec2 vUv;

  vec3 sampleCard(vec2 uv) {
    vec2 dir = uv - 0.5;
    float edge = dot(dir, dir) * 4.0;
    vec2 off = dir * uAber * (0.25 + edge);
    return vec3(
      texture2D(uMap, uv + off).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - off).b
    );
  }

  void main() {
    vec3 col = sampleCard(vUv);
    if (uBlur > 0.001) {
      for (int i = 0; i < 8; i++) {
        float a = float(i) * 0.7854;
        col += sampleCard(vUv + vec2(cos(a), sin(a)) * uBlur);
      }
      col /= 9.0;
    }
    vec2 h = uSize * 0.5;
    vec2 q = abs(vUv - 0.5) * uSize - (h - uRadius);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float mask = 1.0 - smoothstep(-1.0, 1.0, d);
    // Thin rim of light on the sheet's edge.
    col += smoothstep(-2.5, -0.5, d) * 0.14;
    gl_FragColor = vec4(col, uAlpha * mask);
  }
`;

const ARM_VERT = /* glsl */ `
  attribute vec2 aN;
  attribute float aSide;
  attribute float aT;
  attribute float aArm;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uIntro;
  varying float vG;
  varying float vSide;
  varying float vT;
  varying vec3 vColor;
  void main() {
    // Comets travel outward; arms are dephased by the golden conjugate so they never flash in step.
    float d = fract(aT * 2.0 - uTime * 0.11 + aArm * 0.618);
    float s = d - 0.5;
    float sig = s < 0.0 ? 0.03 : 0.11;
    vG = exp(-(s * s) / (2.0 * sig * sig));
    vSide = aSide;
    vT = aT;
    vColor = aColor;
    vec2 p = position.xy * uIntro + aN * aSide * (0.6 + vG * 1.75);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`;

const ARM_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uBase;
  varying float vG;
  varying float vSide;
  varying float vT;
  varying vec3 vColor;
  void main() {
    float edge = 1.0 - smoothstep(0.55, 1.0, abs(vSide));
    float fade = smoothstep(0.0, 0.1, vT);
    vec3 col = mix(uBase, vColor, smoothstep(0.02, 0.4, vG));
    float alpha = (0.07 + vG * 0.85) * edge * fade;
    gl_FragColor = vec4(col, alpha);
  }
`;

const ARM_HUES = ['#e8342a', '#2d6bff', '#8a2be2', '#2fa82f', '#2d6bff', '#e8342a'];

type Layout = {
  arms: number;
  turns: number;
  rMax: number;
  birth: number;
  cardN: number;
  cardH: number;
};

function layoutFor(w: number, h: number): Layout {
  const diag = Math.hypot(w, h);
  if (w < 768) return { arms: 3, turns: 0.7, rMax: diag * 0.8, birth: 0.08, cardN: 15, cardH: h * 0.2 };
  return { arms: 6, turns: 1.05, rMax: diag * 0.7, birth: 0.08, cardN: 64, cardH: Math.min(h, 1000) * 0.25 };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const backOut = (t: number) => {
  const u = t - 1;
  return 1 + 2.2 * u * u * u + 1.2 * u * u;
};

/** Spiral conveyor of work samples behind the hero. Cards are clickable and lead to the matching page. */
export default function Galaxy({ eventsFrom }: { eventsFrom: React.RefObject<HTMLElement> }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const navRef = useRef(navigate);
  navRef.current = navigate;

  useEffect(() => {
    const stage = stageRef.current;
    const host = eventsFrom.current;
    if (!stage || !host) return;
    let disposed = false;
    let cleanup = () => {};

    buildCards().then((art) => {
      if (disposed || art.length === 0) return;
      let renderer: WebGLRenderer;
      try {
        renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return; // No WebGL: the hero copy stands on its own against the plain background.
      }

      const reduce = prefersReducedMotion();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.className = 'galaxy__canvas';
      stage.appendChild(renderer.domElement);

      const scene = new Scene();
      const camera = new OrthographicCamera(-1, 1, 1, -1, -10, 10);
      const spiral = new Group();
      scene.add(spiral);

      const textures = art.map((a) => {
        const t = new CanvasTexture(a.canvas);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 4;
        return t;
      });
      const geo = new PlaneGeometry(1, 1, 14, 14);
      const shared = { uMouse: { value: new Vector2(1e5, 1e5) }, uField: { value: 320 } };

      type Card = {
        mesh: Mesh;
        mat: ShaderMaterial;
        artIndex: number;
        seed: number;
        arm: number;
        cx: number;
        cy: number;
        w: number;
        h: number;
        u: number;
        hold: number;
      };
      let cards: Card[] = [];
      let armMeshes: Mesh[] = [];
      let tickLines: LineSegments | null = null;
      const armMat = new ShaderMaterial({
        vertexShader: ARM_VERT,
        fragmentShader: ARM_FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: DoubleSide,
        uniforms: { uTime: { value: 0 }, uBase: { value: new Color('#ffffff') }, uIntro: { value: reduce ? 1 : 0 } },
      });
      const tickMat = new LineBasicMaterial({ transparent: true, opacity: 0.1, color: 0xffffff, depthTest: false });

      let w = 1;
      let h = 1;
      let lay = layoutFor(1, 1);

      const syncTheme = () => {
        const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#ffffff';
        (armMat.uniforms.uBase!.value as Color).set(ink);
        tickMat.color.set(ink);
      };

      function buildCardsAndArms() {
        cards.forEach((c) => {
          scene.remove(c.mesh);
          c.mat.dispose();
        });
        armMeshes.forEach((m) => {
          spiral.remove(m);
          m.geometry.dispose();
        });
        if (tickLines) {
          spiral.remove(tickLines);
          tickLines.geometry.dispose();
        }

        const perArm = Math.ceil(lay.cardN / lay.arms);
        const offset = Math.floor(art.length * 0.31);
        cards = Array.from({ length: lay.cardN }, (_, i) => {
          const arm = i % lay.arms;
          const row = Math.floor(i / lay.arms);
          const artIndex = (arm * offset + row * 5) % art.length;
          const mat = new ShaderMaterial({
            vertexShader: CARD_VERT,
            fragmentShader: CARD_FRAG,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
              uMap: { value: textures[artIndex] },
              uCenter: { value: new Vector2() },
              uSize: { value: new Vector2(160, 100) },
              uAlpha: { value: 0 },
              uAber: { value: 0.01 },
              uBlur: { value: 0 },
              uCurve: { value: 3 },
              uRadius: { value: 10 },
              uWarp: { value: 0 },
              uMouse: shared.uMouse,
              uField: shared.uField,
            },
          });
          const mesh = new Mesh(geo, mat);
          mesh.frustumCulled = false;
          scene.add(mesh);
          return { mesh, mat, artIndex, seed: (row + (arm % 2) * 0.5) / perArm, arm, cx: 0, cy: 0, w: 0, h: 0, u: 0, hold: 0 };
        });

        // Spiral arms: flat ribbons so the comet width can swell in the vertex shader.
        const SEGS = 180;
        armMeshes = Array.from({ length: lay.arms }, (_, a) => {
          const pos = new Float32Array((SEGS + 1) * 2 * 3);
          const normal = new Float32Array((SEGS + 1) * 2 * 2);
          const side = new Float32Array((SEGS + 1) * 2);
          const t = new Float32Array((SEGS + 1) * 2);
          const arm = new Float32Array((SEGS + 1) * 2);
          const color = new Float32Array((SEGS + 1) * 2 * 3);
          const hue = new Color(ARM_HUES[a % ARM_HUES.length]);
          const index: number[] = [];
          for (let i = 0; i <= SEGS; i++) {
            const u = i / SEGS;
            const [x, y] = armPoint(a, u);
            const [x2, y2] = armPoint(a, Math.min(1, u + 0.002));
            const [x0, y0] = armPoint(a, Math.max(0, u - 0.002));
            const dx = x2 - x0;
            const dy = y2 - y0;
            const len = Math.hypot(dx, dy) || 1;
            for (let s = 0; s < 2; s++) {
              const k = i * 2 + s;
              pos.set([x, y, 0], k * 3);
              normal.set([-dy / len, dx / len], k * 2);
              side[k] = s === 0 ? -1 : 1;
              t[k] = u;
              arm[k] = a;
              color.set([hue.r, hue.g, hue.b], k * 3);
            }
            if (i < SEGS) {
              const v = i * 2;
              index.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
            }
          }
          const g = new BufferGeometry();
          g.setAttribute('position', new BufferAttribute(pos, 3));
          g.setAttribute('aN', new BufferAttribute(normal, 2));
          g.setAttribute('aSide', new BufferAttribute(side, 1));
          g.setAttribute('aT', new BufferAttribute(t, 1));
          g.setAttribute('aArm', new BufferAttribute(arm, 1));
          g.setAttribute('aColor', new BufferAttribute(color, 3));
          g.setIndex(index);
          const mesh = new Mesh(g, armMat);
          mesh.frustumCulled = false;
          spiral.add(mesh);
          return mesh;
        });

        // Short survey marks scattered through the field.
        let s = 77;
        const rand = () => {
          s = (s * 16807) % 2147483647;
          return (s - 1) / 2147483646;
        };
        const tickCount = w < 768 ? 60 : 220;
        const ticks = new Float32Array(tickCount * 2 * 3);
        for (let i = 0; i < tickCount; i++) {
          const r = lay.rMax * (0.12 + rand() * 0.9);
          const ang = rand() * TAU;
          const len = 5 + rand() * 7;
          const x = Math.cos(ang) * r;
          const y = Math.sin(ang) * r;
          const px = -Math.sin(ang) * len;
          const py = Math.cos(ang) * len;
          ticks.set([x - px, y - py, 0, x + px, y + py, 0], i * 6);
        }
        const tg = new BufferGeometry();
        tg.setAttribute('position', new BufferAttribute(ticks, 3));
        tickLines = new LineSegments(tg, tickMat);
        tickLines.frustumCulled = false;
        spiral.add(tickLines);
      }

      function armPoint(arm: number, u: number): [number, number] {
        const r = lay.rMax * (lay.birth + (1 - lay.birth) * u);
        const a = (arm / lay.arms) * TAU + lay.turns * TAU * (1 - u);
        return [Math.cos(a) * r, Math.sin(a) * r];
      }

      const resize = () => {
        const r = stage.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        const lastW = w;
        const lastH = h;
        w = r.width;
        h = r.height;
        renderer.setSize(w, h, false);
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
        lay = layoutFor(w, h);
        if (lastW !== w || lastH !== h) buildCardsAndArms();
        if (reduce) renderFrame(0);
      };

      const state = {
        time: 0,
        journey: 0.37,
        spin: 0,
        intro: reduce ? 10 : 0,
        lastScroll: window.scrollY,
        hover: -1,
        hold: 0,
        mx: 1e5,
        my: 1e5,
        smx: 1e5,
        smy: 1e5,
        ripple: -1,
        rippleX: 0,
        rippleY: 0,
      };

      function renderFrame(dt: number) {
        const st = state;
        st.time += dt;
        st.intro += dt;
        const scrollNow = window.scrollY;
        const dy = scrollNow - st.lastScroll;
        st.lastScroll = scrollNow;

        st.hold += ((st.hover >= 0 ? 1 : 0) - st.hold) * (1 - Math.exp(-dt / 0.15));
        const speed = 1 - st.hold * 0.9;
        st.journey += (dt * 0.012 * speed + dy * 0.0002) % 1;
        st.spin += dt * 0.0105 * speed + dy * 0.0001;
        spiral.rotation.z = st.spin;

        if (st.smx > 9e4 && st.mx < 9e4) {
          st.smx = st.mx;
          st.smy = st.my;
        }
        const follow = 1 - Math.exp(-dt / 0.14);
        st.smx += (st.mx - st.smx) * follow;
        st.smy += (st.my - st.smy) * follow;
        (shared.uMouse.value as Vector2).set(st.smx, st.smy);

        if (st.ripple >= 0) {
          st.ripple += dt;
          if (st.ripple > 1.6) st.ripple = -1;
        }
        const waveR = st.ripple >= 0 ? st.ripple * 900 : -1e4;
        const waveAmp = st.ripple >= 0 ? 1 - st.ripple / 1.6 : 0;

        armMat.uniforms.uTime!.value = st.time;
        armMat.uniforms.uIntro!.value = backOut(clamp01(st.intro / 1.7));

        const cosS = Math.cos(st.spin);
        const sinS = Math.sin(st.spin);
        cards.forEach((c, i) => {
          const u = (c.seed + st.journey) % 1;
          c.u = u;
          const [ax, ay] = armPoint(c.arm, u);
          const x = ax * cosS - ay * sinS;
          const y = ax * sinS + ay * cosS;

          const introT = clamp01((st.intro - 0.15 - (1 - u) * 0.75) / 1.05);
          const bloom = st.intro > 8 ? 1 : backOut(introT);

          c.hold += ((st.hover === i ? 1 : 0) - c.hold) * (1 - Math.exp(-dt / 0.12));
          const scale = (0.12 + 0.88 * Math.pow(u, 0.72)) * bloom * (1 + c.hold * 0.07);
          const cardH = lay.cardH * scale;
          const cardW = cardH * (CARD_W / CARD_H);

          const dist = Math.hypot(x, y);
          const wave = waveAmp * Math.exp(-Math.pow(dist - waveR, 2) / (2 * 180 * 180));
          const mouseD = Math.hypot(x - st.smx, y - st.smy);
          const near = Math.exp(-(mouseD * mouseD) / (320 * 320));

          c.cx = x * bloom + (st.smx < 9e4 ? ((st.smx - x) / (mouseD + 1)) * 8 * near : 0);
          c.cy = y * bloom + (st.smx < 9e4 ? ((st.smy - y) / (mouseD + 1)) * 8 * near : 0);
          c.w = cardW;
          c.h = cardH;

          const un = c.mat.uniforms;
          (un.uCenter!.value as Vector2).set(c.cx, c.cy);
          (un.uSize!.value as Vector2).set(cardW, cardH);
          const fadeIn = smooth(0, 0.08, u);
          const fadeOut = 1 - smooth(0.96, 1, u);
          const inner = 0.36 + 0.64 * smooth(0.14, 0.52, u);
          un.uAlpha!.value = fadeIn * fadeOut * Math.max(inner, c.hold) * clamp01(introT * 3 + (st.intro > 8 ? 1 : 0));
          un.uBlur!.value = (1 - smooth(0.04, 0.26, u)) * 0.012 * (1 - c.hold);
          un.uAber!.value = 0.006 + near * 0.022 + wave * 0.06 + (1 - smooth(0.5, 1, u)) * 0.004;
          un.uCurve!.value = cardH * 0.03 + wave * 22;
          un.uRadius!.value = 3 + 8 * scale;
          un.uWarp!.value = 42 * clamp01(near) * (1 - c.hold) * (reduce ? 0 : 1);
          c.mesh.renderOrder = 10 + u;
        });
        renderer.render(scene, camera);
      }

      syncTheme();
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(stage);
      const themeWatch = new MutationObserver(() => {
        syncTheme();
        if (reduce) renderFrame(0);
      });
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      let raf = 0;
      let visible = true;
      let last = performance.now();
      const loop = (now: number) => {
        raf = 0;
        if (!visible || document.hidden) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        renderFrame(dt);
        raf = requestAnimationFrame(loop);
      };
      const wake = () => {
        if (reduce || raf || !visible || document.hidden) return;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      };
      const io = new IntersectionObserver(([e]) => {
        visible = !!e?.isIntersecting;
        wake();
      });
      io.observe(stage);
      document.addEventListener('visibilitychange', wake);

      const toScene = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        return [e.clientX - r.left - w / 2, -(e.clientY - r.top - h / 2)] as const;
      };
      const hitTest = (x: number, y: number) => {
        let best = -1;
        let bestU = -1;
        cards.forEach((c, i) => {
          if (c.u > bestU && c.u > 0.14 && Math.abs(x - c.cx) < c.w / 2 && Math.abs(y - c.cy) < c.h / 2) {
            best = i;
            bestU = c.u;
          }
        });
        return best;
      };
      const isUi = (t: EventTarget | null) => !!(t as Element | null)?.closest?.('a,button,[data-hero-text]');
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const [x, y] = toScene(e);
        state.mx = x;
        state.my = y;
        state.hover = isUi(e.target) ? -1 : hitTest(x, y);
        host.style.cursor = state.hover >= 0 ? 'pointer' : '';
      };
      const onLeave = () => {
        state.mx = 1e5;
        state.my = 1e5;
        state.smx = 1e5;
        state.smy = 1e5;
        state.hover = -1;
        host.style.cursor = '';
      };
      const onClick = (e: MouseEvent) => {
        if (isUi(e.target)) return;
        const [x, y] = toScene(e as PointerEvent);
        const hit = hitTest(x, y);
        if (hit >= 0) {
          navRef.current(art[cards[hit]!.artIndex]!.to);
          return;
        }
        state.ripple = 0;
      };
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      host.addEventListener('click', onClick);

      if (reduce) renderFrame(0);
      else wake();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        themeWatch.disconnect();
        document.removeEventListener('visibilitychange', wake);
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerleave', onLeave);
        host.removeEventListener('click', onClick);
        host.style.cursor = '';
        cards.forEach((c) => c.mat.dispose());
        armMeshes.forEach((m) => m.geometry.dispose());
        tickLines?.geometry.dispose();
        armMat.dispose();
        tickMat.dispose();
        geo.dispose();
        textures.forEach((t) => t.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [eventsFrom]);

  return <div ref={stageRef} className="galaxy" aria-hidden="true" />;
}
