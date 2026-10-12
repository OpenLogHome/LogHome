import Dexie from "dexie";
export const textCorrectionDB = new Dexie("loghome-pc-text-correction");
textCorrectionDB.version(1).stores({
  standardCache: "id",
  standardIgnored: "id",
  smartCache: "id",
  smartIgnored: "id",
});
