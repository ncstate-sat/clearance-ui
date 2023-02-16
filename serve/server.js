import path from "path";
import { readFile } from "fs/promises";
import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const response = async (req, res, next) => {
  const envVariableKeys = Object.keys(process.env).filter((key) =>
    key.includes("VITE_")
  );
  const environmentVariables = {};
  envVariableKeys.forEach((key) => {
    environmentVariables[key] = process.env[key];
  });

  let indexFile = await readFile(
    path.join(__dirname, "..", "dist", "index.html"),
    "utf8"
  );
  indexFile = indexFile.replaceAll(
    "__ENV_VARIABLES__",
    JSON.stringify(environmentVariables)
  );

  return res.send(indexFile);
};

// The index.html file must be changed before it is sent, so this route should be prioritized over express.static.
app.get("/", response);

// All static files that aren't index.html are free to be sent from the build folder.
app.use(express.static(path.join(__dirname, "..", "dist")));

// Any other path is considored part of the app's URL map. Since this is a SPA, the index.html file should be sent.
app.get("/*", response);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Now listening on port ${process.env.PORT || 3000}`);
});
