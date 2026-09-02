import React from 'react'
import './Card.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const classes = ['card', className].filter(Boolean).join(' ')
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card__header">{children}</div>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="card__content">{children}</div>
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card__footer">{children}</div>
}
