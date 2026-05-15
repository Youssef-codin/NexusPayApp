import { useState, useEffect } from 'react';
import { Link, Navigate, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '#/store/auth-store';
import { useLogin } from '#/hooks/use-auth';

export const Route = createFileRoute('/_public/_index')({
  component: LandingPage,
});

const ACCENT = '#00ff87';
const SANS = "'Space Grotesk', sans-serif";
const MONO = "'JetBrains Mono', monospace";

function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated === true) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ fontFamily: SANS }}>
      <TopBanner />
      <NavBar />
      <Hero />
      <StripeStrip />
      <FeaturesSection />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

// ─── TOP BANNER ───────────────────────────────────────────────────────────────

function TopBanner() {
  const items = [
    { label: 'PORTFOLIO PROJECT · 2026', dot: ACCENT },
    { label: 'POWERED BY STRIPE', dot: '#888' },
    { label: 'TOP-UPS ARE REAL · 3DS LIVE', dot: ACCENT },
    { label: 'CAIRO-CODED, GLOBALLY SHIPPED', dot: '#888' },
    { label: 'NO USERS, JUST VIBES', dot: ACCENT },
    { label: 'OPEN A DEMO ACCOUNT →', dot: '#888' },
  ];
  return (
    <div
      style={{
        background: '#000',
        color: '#888',
        borderBottom: '1px solid #1a1a1a',
        overflow: 'hidden',
        height: 36,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="landing-ticker" style={{ display: 'flex', whiteSpace: 'nowrap', gap: 48 }}>
        {Array.from({ length: 2 }).flatMap((_, dup) =>
          items.map((s, i) => (
            <span
              key={`${dup}-${i}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: MONO,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: s.dot,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              {s.label}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────────────────────

function NavBar() {
  const links = [
    { label: 'PRODUCT', href: '#features' },
    { label: 'FEATURES', href: '#features' },
    { label: 'HOW', href: '#how' },
  ];
  return (
    <nav
      style={{
        background: '#000',
        borderBottom: '2px solid #111',
        padding: '0 56px',
        height: 76,
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginRight: 56,
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            border: `2px solid ${ACCENT}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ACCENT,
            fontWeight: 700,
            fontSize: 19,
            fontFamily: SANS,
          }}
        >
          N
        </div>
        <span
          style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '-0.01em',
            fontFamily: SANS,
          }}
        >
          NEXUSPAY
        </span>
      </Link>

      <div style={{ display: 'flex', gap: 36, flex: 1 }}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="landing-nav-link"
            style={{
              color: '#aaa',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.14em',
              textDecoration: 'none',
              position: 'relative',
              transition: 'color 0.12s',
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link
          to="/login"
          style={{
            color: '#aaa',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.14em',
            textDecoration: 'none',
          }}
        >
          SIGN IN
        </Link>
        <Link
          to="/register"
          className="landing-hard-btn"
          style={{
            background: ACCENT,
            color: '#000',
            border: '3px solid #000',
            padding: '11px 22px',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.12em',
            boxShadow: `4px 4px 0 ${ACCENT}`,
            fontFamily: SANS,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            transition: 'transform 0.12s, box-shadow 0.12s',
          }}
        >
          SIGN UP →
        </Link>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      style={{
        background: '#fcf8ff',
        borderBottom: '3px solid #000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          maxWidth: 1440,
          margin: '0 auto',
          padding: '88px 56px 64px',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          gap: 72,
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#000',
              color: ACCENT,
              padding: '7px 14px',
              fontFamily: MONO,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              marginBottom: 32,
            }}
          >
            <span
              className="landing-blink"
              style={{ width: 7, height: 7, background: ACCENT, display: 'inline-block' }}
            />
            STRIPE × NEXUSPAY · DEMO ACCOUNTS OPEN
          </div>

          <h1
            className="landing-reveal"
            style={{
              fontSize: 'clamp(56px, 7vw, 104px)',
              fontFamily: SANS,
              marginBottom: 28,
              letterSpacing: '-0.055em',
              lineHeight: 0.92,
              fontWeight: 700,
            }}
          >
            MONEY THAT MOVES{' '}
            <span style={{ position: 'relative', display: 'inline-block', isolation: 'isolate' }}>
              <span
                style={{
                  position: 'absolute',
                  inset: '8% -8px 12% -8px',
                  background: ACCENT,
                  zIndex: -1,
                  transform: 'rotate(-1deg)',
                }}
              />
              AT YOUR SPEED.
            </span>
          </h1>

          <p
            className="landing-reveal"
            style={{
              animationDelay: '0.08s',
              fontFamily: SANS,
              fontSize: 20,
              lineHeight: 1.4,
              color: '#222',
              maxWidth: 560,
              marginBottom: 40,
            }}
          >
            One wallet for everyone on NexusPay. Top up with a real card via Stripe, send to any
            other user, schedule recurring payments — and see exactly where every pound went.
          </p>

          <div
            className="landing-reveal"
            style={{ animationDelay: '0.16s', display: 'flex', gap: 14, marginBottom: 48 }}
          >
            <Link
              to="/register"
              className="landing-hard-btn"
              style={{
                background: ACCENT,
                color: '#000',
                border: '4px solid #000',
                padding: '17px 32px',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.12em',
                boxShadow: '6px 6px 0 #000',
                fontFamily: SANS,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                transition: 'transform 0.12s, box-shadow 0.12s',
              }}
            >
              SIGN UP — IT&apos;S FREE →
            </Link>
            <DemoLoginButton
              style={{
                background: '#fff',
                color: '#000',
                border: '4px solid #000',
                padding: '17px 32px',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.12em',
                boxShadow: '6px 6px 0 #000',
                fontFamily: SANS,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                transition: 'transform 0.12s, box-shadow 0.12s',
                cursor: 'pointer',
              }}
            />
          </div>

          <div
            className="landing-reveal"
            style={{
              animationDelay: '0.24s',
              display: 'flex',
              gap: 0,
              borderTop: '2px solid #000',
              borderBottom: '2px solid #000',
            }}
          >
            {[
              { v: '100%', l: 'STRIPE-POWERED' },
              { v: '2.9%', l: 'CARD FEE · PASS-THROUGH' },
              { v: '3DS', l: 'EVERY TOP-UP' },
              { v: '1 DEV', l: 'BUILT FROM SCRATCH' },
            ].map((s, i) => (
              <div
                key={s.l}
                style={{
                  flex: 1,
                  padding: '16px 4px 16px 18px',
                  borderRight: i < 3 ? '2px solid #000' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 28,
                    letterSpacing: '-0.04em',
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    color: '#666',
                    marginTop: 2,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
      <path d="M2 1l9 5-9 5z" />
    </svg>
  );
}

function DemoLoginButton({ style }: { style?: React.CSSProperties }) {
  const login = useLogin();
  const navigate = useNavigate();

  async function handleClick() {
    await login.mutateAsync({ email: 'rich@gmail.com', password: 'password' });
    navigate({ to: '/dashboard' });
  }

  return (
    <button type="button" className="landing-hard-btn" onClick={handleClick} style={style}>
      <PlayIcon /> {login.isPending ? 'LOGGING IN...' : 'TRY THE DEMO'}
    </button>
  );
}

// ─── HERO PREVIEW ─────────────────────────────────────────────────────────────

function HeroPreview() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', perspective: 1200 }}>
      {/* floating receipt */}
      <div
        className="landing-float"
        style={{
          position: 'absolute',
          top: -28,
          right: -28,
          width: 220,
          background: '#fff',
          border: '3px solid #000',
          boxShadow: '6px 6px 0 #000',
          padding: '14px 18px',
          transform: 'rotate(4deg)',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px dashed #000',
            paddingBottom: 8,
            marginBottom: 10,
          }}
        >
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 9, letterSpacing: '0.16em' }}>
            RECEIPT · #4291
          </span>
          <span style={{ fontFamily: MONO, fontSize: 9, color: '#666' }}>MAY 09</span>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
          AHMED HASSAN
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: '#666', marginBottom: 12 }}>
          NEXUSPAY · @ahmed
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#666',
            }}
          >
            SENT
          </span>
          <span
            style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}
          >
            EGP 1,200
          </span>
        </div>
        <div
          style={{
            marginTop: 10,
            padding: '4px 8px',
            background: ACCENT,
            color: '#000',
            fontFamily: MONO,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.16em',
            display: 'inline-block',
          }}
        >
          SETTLED
        </div>
      </div>

      {/* dashboard mock */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: '#0a0a0a',
          border: '4px solid #000',
          boxShadow: '12px 12px 0 #000',
          transform: 'rotate(-2deg)',
        }}
      >
        <div
          style={{
            background: '#000',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: `3px solid ${ACCENT}`,
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
              <div key={c} style={{ width: 11, height: 11, background: c }} />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              fontFamily: MONO,
              fontSize: 10,
              color: '#444',
              textAlign: 'center',
              letterSpacing: '0.12em',
            }}
          >
            nexuspay.app/dashboard
          </div>
          <div style={{ width: 14, height: 14, border: '1px solid #333' }} />
        </div>

        <div style={{ padding: 18, background: '#0a0a0a' }}>
          <div
            style={{
              background: ACCENT,
              color: '#000',
              border: '3px solid #000',
              padding: '16px 20px',
              boxShadow: '4px 4px 0 #000',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.2em',
                marginBottom: 4,
              }}
            >
              TOTAL BALANCE
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14, opacity: 0.7 }}>
                EGP
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 44,
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                }}
              >
                12,840
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 18,
                  opacity: 0.6,
                  letterSpacing: '-0.02em',
                }}
              >
                .50
              </span>
            </div>
          </div>

          <div
            style={{
              height: 56,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 4,
              marginBottom: 14,
              padding: '0 2px',
            }}
          >
            {[35, 52, 28, 64, 48, 76, 60, 88, 70, 92, 58, 80].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: i % 3 === tick % 3 ? ACCENT : '#222',
                  height: `${h}%`,
                  borderTop: `2px solid ${i % 3 === tick % 3 ? '#000' : '#333'}`,
                  transition: 'background 0.3s, border-color 0.3s',
                }}
              />
            ))}
          </div>

          {[
            { n: 'NETFLIX', a: '-EGP 4.99', d: 'MAY 9', incoming: false },
            { n: 'TOP-UP', a: '+EGP 500.00', d: 'MAY 8', incoming: true },
            { n: 'UBER', a: '-EGP 28.50', d: 'MAY 7', incoming: false },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: '#111',
                borderBottom: i < 2 ? '1px solid #1a1a1a' : 'none',
                borderTop: i === 0 ? '1px solid #1a1a1a' : 'none',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  background: r.incoming ? ACCENT : '#000',
                  border: '2px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: r.incoming ? '#000' : ACCENT,
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {r.incoming ? '↓' : '→'}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 12,
                    color: '#fff',
                    letterSpacing: '0.04em',
                  }}
                >
                  {r.n}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: '#555' }}>{r.d}</div>
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 12,
                  color: r.incoming ? ACCENT : '#aaa',
                }}
              >
                {r.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* incoming pill */}
      <div
        className="landing-float"
        style={{
          position: 'absolute',
          bottom: -22,
          left: -28,
          background: '#000',
          border: '3px solid #000',
          boxShadow: `6px 6px 0 ${ACCENT}`,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transform: 'rotate(-3deg)',
          zIndex: 3,
          animationDelay: '0.5s',
        }}
      >
        <span
          className="landing-blink"
          style={{ width: 10, height: 10, background: ACCENT, flexShrink: 0 }}
        />
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#888',
              marginBottom: 2,
            }}
          >
            INCOMING
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, color: '#fff' }}>
            +EGP 2,500 <span style={{ color: ACCENT }}>· SARA K.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STRIPE STRIP ─────────────────────────────────────────────────────────────

