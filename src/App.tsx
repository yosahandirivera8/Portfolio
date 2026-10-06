"use client"

import { useState, useEffect, useRef, type PointerEvent as ReactPointerEvent, } from "react"
import "./index.css"
import * as THREE from "three";
import badbunn from "/Users/yosahandirivera/Downloads/Northern Lights Gradient/Un Verano Sin Ti Sticker by Bad Bunny.gif"


function SmoothFollower() {
  const mousePosition = useRef({ x: 0, y: 0 })
  const dotPosition = useRef({ x: 0, y: 0 })
  const borderDotPosition = useRef({ x: 0, y: 0 })
  const dotElement = useRef<HTMLDivElement>(null)
  const borderElement = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)

  const DOT_SMOOTHNESS = 0.8
  const BORDER_DOT_SMOOTHNESS = 0.45

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return

    let animationId = 0
    let hasPositioned = false

    const animate = () => {
      const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

      dotPosition.current.x = lerp(dotPosition.current.x, mousePosition.current.x, DOT_SMOOTHNESS)
      dotPosition.current.y = lerp(dotPosition.current.y, mousePosition.current.y, DOT_SMOOTHNESS)
      borderDotPosition.current.x = lerp(borderDotPosition.current.x, mousePosition.current.x, BORDER_DOT_SMOOTHNESS)
      borderDotPosition.current.y = lerp(borderDotPosition.current.y, mousePosition.current.y, BORDER_DOT_SMOOTHNESS)

      if (dotElement.current) {
        dotElement.current.style.left = `${dotPosition.current.x}px`
        dotElement.current.style.top = `${dotPosition.current.y}px`
      }
      if (borderElement.current) {
        borderElement.current.style.left = `${borderDotPosition.current.x}px`
        borderElement.current.style.top = `${borderDotPosition.current.y}px`
      }

      const isStillMoving =
        Math.abs(mousePosition.current.x - borderDotPosition.current.x) > 0.1 ||
        Math.abs(mousePosition.current.y - borderDotPosition.current.y) > 0.1
      animationId = isStillMoving ? requestAnimationFrame(animate) : 0
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }

      if (!hasPositioned) {
        setHasMoved(true)
        dotPosition.current = { ...mousePosition.current }
        borderDotPosition.current = { ...mousePosition.current }
        hasPositioned = true
      }

      if (!animationId) animationId = requestAnimationFrame(animate)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove)

    const interactiveElements = document.querySelectorAll("a, button, img, input, textarea, select")
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", handleMouseEnter)
      element.addEventListener("mouseleave", handleMouseLeave)
    })

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)

      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", handleMouseEnter)
        element.removeEventListener("mouseleave", handleMouseLeave)
      })

      cancelAnimationFrame(animationId)
    }
  }, [])

  if (typeof window === "undefined") return null

  return (
    <div className="smooth-cursor" aria-hidden="true" style={{ opacity: hasMoved ? 1 : 0 }}>
      <div
        className="smooth-cursor__dot"
        ref={dotElement}
      />

      <div
        className="smooth-cursor__ring"
        style={{
          width: isHovering ? "44px" : "28px",
          height: isHovering ? "44px" : "28px",
        }}
        ref={borderElement}
      />
    </div>
  )
}


const projects = [
  {
    number: "01",
    title: "MetroCard App Prototype",
    href: "https://www.figma.com/proto/cjkMsXNwa9IuGuiU4kM3jc/Untitled?node-id=4-14&t=t4tce0F4rXNc1xaw-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=4%3A15&show-proto-sidebar=1",
    type: "Figma · WireFraming · Prototyping · User Research ·  2026",
    description:
      "Dynamic high-fidelity prototype of a mobile app for managing MetroCard balances and transactions, designed to enhance user experience and streamline public transportation payments.",
  },
  {
    number: "02",
    title: "Lily",
    href: "https://yosahandirivera8.github.io/Lilyflower/",
    type: "TouchDesigner · Mediapipe · 2026",
    description:
      "An interactive Lily flower that blooms and grows in response to a user's hand pinching gesture, utilizing computer vision and real-time graphics to create a captivating digital experience. Click title for demo!! :)",
  },
  {
    number: "03",
    title: "Class Hub",
    href: "https://www.figma.com/make/N0zUBe4OwceKpSABE6NcVx/Syllabus-and-Assignment-Organizer?code-node-id=0-9&p=f&t=GPoRvUYh0Hn1LTTj-0&fullscreen=1",
    type: "FigmaMake · Google Docs · User Empathy · Prototyping · User research · 2026",
    description:
      "An interactive information space for students to have a centralized and organized hub for all their class materials, assignments, and resources, designed to enhance productivity, communication and streamline academic workflows.",
  },
]

