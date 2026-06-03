import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { scanAbsent } from "../../api/attendanceApi";

interface ScannedStudent {
  student_id?: number;
  full_name?: string;
  student_number?: string;
  message: string;
  isError: boolean;
}

interface Props {
  sessionId: number;
  onScanned: (studentId?: number) => void;
}

type ScannerState = "idle" | "scanning" | "processing" | "result";

function playShutterSound() {
  try {
    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.08);
    noise.onended = () => ctx.close();
  } catch {}
}

export default function QRScanner({ sessionId, onScanned }: Props) {
  const [state, setState] = useState<ScannerState>("idle");
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState<ScannedStudent | null>(null);
  const [countdown, setCountdown] = useState(0);
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  const lockRef = useRef(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const stopScanner = useCallback(async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch {}
      html5QrRef.current = null;
    }
  }, []);

  const startScanner = useCallback(async () => {
    lockRef.current = false;
    setState("scanning");

    // Wait for DOM element
    await new Promise((r) => setTimeout(r, 100));

    const qr = new Html5Qrcode("qr-video-container");
    html5QrRef.current = qr;

    try {
      await qr.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        async (decodedText) => {
          if (lockRef.current) return;
          lockRef.current = true;

          playShutterSound();
          setFlash(true);
          setState("processing");

          setTimeout(() => setFlash(false), 350);

          await stopScanner();

          try {
            const res = await scanAbsent({ session_id: sessionId, qr_token: decodedText });
            setScanned({
              student_id: res.student_id,
              full_name: res.full_name,
              student_number: res.student_number,
              message: res.message,
              isError: false,
            });
            onScanned(res.student_id ?? undefined);
          } catch (err: any) {
            setScanned({
              message: err.response?.data?.message || "Failed to record attendance.",
              isError: true,
            });
          }

          setState("result");
          startCountdown();
        },
        () => {}
      );
    } catch {
      setState("idle");
    }
  }, [sessionId, stopScanner, onScanned]);

  const startCountdown = useCallback(() => {
    let remaining = 4;
    setCountdown(remaining);
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownRef.current!);
        startScanner();
      }
    }, 1000);
  }, [startScanner]);

  const handleStop = useCallback(async () => {
    clearInterval(countdownRef.current!);
    await stopScanner();
    setState("idle");
    setScanned(null);
    lockRef.current = false;
  }, [stopScanner]);

  useEffect(() => {
    return () => {
      clearInterval(countdownRef.current!);
      stopScanner();
    };
  }, [stopScanner]);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">

      {/* ── Controls ── */}
      <div className="flex items-center gap-3">
        {state === "idle" ? (
          <button
            onClick={startScanner}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
            Start Scanner
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all text-gray-600 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            Stop Scanner
          </button>
        )}

        {state === "result" && countdown > 0 && (
          <span className="text-xs text-gray-400 tabular-nums">
            Restarting in {countdown}s…
          </span>
        )}
      </div>

      {/* ── Scanner Viewport ── */}
      {(state === "scanning" || state === "processing") && (
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-gray-100 bg-black">

          {/* Flash overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
            style={{
              background: "white",
              opacity: flash ? 0.75 : 0,
            }}
          />

          {/* Camera feed */}
          <div id="qr-video-container" className="w-full" />

          {/* Animated scan frame */}
          {state === "scanning" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div
                className="relative"
                style={{ width: 240, height: 240 }}
              >
                {/* Corner marks */}
                {[
                  "top-0 left-0 border-t-2 border-l-2 rounded-tl-md",
                  "top-0 right-0 border-t-2 border-r-2 rounded-tr-md",
                  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md",
                  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-md",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-8 h-8 border-green-400 ${cls}`}
                  />
                ))}

                {/* Scan line */}
                <div
                  className="absolute left-2 right-2 h-0.5 bg-green-400 opacity-80"
                  style={{
                    animation: "scanline 2s ease-in-out infinite",
                    boxShadow: "0 0 8px 2px rgba(74,222,128,0.5)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Processing overlay */}
          {state === "processing" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-white/20 border-t-green-400 rounded-full animate-spin" />
                <p className="text-white/80 text-xs font-medium tracking-wide uppercase">Recording…</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Result Card ── */}
      {state === "result" && scanned && (
        <div
          className={`
            relative w-full max-w-sm rounded-2xl overflow-hidden border
            ${scanned.isError
              ? "border-red-100 bg-red-50"
              : "border-green-100 bg-green-50"
            }
          `}
          style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="px-5 py-4 flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0
                ${scanned.isError
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-800"
                }
              `}
            >
              {scanned.isError ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              ) : (
                getInitials(scanned.full_name)
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              {!scanned.isError && scanned.full_name && (
                <p className="text-sm font-semibold text-gray-800 truncate">{scanned.full_name}</p>
              )}
              {!scanned.isError && scanned.student_number && (
                <p className="text-xs font-mono text-gray-500 mt-0.5">{scanned.student_number}</p>
              )}
              <p
                className={`text-xs mt-1 font-medium ${scanned.isError ? "text-red-600" : "text-green-700"}`}
              >
                {scanned.message}
              </p>
            </div>

            {/* Checkmark */}
            {!scanned.isError && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Countdown bar */}
          <div className="h-0.5 bg-black/5">
            <div
              className={`h-full ${scanned.isError ? "bg-red-400" : "bg-green-500"}`}
              style={{
                animation: "drainBar 4s linear forwards",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes scanline {
          0%   { top: 8px; }
          50%  { top: calc(100% - 8px); }
          100% { top: 8px; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drainBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}