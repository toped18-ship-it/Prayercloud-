import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import admin from "firebase-admin";
import webpush from "web-push";

// Helper to safely sanitize and repair private key strings
function cleanPrivateKey(raw?: string): string | null {
  if (!raw || typeof raw !== "string") return null;
  let key = raw.trim();

  // If a full service account JSON was provided
  if (key.includes("{") && key.includes('"private_key"')) {
    try {
      const parsed = JSON.parse(key);
      if (typeof parsed.private_key === "string") {
        key = parsed.private_key.trim();
      }
    } catch {
      // Continue with pattern matching
    }
  }

  // If trailing JSON properties were pasted into the env var
  if (key.includes("-----END PRIVATE KEY-----")) {
    key = key.substring(
      0,
      key.indexOf("-----END PRIVATE KEY-----") + "-----END PRIVATE KEY-----".length
    );
  }

  // Replace literal escaped newlines
  key = key.replace(/\\n/g, "\n").trim();

  // If header was stripped or missing
  if (!key.startsWith("-----BEGIN PRIVATE KEY-----")) {
    const base64Index = key.indexOf("MII");
    if (base64Index !== -1) {
      key = `-----BEGIN PRIVATE KEY-----\n${key.substring(base64Index)}`;
    }
  }

  // Verify minimal structure before returning
  if (!key.startsWith("-----BEGIN PRIVATE KEY-----") || !key.includes("-----END PRIVATE KEY-----")) {
    return null;
  }

  if (!key.endsWith("\n")) {
    key += "\n";
  }

  return key;
}

// Lazy init Firebase Admin
let adminApp: admin.app.App | null = null;
let adminInitAttempted = false;

function getAdminApp(): admin.app.App | null {
  if (adminInitAttempted) {
    return adminApp;
  }

  adminInitAttempted = true;

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "prayercloud-e341d";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = cleanPrivateKey(rawKey);

    if (projectId && clientEmail && privateKey) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } else {
      console.warn("Firebase Admin credentials missing or unconfigured.");
    }
  } catch {
    console.warn("Firebase Admin SDK initialization skipped (credentials not configured or invalid).");
    adminApp = null;
  }

  return adminApp;
}

// Configure Web Push
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "BD-TXtDTyduyeFXQk4SryD5iZwVniaoO7_YpS6E_v_mmgEzAMHrjSCnTGNiWcZxPx1cqft_BxkyaM-UbhBchZ-w";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "rM16JKWc5Wj1xhjpw8Omh1fucM2i9ALr8Gt8TNRUj74";

let vapidEmail = process.env.VAPID_EMAIL || "mailto:admin@prayercloud.org";
if (vapidEmail && !vapidEmail.startsWith("mailto:") && !vapidEmail.startsWith("http://") && !vapidEmail.startsWith("https://")) {
  vapidEmail = `mailto:${vapidEmail}`;
}

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Static serving for user-uploaded files from phones/computers
  const UPLOADS_DIR = path.resolve(process.cwd(), "public", "uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use("/uploads", express.static(UPLOADS_DIR));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString(), admin: !!getAdminApp() });
  });

  // Upload file endpoint for devices (computers, phones, tablets)
  app.post("/api/upload", (req, res) => {
    try {
      const { fileName, fileType, base64Data } = req.body;
      if (!fileName || !base64Data) {
        return res.status(400).json({ error: "Missing fileName or base64Data" });
      }

      // Strip data URL prefix if present: data:image/png;base64,...
      const commaIndex = base64Data.indexOf(",");
      const cleanBase64 = commaIndex !== -1 ? base64Data.substring(commaIndex + 1) : base64Data;
      const buffer = Buffer.from(cleanBase64, "base64");

      // Sanitize filename
      const ext = path.extname(fileName) || "";
      const base = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      const safeName = `${Date.now()}_${base.substring(0, 40)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);

      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${safeName}`;
      res.json({
        success: true,
        url: fileUrl,
        fileName: safeName,
        originalName: fileName,
        size: buffer.length,
        fileType: fileType || "application/octet-stream"
      });
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const msg = err instanceof Error ? err.message : "Failed to save file";
      res.status(500).json({ error: msg });
    }
  });

  // List recent uploads
  app.get("/api/uploads", (_req, res) => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        return res.json([]);
      }
      const files = fs.readdirSync(UPLOADS_DIR).map(name => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, name));
        return {
          name,
          url: `/uploads/${name}`,
          size: stats.size,
          createdAt: stats.birthtime
        };
      });
      res.json(files.reverse());
    } catch {
      res.status(500).json({ error: "Failed to list uploads" });
    }
  });

  // Push Notification Subscription
  // In a real app, you would save this to your database associated with a user
  app.post("/api/push/subscribe", async (req, res) => {
    const subscription = req.body;
    console.log("New push subscription received:", subscription);
    
    // For demo purposes, we'll just send a welcome notification immediately
    const payload = JSON.stringify({
      title: "PRAYERCLOUD Connected",
      body: "You will now receive global mission alerts.",
      icon: "/pwa-192x192.png"
    });

    try {
      await webpush.sendNotification(subscription, payload);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error sending welcome notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Admin: Send alert to all (simulated)
  app.post("/api/admin/broadcast", async (req, res) => {
    const { title, body, icon } = req.body;
    console.log(`Broadcasting alert: ${title} - ${body} (icon: ${icon})`);
    
    // This would fetch subscriptions from Firestore in a real app
    // For now, it's a placeholder for where that logic would go
    res.json({ message: `Broadcast for "${title}" initiated. (Requires subscription database)` });
  });

  // Mock data for countries (Joshua Project like)
  app.get("/api/countries", (req, res) => {
    res.json([
      {
        id: "af",
        name: "Afghanistan",
        flag: "🇦🇫",
        population: 40000000,
        religion: "Islam",
        christianPercentage: 0.01,
        unreachedPercentage: 99.9,
        unreachedGroupsCount: 72,
        riskLevel: "Extreme",
        prayerPoints: [
          "Safety for underground believers.",
          "God's peace to reign over the nation.",
          "Access to digital scriptures."
        ]
      },
      {
        id: "in",
        name: "India",
        flag: "🇮🇳",
        population: 1400000000,
        religion: "Hinduism",
        christianPercentage: 2.3,
        unreachedPercentage: 95.0,
        unreachedGroupsCount: 2135,
        riskLevel: "High",
        prayerPoints: [
          "Revival among the 2000+ unreached groups.",
          "Protection for rural outreach teams.",
          "Unity in the local church."
        ]
      },
      {
        id: "tr",
        name: "Turkey",
        flag: "🇹🇷",
        population: 85000000,
        religion: "Islam",
        christianPercentage: 0.2,
        unreachedPercentage: 99.0,
        unreachedGroupsCount: 28,
        riskLevel: "Moderate",
        prayerPoints: [
          "Softening of hearts in the major cities.",
          "New church plants in unreached provinces.",
          "Wisdom for local evangelists."
        ]
      }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PRAYERCLOUD server running on http://localhost:${PORT}`);
  });
}

startServer();
