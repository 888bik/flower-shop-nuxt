import { reactive } from "vue";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  _timer?: ReturnType<typeof setTimeout> | null;
  _startAt?: number;
  _remaining?: number;
}

const state = reactive({
  list: [] as ToastItem[],
});

let seed = 0;
const DEFAULT_DURATION = 3000;
const MAX_VISIBLE = 5; // 最多同时显示数量

function removeById(id: number) {
  const idx = state.list.findIndex((i) => i.id === id);
  if (idx !== -1) state.list.splice(idx, 1);
}

function startTimer(item: ToastItem) {
  // 清理旧 timer
  if (item._timer) {
    clearTimeout(item._timer);
    item._timer = null;
  }
  item._startAt = Date.now();
  item._remaining = item.duration;
  item._timer = setTimeout(() => {
    removeById(item.id);
  }, item._remaining);
}

function push(message: string, type: ToastType, duration = DEFAULT_DURATION) {
  // 限制最大同时显示，超过则移除最早的一条
  if (state.list.length >= MAX_VISIBLE) {
    state.list.shift();
  }

  const id = ++seed;
  const item: ToastItem = {
    id,
    message,
    type,
    duration,
    _timer: null,
    _startAt: undefined,
    _remaining: duration,
  };

  state.list.push(item);
  // 启动计时器
  startTimer(item);

  return id;
}

export function useToast() {
  const open = (
    message: string,
    type: ToastType = "success",
    duration?: number
  ) => push(message, type, duration ?? DEFAULT_DURATION);

  const success = (msg: string, duration?: number) =>
    push(msg, "success", duration);
  const error = (msg: string, duration?: number) =>
    push(msg, "error", duration);

  function close(id: number) {
    const item = state.list.find((i) => i.id === id);
    if (!item) return;
    if (item._timer) {
      clearTimeout(item._timer);
      item._timer = null;
    }
    removeById(id);
  }

  function pause(id: number) {
    const item = state.list.find((i) => i.id === id);
    if (!item) return;
    if (!item._timer) return;
    // 计算剩余时间
    const elapsed = Date.now() - (item._startAt ?? Date.now());
    const rem = (item._remaining ?? item.duration) - elapsed;
    item._remaining = rem > 0 ? rem : 0;
    if (item._timer) {
      clearTimeout(item._timer);
      item._timer = null;
    }
  }

  function resume(id: number) {
    const item = state.list.find((i) => i.id === id);
    if (!item) return;
    // 只有在确实有剩余时间时重启
    const remaining = item._remaining ?? item.duration;
    if (remaining <= 0) {
      removeById(id);
      return;
    }
    item._startAt = Date.now();
    item._timer = setTimeout(() => {
      removeById(id);
    }, remaining);
  }

  return {
    open,
    success,
    error,
    close,
    pause,
    resume,
    state,
  };
}
