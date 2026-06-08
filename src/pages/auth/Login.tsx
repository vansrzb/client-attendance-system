import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── Typing animation ─────────────────────────────────────────────────────────
function useTyping(phrases: string[], speed = 65, del = 35, pause = 24) {
  const [text, setText] = useState("");
  const s = useRef({ pi: 0, ci: 0, del: false, wait: 0 });
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const r = s.current, p = phrases[r.pi];
      if (r.wait > 0) { r.wait--; t = setTimeout(tick, 80); return; }
      if (!r.del) {
        r.ci++;
        setText(p.slice(0, r.ci));
        if (r.ci === p.length) { r.del = true; r.wait = pause; }
        t = setTimeout(tick, speed);
      } else {
        r.ci--;
        setText(p.slice(0, r.ci));
        if (r.ci === 0) { r.del = false; r.pi = (r.pi + 1) % phrases.length; r.wait = 5; }
        t = setTimeout(tick, del);
      }
    };
    t = setTimeout(tick, 800);
    return () => clearTimeout(t);
  }, []);
  return text;
}

// ─── QR Code SVG ─────────────────────────────────────────────────────────────
function QRCodeSVG({ size = 110 }: { size?: number }) {
  const modules: [number, number][] = [
    [42,4],[50,4],[58,4],[42,12],[58,12],
    [4,42],[12,42],[4,50],[4,58],[12,58],
    [62,42],[70,42],[78,42],[86,42],[62,50],[78,50],
    [42,62],[50,62],[62,62],[70,62],[86,62],
    [42,70],[58,70],[78,70],[42,78],[50,78],[62,78],[70,78],[86,78],
    [42,86],[58,86],[78,86],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="28" height="28" rx="4" fill="none" stroke="#15803d" strokeWidth="2.5"/>
      <rect x="10" y="10" width="16" height="16" rx="2" fill="#15803d"/>
      <rect x="68" y="4" width="28" height="28" rx="4" fill="none" stroke="#15803d" strokeWidth="2.5"/>
      <rect x="74" y="10" width="16" height="16" rx="2" fill="#15803d"/>
      <rect x="4" y="68" width="28" height="28" rx="4" fill="none" stroke="#15803d" strokeWidth="2.5"/>
      <rect x="10" y="74" width="16" height="16" rx="2" fill="#15803d"/>
      {modules.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill="#166534"/>
      ))}
      <rect x="41" y="41" width="18" height="18" rx="3" fill="#16a34a"/>
      <rect x="45" y="45" width="10" height="10" rx="2" fill="white"/>
    </svg>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "⬡", label: "Real-time tracking" },
  { icon: "✦", label: "Instant QR scan" },
  { icon: "◈", label: "Analytics & reports" },
  { icon: "⬡", label: "Multi-class support" },
  { icon: "✦", label: "Secure & encrypted" },
  { icon: "◈", label: "Mobile-friendly" },
  { icon: "⬡", label: "Export CSV/PDF" },
  { icon: "✦", label: "Zero paper usage" },
];