const moveWorksAura = (event: ReactPointerEvent<HTMLElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty(
    "--aura-x",
    `${event.clientX - bounds.left}px`,
  )
  event.currentTarget.style.setProperty(
    "--aura-y",
    `${event.clientY - bounds.top}px`,
  )
}

const experience = [
  { period: "2026 — NOW", role: "AI Trainer (Fellowship)", company: "Handshake AI" },
  { period: "JUL — AUG 2025", role: "STEM Instructor (Intern)", company: "Lavner Education @ UCLA" },
  { period: "2022 — 2026", role: "BS Cognitive Science · spec/ Machine Learning (Minor: CS)", company: "UC San Diego" },
]


/** Builds a fake studio environment: colored light blobs and white strips on black. */
function makeEnvironment(renderer: THREE.WebGLRenderer) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 1024, 512);

  const blob = (x: number, y: number, r: number, color: string) => {
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 512);
  };
  blob(140, 220, 280, "#2f62ff");
  blob(520, 130, 250, "#b64bff");
  blob(880, 270, 280, "#ff4fb8");
  blob(380, 420, 220, "#35d0ff");

  g.fillStyle = "#fff";
  g.fillRect(290, 50, 28, 320);
  g.fillRect(700, 40, 18, 340);
  g.fillRect(0, 18, 1024, 10);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose();
  pmrem.dispose();
  return env;
}

function KnotBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL unavailable: the section's CSS gradient still shows
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    scene.environment = makeEnvironment(renderer);

    const geometry = new THREE.TorusKnotGeometry(1, 0.4, 300, 56, 2, 3);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.85,
      roughness: 0.08,
      iridescence: 1,
      iridescenceIOR: 1.7,
      iridescenceThicknessRange: [250, 900],
      clearcoat: 1,
      clearcoatRoughness: 0.02,
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0 };
    let t = 0;
    let raf = 0;

    const render = () => {
      knot.rotation.y = t + pointer.x * 0.8;
      knot.rotation.x = 0.35 + pointer.y * 0.5;
      knot.rotation.z = Math.sin(t * 0.7) * 0.12;
      renderer.render(scene, camera);
    };

    const loop = () => {
      t += 0.004;
      render();
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      knot.scale.setScalar((Math.min(h * 1.05, w * 0.9) / h) * 2.1);
      render();
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    if (!still) {
      window.addEventListener("pointermove", onMove);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      (scene.environment as THREE.Texture | null)?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="knot-bg" ref={hostRef} aria-hidden="true" />;
}

 const PHRASES=[
            "Designing for the future, one pixel at a time.",
            "Building with Machine Learning",
            "Researches and designs digital experiences that are intuitive and user-friendly.",
          ];
          const TYPE_MS = 70;
          const ERASE_MS = 35;
          const HOLD_MS = 1800;

          function Typewriter() {
            const [text, setText] = useState("");
            const [index, setIndex] = useState(0);
            const[mode, setMode] = useState<"typing" | "holding" | "erasing">("typing");

            const reduced =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
            useEffect(() => {
              if (reduced) return;
              const phrase = PHRASES[index];
              let t: ReturnType<typeof setTimeout>;

              if(mode === "typing") {
                if (text.length < phrase.length) {
        t = setTimeout(() => setText(phrase.slice(0, text.length + 1)), TYPE_MS);
      } else {
        t = setTimeout(() => setMode("holding"), 0);
      }
    } else if (mode === "holding") {
      t = setTimeout(() => setMode("erasing"), HOLD_MS);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(phrase.slice(0, text.length - 1)), ERASE_MS);
      } else {
        t = setTimeout(() => {
          setIndex((i) => (i + 1) % PHRASES.length);
          setMode("typing");
        }, 300);
      }
    }
    return () => clearTimeout(t);
  }, [text, mode, index, reduced]);

  return (
    <p className="role" aria-label={PHRASES[index]}>
      <span aria-hidden="true">{reduced ? PHRASES[0] : text}</span>
      {!reduced && <i className="role-cursor" aria-hidden="true" />}
    </p>
  );
}
export default function App() {
  const [activeProject, setActiveProject] = useState(0)

  useEffect(() => {
    const steps = document.querySelectorAll<HTMLElement>(".project-step")
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleStep = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visibleStep) return

        const nextProject = Number((visibleStep.target as HTMLElement).dataset.project)
        setActiveProject((current) => (current === nextProject ? current : nextProject))
      },
      { threshold: [0.35, 0.55, 0.75] },
    )

    steps.forEach((step) => observer.observe(step))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <SmoothFollower />
      <section
        className="aurora-scene"
        aria-label="An abstract northern lights gradient"
      >
        <header className="cute-nav">
          <a className="nav-brand" href="#" aria-label="Yosahandi home">
            <span className="brand-flower" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="brand-text">Yosahandi Rivera</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#">Home</a>
            <a href="#works">Works</a>
            <a href="#contact">Contact</a>
            <a className="nav-hello" href="#works">
              Explore <span aria-hidden="true">↘</span>
            </a>
          </nav>
        </header>
        <svg
          className="aurora-art"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="aurora-glow" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#7355bc" />
              <stop offset=".24" stopColor="#19b7a8" />
              <stop offset=".56" stopColor="#56edb4" />
              <stop offset=".82" stopColor="#4bcad4" />
              <stop offset="1" stopColor="#966ec7" />
            </linearGradient>
            <linearGradient id="aurora-curtain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a7ffe0" stopOpacity=".88" />
              <stop offset=".25" stopColor="#43e8b9" stopOpacity=".65" />
              <stop offset=".65" stopColor="#24b9a8" stopOpacity=".21" />
              <stop offset="1" stopColor="#1c8aab" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-violet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ed9ed0" stopOpacity=".75" />
              <stop offset=".45" stopColor="#a373db" stopOpacity=".38" />
              <stop offset="1" stopColor="#7355bc" stopOpacity="0" />
            </linearGradient>
            <filter
              id="blur-large"
              x="-20%"
              y="-40%"
              width="140%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="48" />
            </filter>
            <filter
              id="blur-medium"
              x="-10%"
              y="-20%"
              width="120%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="18" />
            </filter>
            <filter id="blur-soft" x="-5%" y="-10%" width="110%" height="120%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          <g className="aurora-drift">
            <path
              d="M-180 670 C90 650 270 500 470 485 C700 465 820 410 1010 290 C1190 175 1360 245 1630 -70"
              fill="none"
              stroke="url(#aurora-glow)"
              strokeWidth="300"
              opacity=".65"
              filter="url(#blur-large)"
            />
            <path
              d="M-110 570 C170 590 265 410 470 425 C670 440 855 345 1015 250 C1200 135 1375 175 1580 -70"
              fill="none"
              stroke="url(#aurora-glow)"
              strokeWidth="135"
              opacity=".75"
              filter="url(#blur-medium)"
            />
            <path
              d="M-100 575 C170 595 270 415 470 430 C675 440 850 350 1015 255 C1190 145 1370 180 1560 -55 L1560 430 C1360 365 1210 505 1040 560 C830 625 710 595 510 680 C275 770 110 720 -100 790 Z"
              fill="url(#aurora-curtain)"
              opacity=".73"
              filter="url(#blur-medium)"
            />
            <path
              d="M-90 550 C160 580 300 405 475 425 C670 445 850 345 1020 250 C1205 140 1375 180 1550 -50"
              fill="none"
              stroke="url(#aurora-glow)"
              strokeWidth="38"
              opacity=".75"
              filter="url(#blur-soft)"
            />
            <path
              d="M-90 550 C160 580 300 405 475 425 C670 445 850 345 1020 250 C1205 140 1375 180 1550 -50"
              fill="none"
              stroke="#b5ffe0"
              strokeWidth="5"
              opacity=".3"
              filter="url(#blur-soft)"
            />
          </g>

          <g className="aurora-drift aurora-drift-secondary">
            <path
              d="M-140 70 C140 130 245 300 465 290 C710 280 865 140 1095 185 C1280 220 1430 115 1580 -80 L1580 270 C1370 420 1200 370 1080 450 C825 600 695 455 480 540 C225 640 70 420 -140 400 Z"
              fill="url(#aurora-violet)"
              opacity=".58"
              filter="url(#blur-large)"
            />
            <path
              d="M-120 155 C140 270 285 355 470 325 C710 285 885 180 1090 225 C1270 265 1440 120 1580 -40"
              fill="none"
              stroke="#b98cdb"
              strokeWidth="95"
              opacity=".33"
              filter="url(#blur-large)"
            />
          </g>
        </svg>
        <div className="aurora-haze" aria-hidden="true" />
        <div className="glass-panel">
          <div className="hero-intro">
          <span className="hero-kicker">UX/UI designer · Los Angeles</span>
          <span className="name">Yosahandi Rivera</span>
          <Typewriter />
          </div>



          <div className="hero-details">
            <span className="hero-index" aria-hidden="true">
              01 — 03
            </span>
            <span className="desc">
              I design thoughtful digital experiences at the intersection of
              human behavior, technology, and visual storytelling.
            </span>
            <a className="hero-link" href="#works">
            </a>
          </div>
        </div>
      </section>

      <section className="works" id="works" aria-labelledby="works-title" onPointerMove={moveWorksAura}>
        <div className="works-heading">
          <p>Selected work</p>
          <h2 id="works-title">
            
            Things I’ve
            <br />
            <em>made.</em>
          </h2>
        </div>

        <div className="works-scroll">
          <div className="project-stage">
            <div className="project-visual" data-project={activeProject}>
              <div
                className={`project-art project-art-${activeProject + 1}`}
                aria-hidden="true"
              >
                <div className="project-shape project-shape-primary" />
                <div className="project-shape project-shape-secondary" />
                <span>{projects[activeProject].number}</span>
              </div>
              <div className="project-info" aria-live="polite">
                <div>
                  <p>{projects[activeProject].type}</p>
                  <h3>
                    {projects[activeProject].href && projects[activeProject].href !== "#" ? (
                      <a
                        href={projects[activeProject].href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {projects[activeProject].title} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      projects[activeProject].title
                    )}
                  </h3>
                </div>
                <p>{projects[activeProject].description}</p>
              </div>
            </div>

            <div
              className="project-progress"
              aria-label={`Project ${activeProject + 1} of ${projects.length}`}
            >
              {projects.map((project, index) => (
                <span
                  className={index === activeProject ? "active" : ""}
                  key={project.title}
                />
              ))}
            </div>
          </div>

          <div className="project-steps">
            {projects.map((project, index) => (
              <div
                className="project-step"
                data-project={index}
                key={project.title}
              >
                <span>{project.number}</span>
                <p>Keep scrolling</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="experience" id="experience" aria-labelledby="experience-title" onPointerMove={moveWorksAura}>
        <div className="works-heading">
          
          <p>Experience</p>
          <h2 id="experience-title">
            Where I’ve
            <br />
            <em>grown.</em>
          </h2>
        </div>
        

        <div className="experience-list">
           <img src={badbunn}/>
          {experience.map((item) => (
            <article key={`${item.period}-${item.company}`} className="experience-item">
              <span>{item.period}</span>
              <div>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <KnotBackground/>  
        <h2 id="contact-title">Let’s work together!</h2>
        <p>
          Based in Los Angeles, I’m a passionate designer and developer
          dedicated to creating impactful digital experiences. Feel free to
          reach out to me for any inquiries, collaborations, or just to say
          hello. I’m always open to new opportunities and connections.
        </p>
        <a href="mailto: yosahandirn0917@gmail.com" className="contact-button">
          Email Me!
        </a>
        <a
          href="https://github.com/yosahandirivera8"
          className="github-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="github-link__highlight">GitHub</span>
          <span className="github-link__arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </section>
    </main>
  )
}
