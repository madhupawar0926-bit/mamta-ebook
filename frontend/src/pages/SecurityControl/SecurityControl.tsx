import { useState } from "react";

import "./SecurityControl.css";

/* =========================================================
   TYPES
   ========================================================= */

type SecuritySetting = {
  id: string;
  title: string;
  description: string;
  toggle?: boolean;
};

type SecuritySettings = {
  disablePdfDownload: boolean;
  disableSharing: boolean;
  disableExport: boolean;
  disablePrinting: boolean;
  disableTextSelection: boolean;
  disableCopyPaste: boolean;
  blockScreenshots: boolean;
  detectScreenRecording: boolean;
  enableDynamicWatermark: boolean;
  showUserId: boolean;
  showBookId: boolean;
  showSessionId: boolean;
  showTimestamp: boolean;
  rotateWatermark: boolean;
  repeatWatermark: boolean;
};

/* =========================================================
   SECURITY CONTROLS
   ========================================================= */

export default function SecurityControls() {
  /* =======================================================
     TOGGLE STATES
  ======================================================= */

  const [settings, setSettings] =
    useState<SecuritySettings>({
      disablePdfDownload: true,
      disableSharing: true,
      disableExport: true,
      disablePrinting: true,
      disableTextSelection: true,
      disableCopyPaste: true,

      blockScreenshots: true,
      detectScreenRecording: true,

      enableDynamicWatermark: true,
      showUserId: true,
      showBookId: true,
      showSessionId: true,
      showTimestamp: true,
      rotateWatermark: true,
      repeatWatermark: true,
    });

  /* =======================================================
     TOGGLE HANDLER
  ======================================================= */

  const handleToggle = (
    id: keyof SecuritySettings
  ) => {
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
    },
    {
      id: "disableSharing",
      title: "Disable Sharing",
      description:
        "Prevents users from sharing the eBook or its PDF file with other users or applications.",
      toggle: true,
    },
    {
      id: "disableExport",
      title: "Disable Export",
      description:
        "Prevents book content from being exported outside the application.",
      toggle: true,
    },
    {
      id: "disablePrinting",
      title: "Disable Printing",
      description:
        "Blocks users from printing the eBook or sending it to supported printing services.",
      toggle: true,
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
            aria-label={`Toggle ${setting.title}`}
            aria-pressed={
              settings[
                setting.id as keyof SecuritySettings
              ]
            }
          >
            <span className="security-toggle-circle" />
          </button>
        )}
      </div>
    );
  };

  /* =======================================================
     UPDATE SETTINGS
  ======================================================= */

  const handleUpdate = () => {
    console.log(
      "Updated Security Settings:",
      settings
    );

    // API call can be added here later.
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="security-controls-page">

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
        >
          Update Security Settings
        </button>
      </div>
    </div>
  );
}