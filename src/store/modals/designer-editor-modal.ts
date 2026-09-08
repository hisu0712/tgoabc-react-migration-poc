import { create } from "zustand";
import { devtools, combine } from "zustand/middleware";

type CreateMode = {
  isOpen: true;
  type: "CREATE";
};

type EditMode = {
  isOpen: true;
  type: "EDIT";
  designerId: number;
  name: string;
  phone: string;
};

type OpenState = CreateMode | EditMode;

type CloseState = {
  isOpen: false;
};

type State = OpenState | CloseState;

const initialState = {
  isOpen: false,
} as State;

const useDesignerEditorModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        openCreate: () => {
          set({ isOpen: true, type: "CREATE" });
        },
        openEdit: (param: Omit<EditMode, "isOpen" | "type">) => {
          set({ isOpen: true, type: "EDIT", ...param });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "designerEditorStore" },
  ),
);

export const useOpenCreateDesignerModal = () => {
  const openCreate = useDesignerEditorModalStore(
    (store) => store.actions.openCreate,
  );
  return openCreate;
};

export const useOpenEditDesignerModal = () => {
  const openEdit = useDesignerEditorModalStore(
    (store) => store.actions.openEdit,
  );
  return openEdit;
};

export const useDesignerEditorModal = () => {
  const store = useDesignerEditorModalStore();
  return store as typeof store & State;
};
