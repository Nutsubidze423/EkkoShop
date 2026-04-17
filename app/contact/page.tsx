'use client'

import { motion } from 'framer-motion'

const DEVS = [
  {
    name: 'Temo Meshveliani',
    role: 'Main Developer',
    description: 'Backend architecture, API design, database modeling, and project lead.',
    linkedin: 'https://www.linkedin.com/in/temo-meshveliani-543641345/',
    github: 'https://github.com/meshvelianitemo',
  },
  {
    name: 'Demetre Nutsubidze',
    role: 'Frontend Contributor',
    description: 'UI design system, component architecture, and frontend integration.',
    linkedin: 'https://www.linkedin.com/in/demetre-nutsubidze/',
    github: 'https://github.com/Nutsubidze423',
  },
]

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-14"
      >
        <p
          className="font-sans font-black uppercase mb-4"
          style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#BC2C2C' }}
        >
          EkkoShop
        </p>
        <h1
          className="font-display font-black uppercase"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.05em',
            color: '#2C2C2C',
          }}
        >
          The<br />
          <span style={{ color: '#BC2C2C' }}>Team</span>
        </h1>
        <div className="mt-5 h-1.5 w-16" style={{ backgroundColor: '#BC2C2C' }} />
        <p className="font-sans mt-6" style={{ color: '#666', lineHeight: 1.7, fontSize: '0.9375rem', maxWidth: '480px' }}>
          Built by two developers as a portfolio and learning project. Reach out on LinkedIn or explore the code on GitHub.
        </p>
      </motion.div>

      {/* Developer cards */}
      <div className="space-y-6">
        {DEVS.map((dev, i) => (
          <motion.div
            key={dev.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
            className="border-2 p-8"
            style={{ borderColor: '#2C2C2C' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <div className="flex-1">
                <p
                  className="font-sans font-black uppercase mb-1"
                  style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#BC2C2C' }}
                >
                  {dev.role}
                </p>
                <h2
                  className="font-display font-black uppercase mb-3"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', lineHeight: 0.9, letterSpacing: '-0.03em', color: '#2C2C2C' }}
                >
                  {dev.name}
                </h2>
                <p className="font-sans" style={{ color: '#666', lineHeight: 1.7, fontSize: '0.875rem' }}>
                  {dev.description}
                </p>
              </div>

              <div className="flex sm:flex-col gap-3 shrink-0">
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans font-black uppercase transition-all duration-150"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: 'white',
                    backgroundColor: '#2C2C2C',
                    padding: '9px 16px',
                    border: '2px solid #2C2C2C',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#BC2C2C'
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#BC2C2C'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#2C2C2C'
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#2C2C2C'
                  }}
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans font-black uppercase transition-all duration-150"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: '#2C2C2C',
                    backgroundColor: 'transparent',
                    padding: '9px 16px',
                    border: '2px solid #2C2C2C',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#2C2C2C'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = '#2C2C2C'
                  }}
                >
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
