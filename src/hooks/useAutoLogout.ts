import { useState, useEffect, useRef, useCallback } from 'react';

interface AutoLogoutOptions {
  enabled: boolean;
  timeoutSeconds?: number; // Total timeout in seconds (default 15 minutes = 900s)
  warningSeconds?: number; // Warning modal appears this many seconds before timeout (default 60s)
  onLogout: () => void;
  onSessionExtended?: () => void;
}

export const useAutoLogout = ({
  enabled,
  timeoutSeconds = 10, // 15 minutes default
  warningSeconds = 60, // 60 seconds countdown warning
  onLogout,
  onSessionExtended
}: AutoLogoutOptions) => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(warningSeconds);

  const lastActivityRef = useRef<number>(Date.now());
  const lastThrottleRef = useRef<number>(0);
  const isWarningOpenRef = useRef<boolean>(false);

  // Keep ref in sync
  useEffect(() => {
    isWarningOpenRef.current = isWarningOpen;
  }, [isWarningOpen]);

  // Reset activity timestamp
  const resetActivity = useCallback(() => {
    // If warning is already open, do not silently dismiss on casual mouse hover;
    // user must explicitly click "Stay Signed In" to confirm presence.
    if (!isWarningOpenRef.current) {
      lastActivityRef.current = Date.now();
    }
  }, []);

  // Explicitly extend session
  const staySignedIn = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsWarningOpen(false);
    setRemainingSeconds(warningSeconds);
    if (onSessionExtended) {
      onSessionExtended();
    }
  }, [warningSeconds, onSessionExtended]);

  // Manually trigger test warning for demo / settings page
  const simulateWarning = useCallback(() => {
    // Set last activity to simulate warning state
    lastActivityRef.current = Date.now() - (timeoutSeconds - warningSeconds) * 1000;
    setIsWarningOpen(true);
    setRemainingSeconds(warningSeconds);
  }, [timeoutSeconds, warningSeconds]);

  useEffect(() => {
    if (!enabled) {
      setIsWarningOpen(false);
      return;
    }

    lastActivityRef.current = Date.now();

    // Throttled activity event listener
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastThrottleRef.current > 1000) {
        lastThrottleRef.current = now;
        resetActivity();
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Check inactivity every second
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastActivityRef.current) / 1000);
      const secondsLeft = timeoutSeconds - elapsedSeconds;

      if (secondsLeft <= 0) {
        // Auto-logout triggered
        setIsWarningOpen(false);
        clearInterval(interval);
        onLogout();
      } else if (secondsLeft <= warningSeconds) {
        // Warning threshold reached
        setIsWarningOpen(true);
        setRemainingSeconds(secondsLeft);
      } else {
        // Still active
        if (isWarningOpenRef.current) {
          setIsWarningOpen(false);
        }
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(interval);
    };
  }, [enabled, timeoutSeconds, warningSeconds, onLogout, resetActivity]);

  return {
    isWarningOpen,
    remainingSeconds,
    staySignedIn,
    simulateWarning
  };
};
