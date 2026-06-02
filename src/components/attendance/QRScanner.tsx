import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { scanAbsent } from "../../api/attendanceApi";
import { Button } from "../ui/button";

interface Props {
  sessionId: number;
  onScanned: () => void;
}

export default function QRScanner({ sessionId, onScanned }: Props) {
  const [active, setActive] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!active) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scannerRef.current.render(
      async (decodedText) => {
        try {
          const res = await scanAbsent({ session_id: sessionId, qr_token: decodedText });
          setLastScan(res.message);
          onScanned();
        } catch (err: any) {
          setLastScan(err.response?.data?.message || "Error scanning");
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
        <Button onClick={() => setActive(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm h-9">
          Start QR Scanner
        </Button>
      ) : (
        <Button variant="outline" onClick={() => setActive(false)} className="text-sm h-9">
          Stop Scanner
        </Button>
      )}
      {active && <div id="qr-reader" className="rounded-lg overflow-hidden border border-gray-100" />}
      {lastScan && (
        <p className="text-sm font-medium text-green-700 bg-green-50 px-3 py-2 rounded-md">
          {lastScan}
        </p>
      )}
    </div>
  );
}