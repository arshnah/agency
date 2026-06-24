import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    let rx = 0, ry = 0, mx = 0, my = 0

    const move = (e) => {
      mx = e.clientX; my = e.clientY
      if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }
    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    loop()
    document.body.style.cursor = 'none'

    return () => { window.removeEventListener('mousemove', move); document.body.style.cursor = '' }
  }, [])

  return (
    <div className="hidden md:block" style={{ mixBlendMode: 'difference' }}>
      <div ref={dotRef} className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-acid pointer-events-none" />
      <div ref={ringRef} className="fixed top-0 left-0 z-[9999] w-9 h-9 rounded-full border border-acid/50 pointer-events-none transition-[width,height] duration-300" />
    </div>
  )
}
