import { create } from "zustand";
import { TGrade } from "~/types/grade";
import { TUstadz } from "~/types/ustadz";

interface CatalogStore {
  grades: TGrade[];
  ustadzs: TUstadz[];
  setGrades: (grades: TGrade[]) => void;
  setUstadzs: (ustadzs: TUstadz[]) => void;
}

export const useCatalogStore = create<CatalogStore>((set) => ({
  grades: [],
  ustadzs: [],
  setGrades: (grades) => set({ grades }),
  setUstadzs: (ustadzs) => set({ ustadzs }),
}));
