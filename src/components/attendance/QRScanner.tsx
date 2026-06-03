import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { scanAbsent } from "../../api/attendanceApi";
import { Button } from "../ui/button";

interface Props {
  sessionId: number;
  onScanned: (studentId?: number) => void; // pass back student id so parent can scroll
}

/** Plays a quick camera-shutter click using the Web Audio API — no external file needed. */
function playShutterSound() {
  try {
    const ctx = new AudioContext();

    // Short noise burst (the "click" body)
    const bufferSize = ctx.sampleRate * 0.04; // 40 ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Band-pass filter to give it a "mechanical" tone
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;

    // Quick gain envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.08);

    // Clean up after playback
    noise.onended = () => ctx.close();
  } catch {
    // AudioContext unavailable — silently skip
  }
}

export default function QRScanner({ sessionId, onScanned }: Props) {
  const [active, setActive] = useState(false);
  const [lastScan, setLastScan] = useState<{ message: string; isError: boolean } | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!active) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 220, height: 220 } },
      false
    );

    scannerRef.current.render(
      async (decodedText) => {
        // Play shutter sound immediately on every successful QR decode
        playShutterSound();

        try {
          const res = await scanAbsent({ session_id: sessionId, qr_token: decodedText });
          setLastScan({ message: res.message, isError: false });

          // Notify parent — pass student id if the API returns it so parent can scroll
          onScanned(res.student_id ?? undefined);
        } catch (err: any) {
          setLastScan({
            message: err.response?.data?.message || "Error scanning",
            isError: true,
          });
        }
      },
      () => {}
    );

    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
  }, [active]);

  return (
    <div className="space-y-3">
      {!active ? (
        <Button
          onClick={() => setActive(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm h-9"
        >
          Start QR Scanner
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setActive(false)}
          className="w-full sm:w-auto text-sm h-9"
        >
          Stop Scanner
        </Button>
      )}

      {active && (
        <div
          id="qr-reader"
          className="rounded-lg overflow-hidden border border-gray-100 w-full"
        />
      )}

      {lastScan && (
        <p
          className={`text-sm font-medium px-3 py-2 rounded-md ${
            lastScan.isError
              ? "text-red-700 bg-red-50"
              : "text-green-700 bg-green-50"
          }`}
        >
          {lastScan.message}
        </p>
      )}
    </div>
  );
}