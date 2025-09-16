"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav__inner">
        {/* Brand */}
        <Link
          href={"/" as Route}
          className="brand"
          aria-label="Ga naar de homepagina van Bizora"
          style={{ fontSize: "1.2rem" }}
        >
          <span className="brand__logo">B</span>
          <span className="brand__name">BIZORA</span>
        </Link>

        {/* Desktop links */}
        <nav className="nav__links">
          {/* Section anchors op home via object-href (pathname + hash) */}
          <Link href={{ pathname: "/" as Route, hash: "features" }}>Product</Link>
          <Link href={{ pathname: "/" as Route, hash: "solutions" }}>Oplossingen</Link>

          {/* Echte routes */}
          <Link href={"/pricing" as Route}>Prijzen</Link>
          <Link href={"/knowledge-base" as Route}>Kennisbank</Link>
          <Link href={"/about" as Route}>Over ons</Link>
          <Link href={"/contact" as Route}>Contact</Link>
          <Link href={"/faq" as Route}>FAQ</Link>
        </nav>

        {/* CTA rechts */}
        <div className="nav__cta">
          <Link className="btn btn--ghost" href={"/login" as Route}>
            Inloggen
          </Link>
          <Link className="btn btn--primary" href={"/register" as Route}>
            Start gratis
          </Link>
        </div>

        {/* (optioneel) Mobile hamburger */}
        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="btn btn--ghost"
          style={{ display: "none" }}
        >
          ☰
        </button>
      </div>

      {/* (optioneel) Mobile menu - verborgen standaard; maak zichtbaar met CSS als je wilt */}
      {open && (
        <div className="container" style={{ display: "none" }}>
          <div
            className="card"
            style={{ padding: 12, marginTop: 8, display: "grid", gap: 8 }}
          >
            <Link href={{ pathname: "/" as Route, hash: "features" }} onClick={() => setOpen(false)}>
              Product
            </Link>
            <Link href={{ pathname: "/" as Route, hash: "solutions" }} onClick={() => setOpen(false)}>
              Oplossingen
            </Link>
            <Link href={"/pricing" as Route} onClick={() => setOpen(false)}>
              Prijzen
            </Link>
            <Link href={"/knowledge-base" as Route} onClick={() => setOpen(false)}>
              Kennisbank
            </Link>
            <Link href={"/about" as Route} onClick={() => setOpen(false)}>
              Over ons
            </Link>
            <Link href={"/contact" as Route} onClick={() => setOpen(false)}>
              Contact
            </Link>
            <Link href={"/faq" as Route} onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <Link href={"/login" as Route} onClick={() => setOpen(false)}>
              Inloggen
            </Link>
            <Link href={"/register" as Route} onClick={() => setOpen(false)}>
              Start gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
