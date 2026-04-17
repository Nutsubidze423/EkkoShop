'use client'

import Link from 'next/link'

const NAV_LINKS = {
  Shop: [
    { label: 'Gaming PCs & Laptops', href: '/?categoryId=4' },
    { label: 'PC Hardware', href: '/?categoryId=2' },
    { label: 'Consoles & Accessories', href: '/?categoryId=1' },
    { label: 'Peripherals', href: '/?categoryId=3' },
    { label: 'Services', href: '/?categoryId=5' },
  ],
  Account: [
    { label: 'Sign In', href: '/auth/login' },
    { label: 'Register', href: '/auth/register' },
    { label: 'My Account', href: '/account' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
  ],
  Info: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Shipping', href: '/' },
    { label: 'Returns', href: '/' },
    { label: 'Privacy', href: '/' },
  ],
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#2C2C2C' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — brand */}
          <div>
            <Link href="/">
              <span
                className="font-display font-black text-white uppercase block"
                style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.85, letterSpacing: '-0.05em' }}
              >
                EKKO<span style={{ color: '#BC2C2C' }}>SHOP</span>
              </span>
            </Link>
            <p
              className="font-sans text-sm mt-6 max-w-xs"
              style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}
            >
              Premium tech, curated for performance. Laptops, components, and peripherals — selected for quality.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {['TW', 'IG', 'FB', 'YT'].map((social) => (
                <a
                  key={social}
                  href="/"
                  className="inline-flex items-center justify-center w-9 h-9 font-display font-black text-[10px] transition-all duration-200"
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#BC2C2C'
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#BC2C2C'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Right — link grid */}
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(NAV_LINKS).map(([category, links]) => (
              <div key={category}>
                <p
                  className="font-sans font-black uppercase mb-4"
                  style={{ fontSize: '10px', color: '#FCD758', letterSpacing: '0.1em' }}
                >
                  {category}
                </p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-sans text-xs transition-colors duration-200 uppercase"
                        style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'white')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)')}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between"
        >
          <p
            className="font-sans uppercase"
            style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}
          >
            © {new Date().getFullYear()} EkkoShop. All rights reserved.
          </p>
          <p
            className="font-sans uppercase"
            style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}
          >
            Premium Tech Store
          </p>
        </div>
      </div>
    </footer>
  )
}