function StripeStrip() {
  return (
    <section style={{ background: '#000', borderBottom: '3px solid #000' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '28px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            fontFamily: MONO,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#555',
            borderRight: '1px solid #222',
            paddingRight: 24,
          }}
        >
          PAYMENTS
          <br />
          POWERED BY
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: '#635bff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #635bff',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M13.5 8.4c0-.7.6-1 1.6-1 1.4 0 3.1.4 4.5 1.2V4.4c-1.5-.6-3-.9-4.5-.9C11.4 3.5 9 5.5 9 8.6c0 4.9 6.7 4.1 6.7 6.2 0 .8-.7 1.1-1.8 1.1-1.5 0-3.5-.6-5-1.5v4.3c1.7.7 3.4 1 5 1 3.8 0 6.3-1.9 6.3-5C20.2 9.4 13.5 10.3 13.5 8.4z" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 28,
              color: '#fff',
              letterSpacing: '-0.03em',
            }}
          >
            STRIPE
          </span>
        </div>

        <div style={{ height: 32, width: 1, background: '#222' }} />

        <div
          style={{
            fontFamily: SANS,
            fontSize: 14,
            color: '#888',
            lineHeight: 1.45,
            maxWidth: 480,
          }}
        >
          Real card charges, real 3-D Secure, real webhooks. NexusPay never touches your card
          details
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    tag: '01 / WALLET',
    title: 'TOP UP IN ONE TAP',
    body: 'Add money with Visa, Mastercard or Amex through Stripe Checkout. Transparent 2.9% + EGP 9 — exactly what Stripe charges us, passed through unchanged.',
    bg: '#0a0a0a',
    fg: '#fff',
    dark: true,
    art: 'card' as const,
  },
  {
    tag: '02 / SEND',
    title: 'SEND TO ANY USER',
    body: 'Pay anyone else on NexusPay by username — instantly. No bank details, no waiting. The recipient sees it in their wallet before you finish closing the modal.',
    bg: '#fff',
    fg: '#000',
    dark: false,
    art: 'send' as const,
  },
  {
    tag: '03 / SCHEDULES',
    title: 'AUTOMATE THE BORING BITS',
    body: 'Rent on the 5th. Netflix on the 1st. Salary splits the day they hit. Set it once, edit anytime, never miss a date.',
    bg: '#fff',
    fg: '#000',
    dark: false,
    art: 'calendar' as const,
  },
  {
    tag: '04 / SECURITY',
    title: 'CARDS HANDLED BY STRIPE',
    body: 'Your card never touches our servers. Stripe owns the PCI surface; we just hand you a Checkout session and listen for the webhook. 3DS step-up runs on every top-up.',
    bg: '#0a0a0a',
    fg: '#fff',
    dark: true,
    art: 'shield' as const,
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        background: '#fcf8ff',
        borderBottom: '3px solid #000',
        padding: '88px 56px',
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <SectionHead
          kicker="FEATURES · 04"
          title={
            <>
              EVERYTHING YOUR
              <br />
              MONEY NEEDS
              <span style={{ color: ACCENT, WebkitTextStroke: '2px #000' }}>.</span>
            </>
          }
          subtitle="Built for everyday spending between NexusPay users. No subscriptions, no minimums, no nonsense."
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
            marginTop: 64,
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface SectionHeadProps {
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
}

function SectionHead({ kicker, title, subtitle }: SectionHeadProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 56,
        alignItems: 'end',
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <span style={{ width: 32, height: 3, background: '#000' }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
            }}
          >
            {kicker}
          </span>
        </div>
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 'clamp(48px, 5.5vw, 80px)',
            letterSpacing: '-0.055em',
            lineHeight: 0.92,
          }}
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p
          style={{
            fontFamily: SANS,
            fontSize: 18,
            lineHeight: 1.5,
            color: '#333',
            maxWidth: 480,
            paddingBottom: 8,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

type ArtKind = 'card' | 'send' | 'calendar' | 'shield';

interface FeatureCardProps {
  tag: string;
  title: string;
  body: string;
  bg: string;
  fg: string;
  dark: boolean;
  art: ArtKind;
}

function FeatureCard({ tag, title, body, bg, fg, dark, art }: FeatureCardProps) {
  return (
    <div
      className="landing-feat-card"
      style={{
        background: bg,
        color: fg,
        border: '4px solid #000',
        boxShadow: '8px 8px 0 #000',
        padding: 36,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: dark ? ACCENT : '#666',
          }}
        >
          {tag}
        </span>
        <span style={{ width: 10, height: 10, background: ACCENT, display: 'inline-block' }} />
      </div>

      <h3
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: SANS,
          fontSize: 16,
          lineHeight: 1.5,
          color: dark ? '#aaa' : '#444',
          marginBottom: 32,
          maxWidth: 440,
        }}
      >
        {body}
      </p>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
        <FeatureArt kind={art} dark={dark} />
      </div>
    </div>
  );
}

