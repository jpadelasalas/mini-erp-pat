import type { DocNo } from "../types";

export type PerUser<T> = Record<string, T[]>;

export const getLocalData = <T extends object>(key: string, defaultVal = {} as T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultVal));
  } catch {
    return defaultVal;
  }
};

export const getUserId = (): string | null => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    return user?.id || null;
  } catch {
    return null;
  }
};

type DocKey = "inventory" | "sales" | "employees";
type DocNoStore = Record<string, Record<DocKey, DocNo>>;

export const getDocNo = (userId: string | null, key: DocKey): DocNo | null =>
  (userId && getLocalData<DocNoStore>("docno")[userId]?.[key]) || null;

export const formatDocNo = ({ prefix, docnum, length }: DocNo) =>
  prefix + String(docnum).padStart(length, "0");

export const bumpDocNo = (userId: string | null, key: DocKey) => {
  const docno = getLocalData<DocNoStore>("docno");
  if (!userId || !docno[userId]?.[key]) return false;
  docno[userId][key].docnum += 1;
  localStorage.setItem("docno", JSON.stringify(docno));
  return true;
};
