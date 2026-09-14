'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useState, createContext, useContext } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'

interface Links {
  label: string
  href: string
  icon: React.ReactNode
  active?: boolean
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  )
}

export const SidebarBody = ({
  className,
  children,
  style,
  ...rest
}: Omit<React.ComponentProps<typeof motion.div>, 'children'> & {
  children?: React.ReactNode
}) => {
  return (
    <>
      <DesktopSidebar className={className} style={style} {...rest}>
        {children}
      </DesktopSidebar>
      {/* Mobile deliberately does not inherit `style` — the desktop rail's
          sticky/100vh sizing would stretch the mobile top bar full-screen. */}
      <MobileSidebar className={className}>{children}</MobileSidebar>
    </>
  )
}

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar()
  return (
    <motion.div
      className={cn(
        'hidden md:flex md:flex-col h-full py-4 shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800',
        className
      )}
      initial={false}
      animate={{
        width: animate ? (open ? 300 : 72) : 300,
        paddingLeft: animate ? (open ? 20 : 10) : 20,
        paddingRight: animate ? (open ? 20 : 10) : 20,
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className="flex md:hidden h-14 w-full items-center justify-between px-4 bg-neutral-100 dark:bg-neutral-800"
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <Menu className="text-neutral-800 dark:text-neutral-200" onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'fixed inset-0 z-[100] flex flex-col justify-between h-full w-full p-10 bg-white dark:bg-neutral-900',
              className
            )}
          >
            <button
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
              aria-label="Close menu"
            >
              <X />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links
  className?: string
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'>) => {
  const { open, animate } = useSidebar()
  const collapsed = animate && !open
  return (
    <Link
      href={link.href}
      className={cn(
        'flex items-center gap-2 group/sidebar py-2 rounded-md',
        collapsed ? 'justify-center px-0' : 'px-2',
        link.active && 'bg-[color-mix(in_srgb,var(--gold)_16%,transparent)]',
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        initial={false}
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="m-0! inline-block p-0! text-sm whitespace-pre transition duration-150 group-hover/sidebar:translate-x-1"
      >
        {link.label}
      </motion.span>
    </Link>
  )
}
