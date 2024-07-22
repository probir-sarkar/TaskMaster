// for form store zustand, open or not
import { CardType } from "@/components/dnd/Card";
import { create } from "zustand";

type FormState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  editItem?: CardType | null;
  setEditItem: (item: CardType | null) => void;
};

export const useFormStore = create<FormState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  editItem: null,
  setEditItem: (editItem) => set({ editItem })
}));
