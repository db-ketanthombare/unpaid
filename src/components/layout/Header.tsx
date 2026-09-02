import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import './Header.css'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [currentLang, setCurrentLang] = useState('EN')
  const languages = ['NL', 'EN', 'FR']

  const navLinks = [
    { label: 'For whom?', path: '/for-whom' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Knowledge center', path: '/knowledge' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <header className="header">
      <div className="container header__content">
        <div className="header__logo">
          <Link to="/">
            <img src="/assets/logo.svg" alt="Unpaid" className="header__logo-image" />
          </Link>
        </div>
        
        <nav className="header__nav">
          <ul className="header__nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="header__nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="header__actions">
            <button className="header__claims-btn">Your claims</button>
            <button className="header__login-btn">Log in</button>
            <button className="header__signup-btn">Sign up</button>
            
            <div className="header__lang-selector">
              {languages.map((lang) => (
                <button
                  key={lang}
                  className={`header__lang-btn ${currentLang === lang ? 'header__lang-btn--active' : ''}`}
                  onClick={() => setCurrentLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
            
            <button 
              className="header__theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
