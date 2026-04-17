'use client'

import { motion } from 'framer-motion'

const TECH_ITEMS = [
  'Backend development (API design, business logic)',
  'Database management and relational modeling',
  'Authentication and authorization',
  'RESTful services',
  'Error handling and validation',
  'Scalable architecture principles',
]

const PURPOSE_ITEMS = [
  'Strengthen practical development skills',
  'Apply theoretical knowledge in a real-world scenario',
  'Demonstrate readiness for professional backend or full-stack roles',
]

export default function AboutPage() {
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
          🧾 About<br />
          <span style={{ color: '#BC2C2C' }}>This Project</span>
        </h1>
        <div className="mt-5 h-1.5 w-16" style={{ backgroundColor: '#BC2C2C' }} />
      </motion.div>

      {/* Body sections */}
      <div className="space-y-12">
        {/* Main description */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="space-y-4 font-sans" style={{ color: '#444', lineHeight: 1.8, fontSize: '0.9375rem' }}>
            <p>
              This platform is a technical eCommerce application developed as both an educational project and a portfolio piece.
              Its purpose is to demonstrate practical skills in building modern, scalable web applications while simulating
              real-world business logic and workflows.
            </p>
            <p>
              The application showcases a full-stack architecture, including backend API development, database design, and frontend
              integration. It implements core eCommerce functionality such as product management, user authentication, cart
              operations, and order handling, reflecting common patterns used in production systems.
            </p>
            <p>
              Beyond basic functionality, the project emphasizes clean code structure, performance considerations, and
              maintainability. It is designed with scalability in mind, following best practices in API design, data handling,
              and system organization.
            </p>
            <p>
              This project serves as a hands-on learning experience and a representation of technical capabilities in software
              development, particularly in backend engineering and database management.
            </p>
          </div>
        </motion.section>

        {/* Technologies */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="border-t-2 pt-10" style={{ borderColor: '#2C2C2C' }}>
            <h2
              className="font-display font-black uppercase mb-6"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 0.9, letterSpacing: '-0.03em', color: '#2C2C2C' }}
            >
              🛠️ Technologies &amp; Concepts
            </h2>
            <ul className="space-y-3">
              {TECH_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div
                    className="w-1.5 h-1.5 shrink-0 mt-2"
                    style={{ backgroundColor: '#BC2C2C' }}
                  />
                  <span className="font-sans" style={{ color: '#444', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Purpose */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="border-t-2 pt-10" style={{ borderColor: '#2C2C2C' }}>
            <h2
              className="font-display font-black uppercase mb-3"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 0.9, letterSpacing: '-0.03em', color: '#2C2C2C' }}
            >
              🎯 Purpose
            </h2>
            <p className="font-sans mb-6" style={{ color: '#444', lineHeight: 1.7, fontSize: '0.9375rem' }}>
              The main goal of this project is not commercial use, but to:
            </p>
            <ul className="space-y-3">
              {PURPOSE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div
                    className="w-1.5 h-1.5 shrink-0 mt-2"
                    style={{ backgroundColor: '#BC2C2C' }}
                  />
                  <span className="font-sans" style={{ color: '#444', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
