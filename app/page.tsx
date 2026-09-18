"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Link2,
  MessageCircle,
  Ruler,
  ScanLine,
  Shirt,
  Sparkles,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = "idle" | "submitting" | "success" | "error";

function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message || "Could not join right now.");
      setState("success");
      setMessage(data.message || "You're on the list.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not join right now.");
    }
  }

  if (state === "success") {
    return (
      <div className={`success-state ${compact ? "compact" : ""}`} role="status">
        <span className="success-icon"><Check size={18} strokeWidth={3} /></span>
        <span>{message}</span>
      </div>
    );
  }

  const fieldPrefix = compact ? "footer" : "hero";
  return (
    <form className={`waitlist-form ${compact ? "compact" : ""}`} onSubmit={submit}>
      <label className="sr-only" htmlFor={`${fieldPrefix}-email`}>Email address</label>
      <Input
        id={`${fieldPrefix}-email`}
        type="email"
        autoComplete="email"
        placeholder="you@school.edu"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={state === "submitting"}
        aria-describedby={message ? `${fieldPrefix}-form-message` : undefined}
      />
      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Joining…" : "Join the waitlist"}
        {state !== "submitting" && <ArrowRight size={17} />}
      </Button>
      {message && (
        <p id={`${fieldPrefix}-form-message`} className="form-message" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}

const fitSignals = [
  ["Size", "M"],
  ["Cut", "Relaxed"],
  ["Stretch", "Low"],
  ["Drape", "Structured"],
];

export default function Home() {
  return (
    <main>
      <header className="site-nav">
        <a className="wordmark" href="#top" aria-label="Outfitted home">
          OUTFITTED<span className="wordmark-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#experience">The experience</a>
          <a href="#fit-check">Fit check</a>
        </nav>
        <Button asChild className="nav-cta"><a href="#waitlist">Get early access</a></Button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Your virtual fitting room, everywhere</div>
          <h1>See the outfit on <em>you</em> before the box arrives.</h1>
          <p className="hero-lede">
            Try on pieces from select stores with your private avatar, build a complete fit,
            and send it to friends who can wear it too. We’re starting with supported
            retailers and working toward a fitting room that travels wherever you shop.
          </p>
          <WaitlistForm />
          <p className="form-note">Early access for college shoppers. No spam, just launch updates.</p>
        </div>

        <div className="hero-visual" aria-label="Before and after virtual outfit preview">
          <div className="image-wrap">
            <Image
              src="/outfitted-hero.png"
              alt="The same person in a simple outfit and a styled cobalt jacket look"
              fill
              priority
              sizes="(max-width: 900px) 92vw, 48vw"
            />
          </div>
          <div className="visual-label before-label">STARTING PHOTO</div>
          <div className="visual-label after-label"><Sparkles size={13} /> OUTFITTED</div>
          <div className="item-stack" aria-hidden="true">
            <span>3 pieces</span>
            <strong>One complete fit</strong>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Why Outfitted matters">
        <div><strong>20–40%</strong><span>estimated online apparel return rate</span></div>
        <div><strong>One avatar</strong><span>for try-ons at supported stores</span></div>
        <div><strong>One tap</strong><span>for friends to try your fit</span></div>
      </section>

      <section className="experience" id="experience">
        <div className="section-heading">
          <p className="kicker">FROM SCREENSHOT TO OUTFIT</p>
          <h2>Trying it on is only the beginning.</h2>
          <p>Outfitted turns isolated product photos into something personal, social, and easier to trust.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card feature-primary">
            <div className="feature-number">01</div>
            <div className="avatar-copy">
              <div className="feature-icon"><ScanLine /></div>
              <h3>A detailed 3D version of you.</h3>
              <p>
                Create a reusable digital body model with the shape and proportions needed
                for more meaningful fit checks and realistic clothing simulation—not just a
                look-alike profile picture.
              </p>
              <div className="avatar-inputs" aria-label="Ways to build your avatar">
                <span><ScanLine size={15} /> A few photos</span>
                <span><Video size={15} /> Optional guided video</span>
                <span><Ruler size={15} /> Basic measurements</span>
              </div>
            </div>
            <div className="avatar-render">
              <Image
                src="/avatar-scan.png"
                alt="A detailed 3D body avatar with measurement landmarks and a simulated jacket"
                fill
                sizes="(max-width: 980px) 86vw, 38vw"
              />
              <div className="avatar-render-label">
                <span>BODY GEOMETRY</span>
                <strong>Ready for cloth simulation</strong>
              </div>
            </div>
          </article>

          <article className="feature-card feature-share">
            <div className="feature-number">02</div>
            <div className="feature-icon"><MessageCircle /></div>
            <h3>Send the fit, not a screenshot.</h3>
            <p>
              Every shared look keeps the exact pieces and shopping links. Your friend can
              tap <strong>Try this on</strong> and see the whole outfit on their own avatar.
            </p>
            <div className="share-preview" aria-hidden="true">
              <div className="mini-avatar">A</div>
              <div><span>Maya shared a fit</span><strong>Blue hour</strong></div>
              <button>Try this on <ChevronRight size={14} /></button>
            </div>
          </article>
        </div>
      </section>

      <section className="fit-section" id="fit-check">
        <div className="fit-copy">
          <div className="eyebrow dark"><Ruler size={15} /> Quick Fit Check</div>
          <h2>A fast answer before a full try-on.</h2>
          <p>
            Sometimes you don’t need a new image—you need to know whether the medium will
            sit the way you expect. We compare your measurements and fit preferences with
            the item’s size, cut, dimensions, and material behavior.
          </p>
          <ul>
            <li><Check size={17} /> Faster than generating a full look</li>
            <li><Check size={17} /> Specific to you and the exact item</li>
            <li><Check size={17} /> Designed to improve as vendor data gets richer</li>
          </ul>
        </div>

        <div className="fit-panel">
          <div className="fit-panel-top">
            <div className="product-thumb"><Shirt size={32} /></div>
            <div><span>Oversized poplin shirt</span><strong>Size M</strong></div>
            <div className="match-score">87<span>% match</span></div>
          </div>
          <div className="recommendation">
            <span className="pulse-dot" />
            <div><strong>Likely relaxed through the chest</strong><p>Sleeves may run 1–2 cm long based on your preference.</p></div>
          </div>
          <div className="signal-grid">
            {fitSignals.map(([label, value]) => (
              <div key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </div>
          <div className="confidence-bar"><span /></div>
          <small>Fit guidance is an estimate, not a guarantee.</small>
        </div>
      </section>

      <section className="clothing-data">
        <div className="data-copy">
          <div className="eyebrow"><Link2 size={15} /> A richer language for clothing</div>
          <h2>Because “medium, blue” doesn’t tell you how it wears.</h2>
        </div>
        <div className="data-cloud" aria-label="Clothing properties Outfitted can represent">
          {["linen blend", "midweight", "low stretch", "structured", "breathable", "soft texture", "relaxed cut", "fluid drape"].map((item, index) => (
            <span key={item} className={`data-pill pill-${index % 4}`}>{item}</span>
          ))}
        </div>
        <p className="data-note">
          We’re building a consistent clothing profile across products and vendors—so fit
          advice can account for how a garment behaves, not just the number on its tag.
        </p>
      </section>

      <section className="steps">
        <div className="section-heading small">
          <p className="kicker">HOW IT WORKS</p>
          <h2>Your next fit in three moves.</h2>
        </div>
        <div className="step-grid">
          <article><span>1</span><h3>Build your avatar</h3><p>Add a few photos, an optional guided video, and basic measurements once.</p></article>
          <article><span>2</span><h3>Add a supported item</h3><p>Paste a product link or upload a clean screenshot from a supported store.</p></article>
          <article><span>3</span><h3>Try, check, share</h3><p>See the look, check the likely fit, and ask your people.</p></article>
        </div>
      </section>

      <section className="final-cta" id="waitlist">
        <p className="kicker">COMING FIRST TO CAMPUS</p>
        <h2>Your group chat is about to get a fitting room.</h2>
        <p>Join the first group helping us make online shopping feel less like a gamble.</p>
        <WaitlistForm compact />
      </section>

      <footer>
        <a className="wordmark" href="#top">OUTFITTED<span className="wordmark-dot">.</span></a>
        <p>Try the fit. Ask your people. Buy with confidence.</p>
        <span>© 2026 Outfitted</span>
      </footer>
    </main>
  );
}
