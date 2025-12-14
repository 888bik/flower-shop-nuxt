import { reactive } from "vue";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const state = reactive({
  list: [] as ToastItem[],
});

let seed = 0;

function push(message: string, type: ToastType) {
  const id = ++seed;
  state.list.push({ id, message, type });

  // 自动移除
  setTimeout(() => {
    const idx = state.list.findIndex((i) => i.id === id);
    if (idx !== -1) state.list.splice(idx, 1);
  }, 2500);
}

export function useToast() {
  const open = (message: string, type: ToastType) => push(message, type);

  return {
    open,
    success: (msg: string) => push(msg, "success"),
    error: (msg: string) => push(msg, "error"),
    state,
  };
}
