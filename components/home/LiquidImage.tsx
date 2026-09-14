'use client'

import { useEffect, useRef } from 'react'
import { useStudioMotion } from './StudioMotion'

// Original Three.js shader. The optimized HTML image underneath remains the
// accessible source and fallback for touch, reduced motion, and unavailable WebGL.
export default function LiquidImage({ src }: { src: string }) {
  const host = useRef<HTMLDivElement>(null)
  const { enabled } = useStudioMotion()

  useEffect(() => {
    const element = host.current
    if (!element || !enabled || !window.matchMedia('(pointer: fine)').matches) return
    let disposed = false
    let cleanup: (() => void) | undefined

    void import('three').then(THREE => {
      if (disposed) return
      const canvas = document.createElement('canvas')
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        const context = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' })
        if (!context) return
        renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false, powerPreference: 'low-power' })
      } catch {
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      canvas.style.cssText = 'width:100%;height:100%;display:block;opacity:0;transition:opacity 700ms'
      element.appendChild(canvas)
      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const geometry = new THREE.PlaneGeometry(2, 2)
      const pointer = new THREE.Vector2(0.5, 0.5)
      const target = new THREE.Vector2(0.5, 0.5)
      let strength = 0
      let visible = false
      let loaded = false
      let frame = 0
      let lastTime = 0
      let elapsed = 0
      const uniforms = {
        uImage: { value: new THREE.Texture() },
        uPointer: { value: pointer },
        uTime: { value: 0 },
        uStrength: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uImageSize: { value: new THREE.Vector2(1536, 1024) },
      }
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: `
          uniform sampler2D uImage;
          uniform vec2 uPointer, uResolution, uImageSize;
          uniform float uTime, uStrength;
          varying vec2 vUv;
          void main() {
            float screenAspect = uResolution.x / uResolution.y;
            float imageAspect = uImageSize.x / uImageSize.y;
            vec2 ratio = vec2(min(screenAspect / imageAspect, 1.0), min(imageAspect / screenAspect, 1.0));
            vec2 uv = (vUv - 0.5) * ratio + 0.5;
            vec2 delta = vUv - uPointer;
            delta.x *= screenAspect;
            float distanceFromPointer = length(delta);
            float falloff = 1.0 - smoothstep(0.0, 0.48, distanceFromPointer);
            float ripple = sin(distanceFromPointer * 24.0 - uTime * 2.4) * falloff * uStrength;
            uv += normalize(delta + vec2(0.0001)) * ripple * 0.012;
            gl_FragColor = texture2D(uImage, clamp(uv, vec2(0.001), vec2(0.999)));
            #include <colorspace_fragment>
          }`,
      })
      scene.add(new THREE.Mesh(geometry, material))

      const render = (time: number) => {
        frame = 0
        if (disposed || !visible || document.hidden || !loaded) return
        const delta = Math.min((time - lastTime) / 1000, 0.04)
        lastTime = time
        elapsed += delta
        pointer.lerp(target, 1 - Math.exp(-delta * 7))
        uniforms.uStrength.value += (strength - uniforms.uStrength.value) * (1 - Math.exp(-delta * 5))
        uniforms.uTime.value = elapsed
        renderer.render(scene, camera)
        frame = requestAnimationFrame(render)
      }
      const start = () => {
        if (!frame && visible && loaded && !document.hidden) frame = requestAnimationFrame(render)
      }
      const texture = new THREE.TextureLoader().load(src, image => {
        if (disposed) { image.dispose(); return }
        image.colorSpace = THREE.SRGBColorSpace
        uniforms.uImage.value.dispose()
        uniforms.uImage.value = image
        uniforms.uImageSize.value.set(image.image.width, image.image.height)
        loaded = true
        start()
        canvas.style.opacity = '1'
      }, undefined, () => { canvas.style.opacity = '0' })

      const resize = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect
        if (!width || !height) return
        renderer.setSize(width, height, false)
        uniforms.uResolution.value.set(width, height)
        start()
      })
      resize.observe(element)
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else { cancelAnimationFrame(frame); frame = 0 }
      })
      observer.observe(element)
      const move = (event: PointerEvent) => {
        const bounds = element.getBoundingClientRect()
        target.set((event.clientX - bounds.left) / bounds.width, 1 - (event.clientY - bounds.top) / bounds.height)
        strength = 1
      }
      const leave = () => { strength = 0 }
      const visibility = () => {
        if (document.hidden) { cancelAnimationFrame(frame); frame = 0 }
        else start()
      }
      const contextLost = (event: Event) => {
        event.preventDefault()
        canvas.style.opacity = '0'
        loaded = false
        cancelAnimationFrame(frame)
        frame = 0
      }
      // Listen on the hero so its text and links don't interrupt the image effect.
      const surface = element.parentElement!
      surface.addEventListener('pointermove', move)
      surface.addEventListener('pointerleave', leave)
      canvas.addEventListener('webglcontextlost', contextLost)
      document.addEventListener('visibilitychange', visibility)
      cleanup = () => {
        cancelAnimationFrame(frame)
        resize.disconnect()
        observer.disconnect()
        surface.removeEventListener('pointermove', move)
        surface.removeEventListener('pointerleave', leave)
        canvas.removeEventListener('webglcontextlost', contextLost)
        document.removeEventListener('visibilitychange', visibility)
        geometry.dispose()
        material.dispose()
        uniforms.uImage.value.dispose()
        if (texture !== uniforms.uImage.value) texture.dispose()
        renderer.dispose()
        canvas.remove()
      }
    }).catch(() => { /* The original photograph remains visible. */ })

    return () => { disposed = true; cleanup?.() }
  }, [enabled, src])

  return <div ref={host} className="liquid-image" aria-hidden="true" />
}
