import { ref, onBeforeUnmount } from "vue";
import type { OrderListItem } from "~/types/api/orders";

export function useOrderList(api: any, toast: any) {
  const orders = ref<OrderListItem[]>([]);
  const loading = ref(false);
  const loadingMore = ref(false);
  const page = ref(1);
  const limit = 10;
  const allLoaded = ref(false);

  const remainingMap = ref<Record<number, number>>({});
  let ticker: number | null = null;

  async function loadList(reset = false) {
    if (reset) {
      page.value = 1;
      orders.value = [];
      allLoaded.value = false;
      loading.value = true;
    } else {
      loadingMore.value = true;
    }

    try {
      const res = await api.orders.getOrderList(page.value, limit);
      const list = Array.isArray(res) ? res : res?.list ?? [];

      if (!list.length) {
        allLoaded.value = true;
      } else {
        orders.value.push(...list);
        page.value++;
      }

      computeRemaining();
    } catch (e) {
      toast.error("加载订单失败");
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  }

  function refresh() {
    loadList(true);
  }

  function loadMore() {
    if (!allLoaded.value && !loadingMore.value) {
      loadList(false);
    }
  }

  function computeRemaining() {
    const now = Math.floor(Date.now() / 1000);
    const map: Record<number, number> = {};

    orders.value.forEach((o) => {
      if (o.payStatus !== "unpaid" || !o.expireTime) {
        map[o.orderId] = 0;
        return;
      }

      const remain =
        o.expireTime > 1_000_000_000 ? o.expireTime - now : o.expireTime;

      map[o.orderId] = Math.max(remain, 0);
    });

    remainingMap.value = map;
    startTicker();
  }
  function startTicker() {
    if (ticker) return;

    if (Object.values(remainingMap.value).some((v) => v > 0)) {
      ticker = setInterval(() => {
        let active = false;

        Object.entries(remainingMap.value).forEach(([key, value]) => {
          if (value > 0) {
            remainingMap.value[Number(key)] = value - 1;
            active = true;
          }
        });

        if (!active && ticker) {
          clearInterval(ticker);
          ticker = null;
        }
      }, 1000) as unknown as number;
    }
  }

  onBeforeUnmount(() => {
    if (ticker) clearInterval(ticker);
  });

  function itemCount(o: OrderListItem) {
    return o.items.reduce((s, it) => s + it.num, 0);
  }

  return {
    orders,
    loading,
    loadingMore,
    allLoaded,
    remainingMap,
    loadList,
    refresh,
    loadMore,
    itemCount,
  };
}