function FeatureArt({ kind, dark }: { kind: ArtKind; dark: boolean }) {
  const border = '2px solid #000';

  if (kind === 'card') {
    return (
      <div style={{ position: 'relative', height: 160, width: '100%' }}>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 280,
            height: 160,
            background: '#fff',
            border,
            boxShadow: '6px 6px 0 #000',
            transform: 'rotate(-4deg)',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 36, height: 26, background: ACCENT, border }} />
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, color: '#000' }}>
              NEXUSPAY
            </span>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: '0.18em',
              color: '#000',
            }}
          >
            •••• •••• •••• 4242
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  color: '#888',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                }}
              >
                HOLDER
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 11 }}>OMAR FATHY</div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: '#000' }}>
              05 / 28
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 90,
            bottom: 38,
            padding: '5px 10px',
            background: ACCENT,
            color: '#000',
            fontFamily: MONO,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            border,
            transform: 'rotate(2deg)',
            boxShadow: '3px 3px 0 #000',
          }}
        >
          + EGP 500
        </div>
      </div>
    );
  }

  if (kind === 'send') {
    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
        {[
          { l: 'YOU', v: 'EGP 12,840', sub: 'WALLET' },
          { l: 'AHMED HASSAN', v: '@ahmed', sub: 'RECIPIENT' },
        ].map((p, i) => (
          <>
            <div
              key={p.sub}
              style={{
                flex: 1,
                background: '#fff',
                border,
                boxShadow: '4px 4px 0 #000',
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: '#888',
                  marginBottom: 6,
                }}
              >
                {p.sub}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                {p.l}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, color: '#444' }}>
                {p.v}
              </div>
            </div>
            {i === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    background: ACCENT,
                    border,
                    padding: '4px 10px',
                    fontFamily: MONO,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  EGP 1,200
                </div>
                <svg
                  width="44"
                  height="14"
                  viewBox="0 0 44 14"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2.5"
                >
                  <path d="M2 7h36M32 2l6 5-6 5" />
                </svg>
              </div>
            )}
          </>
        ))}
      </div>
    );
  }

  if (kind === 'calendar') {
    const days = Array.from({ length: 14 }).map((_, i) => i + 1);
    const marks: Record<number, string> = { 1: 'NETFLIX', 5: 'RENT', 15: 'OMAR' };
    return (
      <div
        style={{
          width: '100%',
          background: '#fff',
          border,
          boxShadow: '4px 4px 0 #000',
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span
            style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em' }}
          >
            MAY 2026
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: '#666' }}>
            3 SCHEDULED
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {days.map((d) => (
            <div
              key={d}
              style={{
                aspectRatio: '1',
                border: marks[d] ? `2px solid ${ACCENT}` : '1px solid #ddd',
                background: marks[d] ? ACCENT : '#fcfaff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 4,
              }}
            >
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 10, color: '#000' }}>
                {d}
              </span>
              {marks[d] && (
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 6,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: '#000',
                    textAlign: 'right',
                  }}
                >
                  {marks[d]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'shield') {
    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 96,
            height: 110,
            background: ACCENT,
            border,
            position: 'relative',
            flexShrink: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 7 L12 13 L19 7" />
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'STRIPE CHECKOUT',
            '3DS · STEP-UP AUTH',
            'WEBHOOK-VERIFIED',
            'NO CARDS ON OUR SERVERS',
          ].map((c) => (
            <div
              key={c}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: dark ? '#111' : '#fcfaff',
                border: dark ? '1px solid #222' : '1px solid #ddd',
                padding: '5px 10px',
              }}
            >
              <span style={{ width: 6, height: 6, background: ACCENT, display: 'inline-block' }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: dark ? '#aaa' : '#333',
                }}
              >
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'SIGN UP IN 30 SECONDS',
      body: 'Just a username and a password. No NID, no branch visit, no faxed forms. The whole demo runs on the cards Stripe gives you for testing.',
    },
    {
      n: '02',
      title: 'TOP UP WITH STRIPE',
      body: 'Open Checkout, pay with a real (or test) card. 3DS runs end-to-end. Your wallet balance updates the moment Stripe sends the webhook.',
    },
    {
      n: '03',
      title: 'SEND TO ANYONE',
      body: 'Pay anyone else on NexusPay by username — or schedule it for later. Recurring payments and bill splits work the same way.',
    },
  ];

  return (
    <section
      id="how"
      style={{
        background: '#0a0a0a',
        color: '#fff',
        borderBottom: '3px solid #000',
        padding: '88px 56px',
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'end',
            marginBottom: 72,
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <span style={{ width: 32, height: 3, background: ACCENT }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: ACCENT,
                }}
              >
                HOW IT WORKS · 03
              </span>
            </div>
            <h2
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 'clamp(48px, 5.5vw, 80px)',
                letterSpacing: '-0.055em',
                lineHeight: 0.92,
              }}
            >
              FROM SIGNUP TO
              <br />
              SENT IN{' '}
              <span style={{ background: ACCENT, color: '#000', padding: '0 12px' }}>3 STEPS</span>.
            </h2>
          </div>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 18,
              lineHeight: 1.5,
              color: '#888',
              maxWidth: 480,
              paddingBottom: 8,
            }}
          >
            No branches, no faxed forms, no waiting on hold. You can be sending real money before
            your coffee gets cold.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            border: '2px solid #1a1a1a',
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              style={{
                padding: '40px 32px 48px',
                borderRight: i < 2 ? '2px solid #1a1a1a' : 'none',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 96,
                  letterSpacing: '-0.06em',
                  lineHeight: 1,
                  color: ACCENT,
                  opacity: 0.18,
                  marginBottom: -12,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                <span style={{ width: 7, height: 7, background: ACCENT }} />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: ACCENT,
                  }}
                >
                  STEP {s.n}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: '-0.03em',
                  marginBottom: 14,
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.55, color: '#888' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section
      id="cta"
      style={{
        background: '#0a0a0a',
        color: '#fff',
        borderBottom: '3px solid #000',
        padding: '104px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.04,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 280,
              letterSpacing: '-0.06em',
              whiteSpace: 'nowrap',
              color: '#fff',
              lineHeight: 0.85,
            }}
          >
            NEXUSPAY · NEXUSPAY ·
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: 1100,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 28,
          }}
        >
          <span className="landing-blink" style={{ width: 8, height: 8, background: ACCENT }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: ACCENT,
            }}
          >
            READY WHEN YOU ARE
          </span>
        </div>
        <h2
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 'clamp(64px, 8vw, 132px)',
            letterSpacing: '-0.055em',
            lineHeight: 0.92,
            marginBottom: 36,
          }}
        >
          MAKE YOUR
          <br />
          MONEY <span style={{ background: ACCENT, color: '#000', padding: '0 18px' }}>FAST</span>.
        </h2>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 19,
            color: '#aaa',
            maxWidth: 600,
            margin: '0 auto 40px',
          }}
        >
          Open a NexusPay account in under a minute. No card needed to start.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/register"
            className="landing-hard-btn"
            style={{
              background: ACCENT,
              color: '#000',
              border: '4px solid #000',
              padding: '20px 36px',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '0.12em',
              boxShadow: `8px 8px 0 ${ACCENT}`,
              fontFamily: SANS,
              textDecoration: 'none',
              transition: 'transform 0.12s, box-shadow 0.12s',
            }}
          >
            SIGN UP →
          </Link>
          <DemoLoginButton
            style={{
              background: 'transparent',
              color: '#fff',
              border: '4px solid #fff',
              padding: '20px 36px',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '0.12em',
              boxShadow: '8px 8px 0 #fff',
              fontFamily: SANS,
              transition: 'transform 0.12s, box-shadow 0.12s',
              cursor: 'pointer',
            }}
          />
        </div>

        <div
          style={{
            marginTop: 48,
            display: 'inline-flex',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['NO CARD REQUIRED', '30-SEC SIGNUP', 'PORTFOLIO PROJECT · OPEN-SOURCE'].map((l) => (
            <div
              key={l}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                color: '#666',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 7l3.5 3.5L12 4" />
              </svg>
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { h: 'PRODUCT', ls: ['Wallet', 'Transfers', 'Schedules', 'Demo'] },
    { h: 'RESOURCES', ls: ['Stripe docs', 'GitHub', 'Changelog'] },
    { h: 'LEGAL', ls: ['Terms (lol)', 'Privacy', 'Cookies'] },
  ];
  return (
    <footer style={{ background: '#000', color: '#888', padding: '64px 56px 32px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr repeat(3, 1fr)',
            gap: 56,
            paddingBottom: 56,
            borderBottom: '1px solid #1a1a1a',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  border: `2px solid ${ACCENT}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: ACCENT,
                  fontWeight: 700,
                  fontSize: 19,
                  fontFamily: SANS,
                }}
              >
                N
              </div>
              <span
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: '-0.01em',
                  fontFamily: SANS,
                }}
              >
                NEXUSPAY
              </span>
            </div>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 14,
                lineHeight: 1.55,
                color: '#666',
                maxWidth: 360,
                marginBottom: 18,
              }}
            >
              A portfolio fintech built in Cairo. Real Stripe top-ups; the rest is a high-fidelity
              sandbox for moving money between NexusPay users.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: MONO,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: ACCENT,
              }}
            >
              <span
                className="landing-blink"
                style={{ width: 7, height: 7, background: ACCENT, display: 'inline-block' }}
              />
              DEMO LIVE
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.h}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: '#fff',
                  marginBottom: 18,
                }}
              >
                {c.h}
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {c.ls.map((l) => (
                  <li key={l}>
                    <span
                      style={{
                        color: '#888',
                        fontFamily: SANS,
                        fontSize: 14,
                        cursor: 'default',
                      }}
                    >
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            paddingTop: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: '#444',
              letterSpacing: '0.1em',
            }}
          >
            © 2026 NEXUSPAY · A PORTFOLIO PROJECT · NOT A REAL BANK
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {['TW', 'IG', 'LI', 'GH'].map((s) => (
              <span
                key={s}
                style={{
                  width: 36,
                  height: 36,
                  border: '2px solid #1a1a1a',
                  color: '#666',
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'default',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