function Marquee() {
  // Triple the items so seamless loop never shows a gap
  const items = [...FEATURES, ...FEATURES, ...FEATURES];
  return (
    <div style={{ overflow: "hidden", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)", maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)" }}>
      <div style={{
        display: "flex",
        gap: 36,
        width: "max-content",
        animation: "marqueeScroll 28s linear infinite",
        willChange: "transform",
      }}>
        {items.map((f, i) => (
          <span key={i} style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 7, fontWeight: 500, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
            <span style={{ color: "#4ade80", fontSize: 9, lineHeight: 1 }}>{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ num, label, sub }: { num: string; label: string; sub: string }) {
  return (
    <Card className="flex-1" style={{ border: "1px solid #bbf7d0", background: "white", borderRadius: 12 }}>
      <CardContent style={{ padding: "12px 10px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 21, fontWeight: 700, color: "#15803d", lineHeight: 1 }}>{num}</div>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "#14532d", marginTop: 3 }}>{label}</div>
        <div style={{ fontSize: 9.5, color: "#86efac", marginTop: 2, fontWeight: 500 }}>{sub}</div>
      </CardContent>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const typing = useTyping([
    "Smarter attendance.",
    "Zero paperwork.",
    "Scan. Done. Next.",
    "Know who's present.",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        /* keyframe: moves exactly 1/3 of the tripled list */
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes scanBeam {
          0%, 100% { top: 6px; opacity: 1; }
          50%       { top: calc(100% - 8px); opacity: 0.85; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(0.55); opacity: 0.35; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        *, *::before, *::after { box-sizing: border-box; }

        .lr-root {
          font-family: 'Poppins', sans-serif;
          height: 100vh;
          width: 100vw;
          display: flex;
          overflow: hidden;
          background: #f0fdf4;
        }

        /* ── LEFT ── */
        .lr-left {
          flex: 0 0 44%;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 60px;
          overflow-y: auto;
          position: relative;
          border-right: 1px solid #dcfce7;
        }
        .lr-left::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #16a34a, #4ade80, #16a34a);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .lr-form-wrap {
          width: 100%;
          max-width: 360px;
          animation: fadeSlideUp 0.55s ease both;
        }

        .lr-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 40px;
        }
        .lr-brand-icon {
          width: 40px; height: 40px;
          background: #16a34a;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(22,163,74,0.32);
          flex-shrink: 0;
        }
        .lr-brand-name { font-size: 18px; font-weight: 700; color: #14532d; letter-spacing: -0.03em; }
        .lr-brand-tag  { font-size: 9.5px; font-weight: 500; color: #86efac; letter-spacing: 0.1em; text-transform: uppercase; margin-top: -1px; }

        .lr-eyebrow {
          font-size: 10.5px; font-weight: 600; color: #16a34a;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 9px;
          display: flex; align-items: center; gap: 8px;
        }
        .lr-eyebrow::before { content:''; width:18px; height:2px; background:#16a34a; border-radius:2px; flex-shrink:0; }

        .lr-heading { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 5px; letter-spacing: -0.04em; line-height: 1.1; }
        .lr-sub     { font-size: 13px; color: #6b7280; margin: 0 0 28px; font-weight: 400; line-height: 1.5; }

        .lr-field { margin-bottom: 16px; }
        .lr-label { display: block; font-size: 11.5px; font-weight: 600; color: #374151; margin-bottom: 6px; letter-spacing: 0.01em; }

        .lr-input-wrap { position: relative; }
        .lr-input {
          width: 100%; height: 44px;
          padding: 0 42px 0 14px;
          font-size: 13.5px; font-family: 'Poppins', sans-serif; font-weight: 400;
          background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 11px;
          color: #0f172a; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .lr-input:hover { border-color: #86efac; background: #fff; }
        .lr-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.10); }
        .lr-input::placeholder { color: #cbd5e1; }

        .lr-input-icon {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; pointer-events: none; display: flex;
        }
        .lr-input-btn {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; background: none; border: none; cursor: pointer;
          padding: 0; display: flex; align-items: center; transition: color 0.15s;
        }
        .lr-input-btn:hover { color: #16a34a; }

        .lr-row-forgot { display: flex; justify-content: flex-end; margin: -8px 0 20px; }
        .lr-forgot { font-size: 11.5px; font-weight: 500; color: #16a34a; text-decoration: none; transition: color 0.15s; }
        .lr-forgot:hover { color: #15803d; text-decoration: underline; }

        .lr-error {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 11px 13px;
          background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
          margin-bottom: 14px; font-size: 12px; color: #dc2626; font-weight: 500;
        }

        .lr-register { text-align: center; font-size: 12.5px; color: #94a3b8; margin-top: 18px; }
        .lr-register a { color: #16a34a; text-decoration: none; font-weight: 600; }
        .lr-register a:hover { color: #15803d; }

        /* ── RIGHT ── */
        .lr-right {
          flex: 1;
          background: #f0fdf4;
          display: flex; flex-direction: column;
          padding: 28px 36px;
          position: relative; overflow: hidden;
        }
        .lr-right-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(22,163,74,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22,163,74,0.055) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }
        .lr-right-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          height: 100%;
        }

        .lr-top-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; flex-shrink: 0;
        }
        .lr-status {
          display: inline-flex; align-items: center; gap: 7px;
          background: white; border: 1px solid #bbf7d0; border-radius: 100px;
          padding: 5px 12px 5px 8px;
          font-size: 11px; font-weight: 600; color: #15803d;
          box-shadow: 0 1px 6px rgba(22,163,74,0.09);
        }
        .lr-pulse {
          width: 7px; height: 7px; background: #16a34a; border-radius: 50%;
          animation: pulseDot 1.8s ease-in-out infinite; flex-shrink: 0;
        }

        .lr-hero {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; min-height: 0; padding-bottom: 16px;
        }
        .lr-tagline { font-size: 10px; font-weight: 600; color: #16a34a; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 9px; }
        .lr-typing-head {
          font-size: 30px; font-weight: 800; color: #14532d;
          line-height: 1.1; margin-bottom: 11px;
          letter-spacing: -0.03em; min-height: 38px;
        }
        .lr-cursor {
          display: inline-block; width: 2.5px; height: 26px;
          background: #16a34a; vertical-align: middle; margin-left: 3px;
          border-radius: 2px; animation: blink 0.9s step-end infinite;
        }
        .lr-desc { font-size: 12.5px; color: #4b7a5a; line-height: 1.7; max-width: 320px; font-weight: 400; margin-bottom: 20px; }

        .lr-stats { display: flex; gap: 9px; }

        /* QR section */
        .lr-qr-section { display: flex; align-items: center; gap: 20px; margin-bottom: 18px; flex-shrink: 0; }

        .lr-qr-card-inner {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          animation: floatCard 4s ease-in-out infinite;
        }
        .lr-qr-frame {
          position: relative; background: white; border-radius: 10px;
          border: 1.5px solid #dcfce7; padding: 8px; overflow: hidden;
        }
        .lr-scan-beam {
          position: absolute; left: 8px; right: 8px; height: 2px;
          background: rgba(22,163,74,0.55); border-radius: 2px;
          box-shadow: 0 0 8px rgba(22,163,74,0.35);
          animation: scanBeam 2.4s ease-in-out infinite;
        }
        .lr-qr-info { text-align: center; }
        .lr-qr-title { font-size: 11.5px; font-weight: 700; color: #15803d; margin-bottom: 2px; }
        .lr-qr-hint  { font-size: 10px; color: #86efac; font-weight: 500; }

        .lr-qr-steps { display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .lr-step { display: flex; align-items: flex-start; gap: 11px; }
        .lr-step-num {
          width: 23px; height: 23px; background: #dcfce7; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9.5px; font-weight: 700; color: #15803d; flex-shrink: 0;
        }
        .lr-step-text { font-size: 11.5px; font-weight: 500; color: #3d6b4f; line-height: 1.4; padding-top: 3px; }
        .lr-step-sub  { font-size: 10px; color: #86efac; font-weight: 400; }

        .lr-marquee-section { border-top: 1px solid #bbf7d0; padding-top: 14px; flex-shrink: 0; }
        .lr-marquee-label { font-size: 9.5px; font-weight: 600; color: #86efac; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .lr-root {
            height: 100svh;
            flex-direction: column;
            overflow: hidden;
            background: #fff;
          }
          .lr-left {
            flex: 1;
            width: 100%;
            padding: 0;
            border-right: none;
            overflow-y: auto;
            justify-content: flex-start;
            display: flex;
            flex-direction: column;
          }
          .lr-form-wrap {
            max-width: 100%;
            padding: 32px 22px 0;
            flex: 1;
          }
          .lr-brand { margin-bottom: 24px; }
          .lr-sub   { margin-bottom: 20px; }
          .lr-right { display: none; }
          .lr-mobile-footer { display: block !important; }
        }

        /* ── MOBILE FOOTER (replaces right panel on mobile) ── */
        .lr-mobile-footer {
          display: none;
          flex-shrink: 0;
          margin-top: 8px;
        }
        .lr-mobile-info {
          background: #f0fdf4;
          border-top: 1px solid #bbf7d0;
          padding: 14px 22px 18px;
        }
        .lr-mobile-top {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .lr-mobile-qr-wrap {
          background: white;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 8px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(22,163,74,0.08);
        }
        .lr-mobile-copy h3 {
          font-size: 13px; font-weight: 700; color: #14532d;
          margin: 0 0 3px; font-family: 'Poppins', sans-serif;
        }
        .lr-mobile-copy p {
          font-size: 11.5px; color: #4b7a5a; margin: 0;
          line-height: 1.5; font-family: 'Poppins', sans-serif;
        }
        .lr-mobile-marquee-wrap {
          border-top: 1px solid #dcfce7;
          padding-top: 10px;
          margin-top: 2px;
        }
        .lr-mobile-marquee-label {
          font-size: 9px; font-weight: 600; color: #86efac;
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 6px;
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="lr-root">

        {/* ──────────── LEFT PANEL ──────────── */}
        <div className="lr-left">
          <div className="lr-form-wrap">

            {/* Brand */}
            <div className="lr-brand">
              <div className="lr-brand-icon">
                <svg width="21" height="21" viewBox="0 0 22 22" fill="none">
                  <rect x="1" y="1" width="8" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="1.5"/>
                  <rect x="3.5" y="3.5" width="3" height="3" fill="white"/>
                  <rect x="13" y="1" width="8" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="1.5"/>
                  <rect x="15.5" y="3.5" width="3" height="3" fill="white"/>
                  <rect x="1" y="13" width="8" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="1.5"/>
                  <rect x="3.5" y="15.5" width="3" height="3" fill="white"/>
                  <rect x="13" y="13" width="3.5" height="3.5" fill="white"/>
                  <rect x="18.5" y="13" width="2.5" height="2.5" fill="white"/>
                  <rect x="13" y="18.5" width="2.5" height="2.5" fill="white"/>
                  <rect x="17" y="17" width="4" height="4" rx="1" fill="white"/>
                </svg>
              </div>
              <div>
                <div className="lr-brand-name">AttendTrack</div>
                <div className="lr-brand-tag">QR Attendance System</div>
              </div>
            </div>

            {/* Heading */}
            <div className="lr-eyebrow">Teacher Portal</div>
            <h1 className="lr-heading">Welcome back</h1>
            <p className="lr-sub">Sign in to manage your classes and track attendance in real time.</p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="lr-field">
                <Label className="lr-label" htmlFor="email">Email address</Label>
                <div className="lr-input-wrap">
                  <Input
                    id="email"
                    className="lr-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    autoComplete="email"
                    required
                    style={{ paddingRight: 42 }}
                  />
                  <span className="lr-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="lr-field">
                <Label className="lr-label" htmlFor="password">Password</Label>
                <div className="lr-input-wrap">
                  <Input
                    id="password"
                    className="lr-input"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="lr-input-btn"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="lr-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl"
                style={{
                  height: 46,
                  background: loading ? "#86efac" : "#16a34a",
                  color: "white",
                  fontSize: 13.5,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  border: "none",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(22,163,74,0.28)",
                  transition: "all 0.2s",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    Sign In
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                )}
              </Button>
            </form>

            <div className="lr-register">
              Don't have an account?{" "}
              <Link to="/register">Create one for free</Link>
            </div>
          </div>

          {/* ── MOBILE FOOTER ── */}
          <div className="lr-mobile-footer">
            <div className="lr-mobile-info">
              <div className="lr-mobile-top">
                <div className="lr-mobile-qr-wrap">
                  <QRCodeSVG size={52} />
                </div>
                <div className="lr-mobile-copy">
                  <h3>QR Attendance System</h3>
                  <p>Scan QR codes for instant,<br/>real-time attendance tracking.</p>
                </div>
              </div>
              <div className="lr-mobile-marquee-wrap">
                <div className="lr-mobile-marquee-label">Features</div>
                <Marquee />
              </div>
            </div>
          </div>
        </div>

        {/* ──────────── RIGHT PANEL ──────────── */}
        <div className="lr-right">
          <div className="lr-right-grid" />
          <div className="lr-right-content">

            {/* Hero */}
            <div className="lr-hero">
              <div className="lr-tagline">Attendance reimagined</div>
              <div className="lr-typing-head">
                {typing || "\u00a0"}
                <span className="lr-cursor" />
              </div>
              <p className="lr-desc">
                Replace paper lists and manual roll calls with lightning-fast QR scanning.
                Every scan is logged instantly — accessible from any device, any time.
              </p>
              <div className="lr-stats">
                <StatCard num="40+" label="Students" sub="active this term" />
                <StatCard num="98%" label="Accuracy" sub="scan recognition" />
                <StatCard num="0.8s" label="Per scan" sub="average time" />
              </div>
            </div>

            {/* QR + steps — wrapped in shadcn Card */}
            <div className="lr-qr-section">
              <Card style={{ border: "1.5px solid #bbf7d0", background: "white", borderRadius: 16, boxShadow: "0 6px 24px rgba(22,163,74,0.09)", flexShrink: 0 }}>
                <CardContent style={{ padding: 16 }}>
                  <div className="lr-qr-card-inner">
                    <div className="lr-qr-frame">
                      <QRCodeSVG size={110} />
                      <div className="lr-scan-beam" />
                    </div>
                    <div className="lr-qr-info">
                      <div className="lr-qr-title">Scan to Attend</div>
                      <div className="lr-qr-hint">Point camera at the code</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lr-qr-steps">
                {[
                  { n: "01", t: "Teacher generates QR", s: "Unique per class & session" },
                  { n: "02", t: "Student scans on arrival", s: "Works on any smartphone" },
                  { n: "03", t: "Attendance logged instantly", s: "Real-time dashboard update" },
                ].map(({ n, t, s }) => (
                  <div key={n} className="lr-step">
                    <div className="lr-step-num">{n}</div>
                    <div className="lr-step-text">
                      {t}
                      <div className="lr-step-sub">{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marquee */}
            <div className="lr-marquee-section">
              <div className="lr-marquee-label">Features</div>
              <Marquee />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}