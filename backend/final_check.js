import fs from "fs";
import("./src/app.js")
  .then(() => console.log("CHECK: App imported successfully"))
  .catch((err) => {
    console.error("CHECK: App import failed");
    fs.writeFileSync("error_log.txt", err.stack || err.toString());
    process.exit(1);
  });
