import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import './PageLayout.css'

interface PageLayoutProps {
  title?: string
  children: React.ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <Header />
      <main className="page-layout__main">
        {title && <h1 className="page-layout__title">{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  )
}
