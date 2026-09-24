import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";

export type SecurityControls = {
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

export const defaultSecurityControls: SecurityControls = {
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
};

const securityControlsReference = (db: Firestore) =>
  doc(db, "appSettings", "securityControls");

export function subscribeToSecurityControls(
  db: Firestore,
  onChange: (settings: SecurityControls) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    securityControlsReference(db),
    (snapshot) => {
      const data = snapshot.data() as Partial<SecurityControls> | undefined;
      onChange({ ...defaultSecurityControls, ...data });
    },
    (error) => onError(error)
  );
}

export async function saveSecurityControls(
  db: Firestore,
  settings: SecurityControls
) {
  await setDoc(
    securityControlsReference(db),
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
