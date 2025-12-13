<template>
  <footer class="footer-wrap">
    <div class="container">
      <div class="service">
        <div
          v-for="(item, idx) in footerData"
          :key="item.name + idx"
          class="service-item"
        >
          <div class="name">{{ item.name }}</div>
          <div class="list">
            <div v-for="it in item.list" :key="it" class="list-item">
              {{ it }}
            </div>
          </div>
        </div>
      </div>

      <div class="statement">
        <div class="brand">
          <img src="/flower-shop.svg" alt="花间雅苑" class="logo" />
          <div class="brand-text">
            <div class="brand-name">花间雅苑</div>
            <div class="brand-sub">Luxury Flowers & Gifts</div>
          </div>
        </div>

        <p class="copyright">
          © 2025 花间雅苑. 保留所有权利 · 条款 · 隐私政策 · 网站地图
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import footerData from "~/assets/data/footer.json";
</script>

<style>
.footer-wrap {
  background: var(--brand, #0f1724);
  color: var(--text-on-dark, #f3f4f6);
  padding: 48px 0;
  font-family: Inter, "Noto Sans SC", system-ui, -apple-system, "Helvetica Neue",
    Arial;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}

.service {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.service-item .name {
  font-weight: 600;
  color: var(--gold, #d4af37);
  margin-bottom: 10px;
  font-size: 15px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.list-item {
  color: rgba(243, 244, 246, 0.84);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s, transform 0.12s;
}
.list-item:hover {
  color: var(--gold, #d4af37);
  transform: translateX(4px);
}

.statement {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  padding-top: 18px;
  padding-bottom: 6px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}
.brand-name {
  font-weight: 700;
  color: var(--gold, #d4af37);
  font-size: 16px;
}
.brand-sub {
  font-size: 12px;
  color: rgba(243, 244, 246, 0.7);
}

/* 小屏适配 */
@media (max-width: 900px) {
  .service {
    grid-template-columns: repeat(2, 1fr);
  }
  .statement {
    flex-direction: column;
    align-items: flex-start;
  }
}
@media (max-width: 520px) {
  .service {
    grid-template-columns: 1fr;
  }
  .container {
    padding: 0 12px;
  }
}
</style>
