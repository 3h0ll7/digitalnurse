import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import useOnlineStatus from "@/hooks/useOnlineStatus";

const RECONNECT_BANNER_DURATION_MS = 3000;

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const previousOnlineStatusRef = useRef(isOnline);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    const wasOnline = previousOnlineStatusRef.current;

    if (isOnline && !wasOnline) {
      setShowReconnected(true);
      timeoutId = window.setTimeout(() => {
        setShowReconnected(false);
      }, RECONNECT_BANNER_DURATION_MS);
    }

    if (!isOnline) {
      setShowReconnected(false);
    }

    previousOnlineStatusRef.current = isOnline;

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isOnline]);

  if (isOnline && !showReconnected) {
    return null;
  }

  const isOfflineBanner = !isOnline;

  return (
    <div
      className={`fixed top-0 z-[9999] w-full transform transition-all duration-300 ease-in-out ${
        isOfflineBanner
          ? "bg-red-600/95 text-white translate-y-0"
          : "bg-green-600/95 text-white translate-y-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
        {isOfflineBanner ? <WifiOff size={16} /> : <Wifi size={16} />}
        <span>
          {isOfflineBanner
            ? "Offline — Clinical references available · AI unavailable"
            : "Back online — all features available"}
        </span>
      </div>
    </div>
  );
};

export default OfflineBanner;
