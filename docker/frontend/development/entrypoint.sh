#!/bin/sh
set -e

# Only expose NEXT_PUBLIC_* to the browser, never secrets.
node -e '
  const fs = require("fs");
  const out = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("NEXT_PUBLIC_")) out[key] = value;
  }
  fs.writeFileSync("/app/public/env.js", "window.__ENV = " + JSON.stringify(out, null, 2) + ";\n");
'

exec "$@"
