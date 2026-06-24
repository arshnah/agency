import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// Exact port of the original HTML hero: MeshPhysicalMaterial metallic green,
// procedural normal map, per-line materials, outBack reveal, mouse parallax, 2D fallback.
export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    let raf
    let renderer
    let started = false

    const W = () => cv.offsetWidth || window.innerWidth
    const H = () => cv.offsetHeight || window.innerHeight

    function makeNM(sz) {
      const cv2 = document.createElement('canvas'); cv2.width = cv2.height = sz
      const ctx = cv2.getContext('2d'), id = ctx.createImageData(sz, sz), d = id.data, h = new Float32Array(sz * sz)
      const rnd = (x, y, s) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5; return n - Math.floor(n) }
      const nz = (x, y, c, s) => {
        const gx = x / c, gy = y / c, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0
        const a = rnd(x0, y0, s), b = rnd(x0 + 1, y0, s), cc = rnd(x0, y0 + 1, s), dd = rnd(x0 + 1, y0 + 1, s)
        const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
        return a * (1 - u) * (1 - v) + b * u * (1 - v) + cc * (1 - u) * v + dd * u * v
      }
      for (let y = 0; y < sz; y++) for (let x = 0; x < sz; x++) { let v = 0, a = 0.5, c = 70; for (let o = 0; o < 5; o++) { v += nz(x, y, c, o) * a; a *= 0.5; c *= 0.5 } h[y * sz + x] = v }
      const st = 2.3
      for (let y = 0; y < sz; y++) for (let x = 0; x < sz; x++) {
        const xl = h[y * sz + ((x - 1 + sz) % sz)], xr = h[y * sz + ((x + 1) % sz)], yt = h[((y - 1 + sz) % sz) * sz + x], yb = h[((y + 1) % sz) * sz + x]
        const dx = (xl - xr) * st, dy = (yt - yb) * st, z = 1, L = Math.hypot(dx, dy, z), i = (y * sz + x) * 4
        d[i] = ((dx / L) * 0.5 + 0.5) * 255; d[i + 1] = ((dy / L) * 0.5 + 0.5) * 255; d[i + 2] = ((z / L) * 0.5 + 0.5) * 255; d[i + 3] = 255
      }
      ctx.putImageData(id, 0, 0)
      const t = new THREE.CanvasTexture(cv2); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); return t
    }

    function draw2D() {
      const ctx = cv.getContext('2d'); if (!ctx) return
      const loop = () => {
        const w = cv.width = (cv.offsetWidth || window.innerWidth), h = cv.height = (cv.offsetHeight || window.innerHeight)
        const mob = w < 768
        ctx.clearRect(0, 0, w, h)
        const t = performance.now() / 1000
        const lines = [
          { tx: 'NOT', cy: mob ? h * 0.22 : h * 0.26, sz: mob ? Math.min(w * 0.22, 86) : Math.min(w * 0.13, 108), col: '#F0F5F0' },
          { tx: 'AD SLOP.', cy: mob ? h * 0.43 : h * 0.49, sz: mob ? Math.min(w * 0.18, 70) : Math.min(w * 0.11, 92), col: '#00D67C' },
          { tx: 'NEVER.', cy: mob ? h * 0.61 : h * 0.69, sz: mob ? Math.min(w * 0.20, 78) : Math.min(w * 0.12, 98), col: '#F0F5F0' },
        ]
        lines.forEach(({ tx, cy, sz, col }, i) => {
          const bob = Math.sin(t * 0.8 + i * 1.05) * (sz * 0.018)
          ctx.save()
          ctx.font = '400 ' + sz + 'px "Bebas Neue","Arial Black",Impact,sans-serif'
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.shadowColor = col; ctx.shadowBlur = sz * 0.3
          ctx.fillStyle = col
          ctx.fillText(tx, w / 2, cy + bob)
          ctx.shadowBlur = 0; ctx.restore()
        })
        raf = requestAnimationFrame(loop)
      }
      loop()
    }

    try {
      const test = document.createElement('canvas')
      if (!test.getContext('webgl') && !test.getContext('webgl2')) throw new Error()
    } catch (e) { draw2D(); return }

    renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W(), H())
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x020403, 0.025)
    const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 200)
    camera.position.set(0, 0, 24)

    scene.add(new THREE.AmbientLight(0x0D4A2E, 0.5))
    const k = new THREE.DirectionalLight(0xD0FFE8, 1.2); k.position.set(5, 8, 11); scene.add(k)
    const g1 = new THREE.DirectionalLight(0x00D67C, 1.0); g1.position.set(-8, 3, 6); scene.add(g1)
    const g2 = new THREE.DirectionalLight(0x00FF90, 0.5); g2.position.set(8, -3, 6); scene.add(g2)
    const cl = new THREE.DirectionalLight(0xA0D8FF, 0.3); cl.position.set(0, 7, -6); scene.add(cl)
    const gp1 = new THREE.PointLight(0x00D67C, 2.5, 22); gp1.position.set(0, 0, 10); scene.add(gp1)
    const gp2 = new THREE.PointLight(0x00FF90, 1.2, 18); gp2.position.set(-6, 2, 8); scene.add(gp2)

    const nm = makeNM(256)
    const mats = [
      new THREE.MeshPhysicalMaterial({ color: 0xEEF5EE, metalness: 1.0, roughness: 0.26, clearcoat: 0.7, clearcoatRoughness: 0.2, normalMap: nm, normalScale: new THREE.Vector2(0.4, 0.4), emissive: 0x003318, emissiveIntensity: 0.3 }),
      new THREE.MeshPhysicalMaterial({ color: 0x00D67C, metalness: 1.0, roughness: 0.22, clearcoat: 0.75, clearcoatRoughness: 0.18, normalMap: nm, normalScale: new THREE.Vector2(0.4, 0.4), emissive: 0x004D28, emissiveIntensity: 0.4 }),
      new THREE.MeshPhysicalMaterial({ color: 0xEEF5EE, metalness: 1.0, roughness: 0.26, clearcoat: 0.7, clearcoatRoughness: 0.2, normalMap: nm, normalScale: new THREE.Vector2(0.4, 0.4), emissive: 0x003318, emissiveIntensity: 0.3 }),
    ]

    const LINES = ['NOT', 'AD SLOP.', 'NEVER.']
    const SIZE = 2.1
    let group = null, letters = [], layoutW = 1, layoutH = 1

    function build(font) {
      if (group) scene.remove(group)
      group = new THREE.Group(); letters = []
      const yPos = [2.2, 0, -2.2]
      LINES.forEach((text, i) => {
        let geo
        try {
          geo = new TextGeometry(text, { font, size: SIZE, height: 0.52, curveSegments: 8, bevelEnabled: true, bevelThickness: 0.065, bevelSize: 0.038, bevelSegments: 4 })
        } catch (e) { return }
        geo.computeBoundingBox()
        const bb = geo.boundingBox
        geo.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, 0)
        geo.computeBoundingBox()
        const gw = geo.boundingBox.max.x - geo.boundingBox.min.x
        layoutW = Math.max(layoutW, gw)
        const m = new THREE.Mesh(geo, mats[i])
        m.position.set(0, yPos[i], 0)
        m.userData = { home: new THREE.Vector3(0, yPos[i], 0), phase: Math.random() * Math.PI * 2, bob: 0.25 + Math.random() * 0.2, revealAt: 0.4 + i * 0.55 }
        m.scale.setScalar(0.001)
        group.add(m); letters.push(m)
      })
      layoutH = 4.4 + SIZE * 1.1
      scene.add(group)
      requestAnimationFrame(fit)
      setTimeout(fit, 300)
      setTimeout(fit, 800)
    }

    function fit() {
      if (!group || layoutW <= 1) return
      const d = camera.position.z
      const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d
      const w = h * camera.aspect
      const sc = Math.min(w * 0.84 / layoutW, h * 0.52 / layoutH)
      group.scale.setScalar(sc)
    }

    const clamp = (x) => Math.max(0, Math.min(1, x))
    const outBack = (x) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2) }
    const clock = new THREE.Clock(false)
    let mx = 0, my = 0

    const onPointer = (e) => { mx = (e.clientX / window.innerWidth) * 2 - 1; my = (e.clientY / window.innerHeight) * 2 - 1 }
    const onTouch = (e) => { if (e.touches[0]) { mx = (e.touches[0].clientX / window.innerWidth) * 2 - 1; my = (e.touches[0].clientY / window.innerHeight) * 2 - 1 } }
    document.addEventListener('pointermove', onPointer)
    document.addEventListener('touchmove', onTouch, { passive: true })

    function frame() {
      raf = requestAnimationFrame(frame)
      if (window.scrollY > H() * 1.1) return
      const t = clock.getElapsedTime()
      letters.forEach((m) => {
        const u = m.userData
        const g = clamp((t - u.revealAt) / 0.45)
        const sc = g <= 0 ? 0.001 : outBack(g)
        m.scale.setScalar(sc)
        if (g >= 1) {
          m.position.y = u.home.y + Math.sin(t * 0.75 + u.phase) * u.bob * 0.4
          m.rotation.y = Math.sin(t * 0.4 + u.phase) * 0.06
          m.rotation.z = Math.sin(t * 0.3 + u.phase) * 0.022
        } else {
          m.position.copy(u.home); m.rotation.set(0, 0, 0)
        }
      })
      if (group) { group.rotation.y += (mx * 0.32 - group.rotation.y) * 0.04; group.rotation.x += (-my * 0.18 - group.rotation.x) * 0.04 }
      gp1.intensity = 2.2 + Math.sin(t * 1.1) * 0.5
      renderer.render(scene, camera)
    }

    const FONTS = [
      'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json',
      'https://cdn.jsdelivr.net/npm/three@0.125.0/examples/fonts/helvetiker_bold.typeface.json',
    ]
    const loader = new FontLoader()
    function tryLoad(i) {
      if (i >= FONTS.length) { draw2D(); return }
      loader.load(FONTS[i], (font) => { try { build(font); clock.start(); frame() } catch (e) { tryLoad(i + 1) } }, undefined, () => tryLoad(i + 1))
    }
    tryLoad(0)

    const onResize = () => {
      camera.aspect = W() / H(); camera.updateProjectionMatrix()
      renderer.setSize(W(), H()); fit()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', onPointer)
      document.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', onResize)
      if (renderer) renderer.dispose()
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-[60px] md:w-[100px] opacity-[0.14] z-[1]">
        <svg viewBox="0 0 80 600" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g fill="#0D4A2E" opacity="0.7">
            <rect x="22" y="0" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="46" rx="11" ry="3"/>
            <rect x="22" y="50" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="96" rx="11" ry="3"/>
            <rect x="22" y="100" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="146" rx="11" ry="3"/>
            <rect x="22" y="150" width="7" height="250" rx="3.5"/>
          </g>
        </svg>
      </div>
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-[60px] md:w-[100px] opacity-[0.14] z-[1] scale-x-[-1]">
        <svg viewBox="0 0 80 600" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g fill="#0D4A2E" opacity="0.7">
            <rect x="22" y="20" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="66" rx="11" ry="3"/>
            <rect x="22" y="70" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="116" rx="11" ry="3"/>
            <rect x="22" y="120" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="166" rx="11" ry="3"/>
            <rect x="22" y="170" width="7" height="250" rx="3.5"/>
          </g>
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-bg via-bg/70 to-transparent z-[2]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-10 md:bottom-12 px-6 z-[3]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[9px] md:text-xs tracking-[0.35em] text-acid/70 uppercase mb-3">Creative &amp; Advertising Agency</p>
          <p className="font-body text-sm md:text-lg text-ink/70 mb-7 px-4">Manga campaigns · Cinematic films · Webcomics · UGC</p>
          <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#work" className="font-mono text-[11px] tracking-[0.2em] uppercase bg-acid text-bg px-7 py-3.5 hover:bg-ink transition-colors w-full sm:w-auto text-center">See our work</a>
            <a href="#contact" className="font-mono text-[11px] tracking-[0.2em] uppercase border border-acid/40 text-acid px-7 py-3.5 hover:border-acid hover:bg-acid/10 transition-colors w-full sm:w-auto text-center">Start a project</a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.3em] text-acid/30 uppercase z-[3]">Scroll</div>
    </section>
  )
}
