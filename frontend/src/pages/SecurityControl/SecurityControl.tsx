import { useEffect, useState } from "react";
import { LockKeyhole, X } from "lucide-react";

import { db } from "../../firebase";
import {
  defaultSecurityControls,
  saveSecurityControls,
  subscribeToSecurityControls,
  type SecurityControls as SecuritySettings,
} from "../../services/securityControlsRepository";

import "./SecurityControl.css";

/* =========================================================
   TYPES
   ========================================================= */

type SecuritySetting = {
  id: string;
  title: string;
  description: string;
  toggle?: boolean;
  locked?: boolean;
};

/* =========================================================
   SECURITY CONTROLS
   ========================================================= */

export default function SecurityControls() {
  /* =======================================================
     TOGGLE STATES
  ======================================================= */

  const [settings, setSettings] =
    useState<SecuritySettings>(defaultSecurityControls);
  const [savedSettings, setSavedSettings] =
    useState<SecuritySettings>(defaultSecurityControls);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToSecurityControls(
      db,
      (nextSettings) => {
        setSettings(nextSettings);
        setSavedSettings(nextSettings);
        setLoadError("");
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to load security controls", error);
        setLoadError("Unable to load security settings. Please try again.");
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  /* =======================================================
     TOGGLE HANDLER
  ======================================================= */

  const handleToggle = (
    id: keyof SecuritySettings
  ) => {
    if (id === "enableDynamicWatermark") {
      setSettings((prev) => ({
        ...prev,
        enableDynamicWatermark: !prev.enableDynamicWatermark,
        ...(prev.enableDynamicWatermark
          ? {
              showUserId: false,
              showBookId: false,
              showSessionId: false,
              showTimestamp: false,
              rotateWatermark: false,
              repeatWatermark: false,
            }
          : {}),
      }));
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* =======================================================
     SECTION DATA
  ======================================================= */

  const accessProtection: SecuritySetting[] = [
    {
      id: "privatePdfStorage",
      title: "Private PDF Storage",
      description:
        "Keeps original PDF files securely stored in private storage and prevents public access.",
    },
    {
      id: "purchaseValidation",
      title: "Purchase Validation",
      description:
        "Allows users to open an eBook only after verifying that the book has been successfully purchased.",
    },
    {
      id: "secureReadingSession",
      title: "Secure Reading Session",
      description:
        "Creates a protected reading session before delivering book content to the reader.",
    },
    {
      id: "firebaseAppCheck",
      title: "Firebase App Check Protection",
      description:
        "Helps prevent unauthorized apps, scripts, and invalid clients from accessing backend services.",
    },
  ];

  const readerRestrictions: SecuritySetting[] = [
    {
      id: "disablePdfDownload",
      title: "Disable PDF Download",
      description:
        "Prevents users from directly downloading the original PDF file to their device.",
      toggle: true,
      locked: true,
    },
    {
      id: "disableSharing",
      title: "Disable Sharing",
      description:
        "Prevents users from sharing the eBook or its PDF file with other users or applications.",
      toggle: true,
      locked: true,
    },
    {
      id: "disableExport",
      title: "Disable Export",
      description:
        "Prevents book content from being exported outside the application.",
      toggle: true,
      locked: true,
    },
    {
      id: "disablePrinting",
      title: "Disable Printing",
      description:
        "Blocks users from printing the eBook or sending it to supported printing services.",
      toggle: true,
      locked: true,
    },
    {
      id: "disableTextSelection",
      title: "Disable Text Selection",
      description:
        "Prevents users from selecting text inside protected eBooks.",
      toggle: true,
    },
    {
      id: "disableCopyPaste",
      title: "Disable Copy & Paste",
      description:
        "Prevents selected book content from being copied and pasted into other applications.",
      toggle: true,
    },
  ];

  const screenProtection: SecuritySetting[] = [
    {
      id: "blockScreenshots",
      title: "Block Screenshots",
      description:
        "Prevents users from capturing screenshots of protected eBook pages where supported by the device.",
      toggle: true,
    },
    {
      id: "detectScreenRecording",
      title: "Detect Screen Recording",
      description:
        "Detects screen-recording activity so the app can apply protection while protected content is being displayed.",
      toggle: true,
    },
  ];

  const dynamicWatermark: SecuritySetting[] = [
    {
      id: "enableDynamicWatermark",
      title: "Enable Dynamic Watermark",
      description:
        "Displays a personalized watermark over eBook pages to discourage unauthorized copying and redistribution.",
      toggle: true,
    },
    {
      id: "showUserId",
      title: "Show User ID",
      description:
        "Displays the current reader's unique user ID in the watermark.",
      toggle: true,
    },
    {
      id: "showBookId",
      title: "Show Book ID",
      description:
        "Displays the unique ID of the currently opened eBook.",
      toggle: true,
    },
    {
      id: "showSessionId",
      title: "Show Session ID",
      description:
        "Displays the unique secure reading-session ID for additional traceability.",
      toggle: true,
    },
    {
      id: "showTimestamp",
      title: "Show Timestamp",
      description:
        "Displays the current date and time as part of the watermark.",
      toggle: true,
    },
    {
      id: "rotateWatermark",
      title: "Rotate Watermark 45°",
      description:
        "Displays the watermark diagonally at a 45-degree angle across the page.",
      toggle: true,
    },
    {
      id: "repeatWatermark",
      title: "Repeat Watermark",
      description:
        "Repeats the watermark diagonally across the reading area for stronger visual protection.",
      toggle: true,
    },
  ];

  /* =======================================================
     SETTING CARD
  ======================================================= */

  const renderSetting = (
    setting: SecuritySetting
  ) => {
    return (
      <div
        className="security-setting-card"
        key={setting.id}
      >
        <div className="security-setting-content">
          <div className="security-setting-title">
            {setting.title}
          </div>

          <div className="security-setting-description">
            {setting.description}
          </div>
        </div>

        {setting.toggle && (
          <div className="security-setting-actions">
            {setting.locked && (
              <LockKeyhole
                className="security-lock-icon"
                size={20}
                aria-label="Locked security setting"
              />
            )}
            <button
              type="button"
              className={`security-toggle ${
                settings[
                  setting.id as keyof SecuritySettings
                ]
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleToggle(
                  setting.id as keyof SecuritySettings
                )
              }
              disabled={
                setting.locked ||
                (setting.id !== "enableDynamicWatermark" &&
                  !settings.enableDynamicWatermark)
              }
              aria-label={`Toggle ${setting.title}`}
              aria-pressed={
                settings[
                  setting.id as keyof SecuritySettings
                ]
              }
            >
              <span className="security-toggle-circle" />
            </button>
          </div>
        )}
      </div>
    );
  };

  /* =======================================================
     UPDATE SETTINGS
  ======================================================= */

  const handleUpdate = () => {
    if (!hasChanges) return;
    setOtp("");
    setOtpError("");
    setIsVerificationOpen(true);
  };

  const handleVerification = async () => {
    if (otp !== "123456") {
      setOtpError("Enter the correct 6-digit verification code.");
      return;
    }

    setIsSaving(true);
    setOtpError("");

    try {
      await saveSecurityControls(db, settings);
      setSavedSettings(settings);
      setIsVerificationOpen(false);
      setOtp("");
    } catch (saveError) {
      console.error("Failed to save security controls", saveError);
      setOtpError("Unable to save security settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="security-controls-page">

      {isLoading && (
        <p className="security-data-status">Loading security settings...</p>
      )}

      {loadError && (
        <p className="security-data-status security-data-error" role="alert">
          {loadError}
        </p>
      )}

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="security-page-header">
        <h1>Security Features & Controls</h1>

        <p>
          Enable & manage security settings.
        </p>
      </div>

      {/* ===================================================
          1. ACCESS & DELIVERY PROTECTION
      =================================================== */}

      <section className="security-section">
        <h2>
          1. Access & Delivery Protection
        </h2>

        <div className="security-settings-list">
          {accessProtection.map(renderSetting)}
        </div>
      </section>

      {/* ===================================================
          2. READER RESTRICTIONS
      =================================================== */}

      <section className="security-section">
        <h2>
          2. Reader Restrictions
        </h2>

        <div className="security-settings-list">
          {readerRestrictions.map(renderSetting)}
        </div>
      </section>

      {/* ===================================================
          3. SCREEN PROTECTION
      =================================================== */}

      <section className="security-section">
        <h2>
          3. Screen Protection
        </h2>

        <div className="security-settings-list">
          {screenProtection.map(renderSetting)}
        </div>
      </section>

      {/* ===================================================
          4. DYNAMIC WATERMARK
      =================================================== */}

      <section className="security-section">
        <h2>
          4. Dynamic Watermark
        </h2>

        <div className="security-settings-list">
          {dynamicWatermark.map(renderSetting)}
        </div>
      </section>

      {/* ===================================================
          UPDATE BUTTON
      =================================================== */}

      <div className="security-update-wrapper">
        <button
          type="button"
          className="security-update-button"
          onClick={handleUpdate}
          disabled={!hasChanges || isLoading || Boolean(loadError)}
        >
          Update Security Settings
        </button>
      </div>

      {isVerificationOpen && (
        <div className="security-modal-backdrop" role="presentation">
          <div
            className="security-verification-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="security-verification-title"
          >
            <button
              type="button"
              className="security-modal-close"
              onClick={() => setIsVerificationOpen(false)}
              aria-label="Close verification dialog"
            >
              <X size={18} />
            </button>
            <h2 id="security-verification-title">
              Verify security update
            </h2>
            <p>Enter the 6-digit OTP to save your changes.</p>
            <input
              className="security-otp-input"
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              aria-label="6-digit verification OTP"
              autoFocus
            />
            {otpError && <p className="security-otp-error">{otpError}</p>}
            <button
              type="button"
              className="security-verify-button"
              onClick={handleVerification}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Verify & Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}