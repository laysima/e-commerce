'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useStudioMotion } from './StudioMotion'
import styles from './Atelier.module.css'

export function MagneticLink({ href, children, className = '', label }: { href: string; children: ReactNode; className?: string; label?: string }) {
  const { enabled } = useStudioMotion()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  return (
    <motion.div
      className={styles.magnetic}
      animate={enabled ? position : { x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      onPointerMove={event => {
        if (!enabled || event.pointerType !== 'mouse') return
        const bounds = event.currentTarget.getBoundingClientRect()
        setPosition({ x: (event.clientX - bounds.left - bounds.width / 2) * 0.14, y: (event.clientY - bounds.top - bounds.height / 2) * 0.14 })
      }}
      onPointerLeave={() => setPosition({ x: 0, y: 0 })}
    >
      <Link href={href} className={className} aria-label={label}>{children}</Link>
    </motion.div>
  )
}

function RevealWord({ word, index, count, progress }: { word: string; index: number; count: number; progress: MotionValue<number> }) {
  const { enabled } = useStudioMotion()
  const opacity = useTransform(progress, [index / count, (index + 1) / count], [0.24, 1])
  return <motion.span aria-hidden="true" style={{ opacity: enabled ? opacity : 1 }}>{word}{' '}</motion.span>
}

// Inspired by the word by word treatment in React Bits Scroll Reveal.
export function ScrollManifesto({ text }: { text: string }) {
  const target = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress } = useScroll({ target, offset: ['start 0.85', 'end 0.48'] })
  const words = text.split(' ')
  return <h2 ref={target} className={styles.manifestoHeading} aria-label={text}>
    {words.map((word, index) => <RevealWord key={index} word={word} index={index} count={words.length} progress={scrollYProgress} />)}
  </h2>
}

export type AtelierDepartment = { name: string; slug: string; description: string | null; image: string }

export function DepartmentIndex({ departments }: { departments: AtelierDepartment[] }) {
  const [active, setActive] = useState(0)
  return (
    <section className={styles.departments} aria-labelledby="department-heading">
      <div className={styles.departmentCopy}>
        <p className={styles.eyebrow}>Follow your instinct</p>
        <h2 id="department-heading">Find your<br /><em>feeling.</em></h2>
        <nav aria-label="Shop by department" className={styles.departmentLinks}>
          {departments.map((department, index) => (
            <Link
              key={department.slug}
              href={`/categories/${department.slug}`}
              className={active === index ? styles.activeDepartment : ''}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span>{department.name}</span>
            </Link>
          ))}
        </nav>
        <p className={styles.departmentNote}>Different expressions. Entirely you.</p>
      </div>
      <div className={styles.departmentVisual}>
        {departments.map((department, index) => (
          <div key={department.slug} className={`${styles.departmentImage} ${active === index ? styles.departmentImageActive : ''}`} aria-hidden="true">
            <Image src={department.image} alt="" fill unoptimized={department.image.startsWith('/cressida-editorial-')} sizes="(max-width: 700px) 100vw, 50vw" />
          </div>
        ))}
        <div className={styles.departmentCaption}>
          <span>The Cressida collection</span>
          <span>{departments[active]?.description || 'Find something that feels like you.'}</span>
        </div>
        <span className={styles.verticalNote} aria-hidden="true">A study in self expression</span>
      </div>
    </section>
  )
}

export function CampaignStudy() {
  const target = useRef<HTMLElement>(null)
  const { enabled } = useStudioMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <section ref={target} className={styles.campaignStudy} aria-labelledby="study-title">
      <motion.div className={styles.studyImage} style={{ y: enabled ? y : 0 }}>
        <Image src="/cressida-editorial-copper.webp" alt="Two models in contrasting black and ivory tailoring crossing a copper gallery" fill sizes="100vw" />
      </motion.div>
      <div className={styles.studyTop}><span>The visual journal</span><span>Form in motion</span></div>
      <h2 id="study-title">Life, in<br /><em>good form.</em></h2>
      <div className={styles.studyBottom}>
        <p>For the plans you make.<br />And the ones you don’t.</p>
        <MagneticLink href="/products" className={styles.lightLink}>Find your next favourite</MagneticLink>
      </div>
    </section>
  )
}
