import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { ChevronDown } from "lucide-react";

/* ============================================================
   Hero Section with Shader Gradient Background
   ============================================================ */

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  // Simplex 2D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.15;

    // Mouse influence
    vec2 mouse = u_mouse * 0.3;

    // Create flowing noise
    vec2 p = uv * 3.0;
    float n1 = fbm(p + vec2(t, t*0.7) + mouse);
    float n2 = fbm(p * 1.3 - vec2(t*0.8, t*0.5) - mouse * 0.5);
    float n3 = fbm(p * 0.7 + vec2(t*0.3, -t*0.4));

    float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Colors
    vec3 coral = vec3(1.0, 0.32, 0.32);     // #FF5252
    vec3 sage = vec3(0.52, 0.55, 0.49);     // #848B7D
    vec3 gold = vec3(0.85, 0.65, 0.13);     // Dark gold
    vec3 deepBlue = vec3(0.05, 0.02, 0.15); // Deep purple-blue
    vec3 black = vec3(0.0, 0.0, 0.0);

    // Mix colors based on noise
    float c1 = smoothstep(-0.5, 0.5, n1);
    float c2 = smoothstep(-0.3, 0.7, n2);
    float c3 = smoothstep(0.0, 1.0, n3);

    vec3 color = mix(black, deepBlue, c3 * 0.4);
    color = mix(color, sage, c2 * 0.25 * (1.0 - uv.y));
    color = mix(color, coral, c1 * 0.3 * (1.0 - uv.y * 0.5));
    color = mix(color, gold * 0.3, c3 * 0.15 * uv.x);

    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.3);
    color *= vignette;

    // Subtle glow spots
    float spot1 = smoothstep(0.4, 0.0, length(uv - vec2(0.2 + n1*0.1, 0.3 + n2*0.1)));
    float spot2 = smoothstep(0.5, 0.0, length(uv - vec2(0.8 + n2*0.1, 0.7 + n3*0.1)));
    color += coral * spot1 * 0.08;
    color += sage * spot2 * 0.06;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Hero() {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Typing animation
  const [line1Text, setLine1Text] = useState("");
  const [line2Text, setLine2Text] = useState("");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const fullLine1 = t(lang, "heroLine1");
  const fullLine2 = t(lang, "heroLine2");

  // Typing effect
  useEffect(() => {
    setVisible(true);
    let i1 = 0;
    const timer1 = setInterval(() => {
      if (i1 <= fullLine1.length) {
        setLine1Text(fullLine1.slice(0, i1));
        i1++;
      } else {
        clearInterval(timer1);
        let i2 = 0;
        const timer2 = setInterval(() => {
          if (i2 <= fullLine2.length) {
            setLine2Text(fullLine2.slice(0, i2));
            i2++;
          } else {
            clearInterval(timer2);
            setTimeout(() => setShowSubtitle(true), 300);
            setTimeout(() => setShowCTA(true), 600);
          }
        }, 50);
      }
    }, 50);
    return () => clearInterval(timer1);
  }, [fullLine1, fullLine2]);

  // WebGL Shader Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    // Compile shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf: number;
    const startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) / 1000;
      gl!.uniform1f(uTime, elapsed);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Shader Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] text-center px-6 max-w-4xl mx-auto py-32">
        <h1
          className="text-5xl md:text-7xl lg:text-[80px] font-bold text-white leading-[1.15] tracking-tight mb-6"
          style={{
            fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
            letterSpacing: "-2px",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <span className="block min-h-[1.2em]">
            {line1Text}
            {!line2Text && <span className="cursor-blink text-[#FF5252]">|</span>}
          </span>
          <span className="block min-h-[1.2em] mt-2">
            {line2Text}
            {line2Text.length === fullLine2.length && line2Text.length > 0 && (
              <span className="cursor-blink text-[#FF5252]">|</span>
            )}
          </span>
        </h1>

        <p
          className={`text-lg text-[#848B7D] mb-10 transition-all duration-700 ${
            showSubtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {t(lang, "heroSubtitle")}
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
            showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <button
            onClick={() => scrollTo("contact")}
            className="px-10 py-4 bg-[#FF5252] text-white rounded-full font-bold text-base hover:bg-[#FF6B6B] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#FF5252]/20"
          >
            {t(lang, "heroCTA")}
          </button>
          <button
            onClick={() => scrollTo("works")}
            className="px-10 py-4 border border-[#848B7D]/60 text-[#F2EFE6] rounded-full font-bold text-base hover:text-white hover:border-white transition-all duration-300"
          >
            {t(lang, "heroSecondary")}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]">
        <ChevronDown className="w-6 h-6 text-white/50 scroll-indicator" />
      </div>
    </section>
  );
}
