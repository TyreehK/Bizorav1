"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Prijzen" },
  { href: "/knowledge-base", label: "Kennisbank" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sluit het mobiele menu bij routewijziging of resize > 900px
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const links = useMemo(
    () =>
      NAV_LINKS.map((l) => ({
        ...l,
        active: l.href === "/" ? pathname === "/" : pathname.startsWith(l.href),
      })),
    [pathname]
  );

  return (
    <nav
      aria-label="Hoofd navigatie"
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="brand"
        aria-label="Ga naar de homepagina van Bizora"
        style={{ fontSize: "1.2rem" }}
      >
        Bizora
      </Link>

      {/* Desktop links */}
      <div
        className="hide-on-mobile"
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".25rem",
          justifyContent: "center",
        }}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={l.active ? "nav-active" : ""}
            style={{
              textDecoration: "none",
              padding: "0.55rem 0.8rem",
              borderRadius: 8,
              border: l.active ? "1px solid var(--bz-blue-3)" : "1px solid transparent",
              background: l.active ? "var(--bz-blue-2)" : "transparent",
              color: l.active ? "#134391" : "var(--bz-ink-2)",
              fontWeight: l.active ? 800 : 600,
              transition: "background var(--bz-speed) var(--bz-ease), color var(--bz-speed) var(--bz-ease), border-color var(--bz-speed) var(--bz-ease)",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Desktop CTA's */}
      <div className="hide-on-mobile" style={{ display: "flex", gap: ".5rem", justifyContent: "flex-end" }}>
        <Link className="btn btn-outline" href="/login">Inloggen</Link>
        <Link className="btn btn-primary" href="/register">Start gratis</Link>
      </div>

      {/* Mobile: burger */}
      <button
        aria-label="Open hoofdmenu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="btn"
        style={{
          display: "inline-flex",
          gap: ".55rem",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--bz-border)",
          background: "#fff",
        }}
      >
        <span style={{ fontWeight: 800 }}>Menu</span>
        <Burger open={open} />
      </button>

      {/* Mobile dropdown (full-width onder navbar) */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobiel menu"
        style={{
          gridColumn: "1 / -1",
          overflow: "hidden",
          borderRadius: "12px",
          border: open ? "1px solid var(--bz-border)" : "1px solid transparent",
          background: open ? "#fff" : "transparent",
          boxShadow: open ? "var(--bz-shadow)" : "none",
          transform: open ? "translateY(0)" : "translateY(-8px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition:
            "opacity var(--bz-speed) var(--bz-ease), transform var(--bz-speed) var(--bz-ease), border-color var(--bz-speed) var(--bz-ease), background var(--bz-speed) var(--bz-ease)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: ".25rem",
            padding: ".6rem",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: ".8rem .85rem",
                borderRadius: 10,
                border: "1px solid var(--bz-border)",
                background: l.active ? "var(--bz-blue-2)" : "#fff",
                color: l.active ? "#134391" : "var(--bz-ink)",
                fontWeight: l.active ? 800 : 600,
              }}
            >
              {l.label}
              <span
                className="pill"
                style={{
                  borderColor: l.active ? "var(--bz-blue-3)" : "var(--bz-border)",
                  background: l.active ? "var(--bz-blue-2)" : "#fff",
                  color: l.active ? "#134391" : "var(--bz-ink-3)",
                }}
              >
                {l.active ? "actief" : "ga"}
              </span>
            </Link>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", marginTop: ".25rem" }}>
            <Link className="btn btn-outline" href="/login">Inloggen</Link>
            <Link className="btn btn-primary" href="/register">Start gratis</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ----------------------------- UI bits ------------------------------ */

function Burger({ open }: { open: boolean }) {
  const base: React.CSSProperties = {
    width: 18,
    height: 2,
    background: "var(--bz-ink)",
    borderRadius: 2,
    transition: "transform var(--bz-speed) var(--bz-ease), opacity var(--bz-speed) var(--bz-ease)",
  };
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 4,
        padding: 4,
      }}
    >
      <span
        style={{
          ...base,
          transform: open ? "translateY(6px) rotate(45deg)" : "none",
        }}
      />
      <span
        style={{
          ...base,
          opacity: open ? 0 : 1,
        }}
      />
      <span
        style={{
          ...base,
          transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
        }}
      />
    </span>
  );
}