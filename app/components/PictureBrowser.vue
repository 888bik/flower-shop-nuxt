<template>
  <div class="picture-browser-wrapper">
    <div class="top">
      <div class="close-btn" @click="closeClick">
        <IconClose />
      </div>
    </div>

    <div class="slider">
      <div class="control">
        <div class="btn left" @click="prev">
          <IconArrowLeft width="77" height="77" />
        </div>
        <div class="btn right" @click="next">
          <IconArrowRight width="77" height="77" />
        </div>
      </div>

      <!-- 使用 Transition + 动画名 slide-next/slide-prev -->
      <Transition :name="transitionName" mode="out-in">
        <div class="picture" :key="currentImage">
          <img :src="currentImage" alt="" />
        </div>
      </Transition>
    </div>

    <div class="preview">
      <div class="info">
        <div class="desc">
          <div class="count">
            <span>{{ currentIndex + 1 }}/{{ pictureUrls.length }}:</span>
            <span>flower image 图片{{ currentIndex + 1 }}</span>
          </div>
          <div
            class="toggle justify-between items-center"
            @click="showList = !showList"
          >
            <span class="mr-1">{{ showList ? "隐藏" : "显示" }}照片列表</span>
            <component
              :is="showList ? IconTriangleArrowBottom : IconTriangleArrowTop"
            />
          </div>
        </div>

        <div class="list" :style="{ height: showList ? '67px' : '0' }">
          <div
            v-for="(item, index) in pictureUrls"
            :key="index"
            class="item"
            :class="{ active: index === currentIndex }"
            @click="select(index)"
          >
            <img :src="item" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import IconTriangleArrowBottom from "~/assets/svg/IconTriangleArrowBottom.vue";
import IconArrowLeft from "~/assets/svg/IconArrowLeft.vue";
import IconClose from "~/assets/svg/IconClose.vue";
import IconTriangleArrowTop from "~/assets/svg/IconTriangleArrowTop.vue";
import IconArrowRight from "~/assets/svg/IconArrowRight.vue";

interface Props {
  pictureUrls: string[];
  closeClick: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const currentIndex = ref(0);
const isNext = ref(true);
const showList = ref(true);

const currentImage = computed(
  () => props.pictureUrls[currentIndex.value] || ""
);
const transitionName = computed(() =>
  isNext.value ? "slide-next" : "slide-prev"
);

function next() {
  isNext.value = true;
  currentIndex.value = (currentIndex.value + 1) % props.pictureUrls.length;
}

function prev() {
  isNext.value = false;
  currentIndex.value =
    (currentIndex.value - 1 + props.pictureUrls.length) %
    props.pictureUrls.length;
}

function select(index: number) {
  isNext.value = index > currentIndex.value;
  currentIndex.value = index;
}

function closeClick() {
  if (props.closeClick) props.closeClick();
  else emit("close");
}

// 禁止滚动
onMounted(() => {
  document.body.style.overflow = "hidden";
});
onBeforeUnmount(() => {
  document.body.style.overflow = "auto";
});
</script>

<style scoped lang="scss">
.picture-browser-wrapper {
  position: fixed;
  z-index: 999; // -1 1 9 99 999
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

  background-color: #333;

  .top {
    position: relative;
    height: 86px;

    .close-btn {
      position: absolute;
      top: 15px;
      right: 25px;
      cursor: pointer;
    }
  }

  .slider {
    position: relative;
    display: flex;
    justify-content: center;
    flex: 1;

    .control {
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      color: #fff;

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 83px;
        height: 100%;
        cursor: pointer;
      }
    }

    .picture {
      position: relative;
      height: 100%;
      overflow: hidden;
      width: 100%;
      max-width: 105vh;

      img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        height: 100%;
        user-select: none;
      }
    }

    /* Vue Transition 使用 slide-next / slide-prev */
    .slide-next-enter-active,
    .slide-prev-enter-active,
    .slide-next-leave-active,
    .slide-prev-leave-active {
      transition: all 200ms ease;
    }

    .slide-next-enter-from {
      transform: translateX(100%);
      opacity: 0;
    }
    .slide-next-leave-to {
      transform: translateX(-100%);
      opacity: 0;
    }

    .slide-prev-enter-from {
      transform: translateX(-100%);
      opacity: 0;
    }
    .slide-prev-leave-to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .preview {
    display: flex;
    justify-content: center;
    height: auto;
    margin-top: 10px;

    .info {
      position: relative;
      bottom: 10px;
      max-width: 105vh;
      color: #fff;

      .desc {
        display: flex;
        justify-content: space-between;

        .toggle {
          display: flex;
          cursor: pointer;
        }
      }

      .list {
        margin-top: 3px;
        display: flex;
        transition: height 300ms ease;
        flex-direction: row;
        height: 67px;
        overflow-x: auto; // 横向滚动
        white-space: nowrap; // 防止换行

        .item {
          flex: 0 0 auto;
          margin-right: 15px;
          cursor: pointer;

          img {
            height: 67px;
            opacity: 0.5;
            display: block;
          }

          &.active {
            img {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>
