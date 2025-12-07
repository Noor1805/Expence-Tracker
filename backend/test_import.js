import("./src/app.js")
  .then(() => console.log("App imported successfully"))
  .catch((err) => {
    console.error("Import failed");
    console.error(err);
    console.error(err.stack);
  });
