import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export const { persistAtom: persistAtomCommon } = recoilPersist({
  key: "persistAtomCommon",
});

const { persistAtom: persistAtomRecords } = recoilPersist({
  key: "persistAtomRecords",
});

export const doneCountAtom = atom({
  key: "app/doneCountAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});

export const savedRecordsAtom = atom({
  key: "app/savedRecordsAtom",
  default: [],
  effects_UNSTABLE: [persistAtomRecords],
});

export const countAtom = atom({
  key: "app/countAtom",
  default: 0,
  effects_UNSTABLE: [persistAtomCommon],
});
