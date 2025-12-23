<template>
  <div
    class="max-w-sm border border-gray-300 rounded-lg shadow-lg bg-white p-6 space-y-4"
  >
    <div class="flex items-center space-x-4">
      <div
        class="h-12 w-12 flex items-center justify-center text-white text-lg font-semibold rounded-full bg-gold"
      >
        <div v-if="user.avatar && !anonymous">
          <img
            :src="user.avatar"
            :alt="user.nickname ?? '匿名用户'"
            class="rounded-full object-cover"
          />
        </div>
        <div v-else>U</div>
      </div>
      <div>
        <div class="text-gray-900 font-medium">{{ user.nickname }}</div>
        <div class="text-gray-600 text-sm">{{ user.level ?? "青铜会员" }}</div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="text-red-500 text-xl">
        <RatingStars :model-value="rating" :size="16"/>
      </div>
      <div class="text-xs">{{ formatTime(date) }}</div>
    </div>

    <p class="text-gray-700">
      {{ content }}
    </p>

    <div class="font-medium cursor-pointer hover:underline text-[#333]">
      查看更多
    </div>
  </div>
</template>
<script lang="ts" setup>
import { timeAgo } from "~/utils/utils";
import RatingStars from "./RatingStars.vue";
interface IProps {
  rating: number;
  content: string;
  user: {
    nickname: string;
    avatar: string;
    level?: string;
  };
  date: number;
  anonymous?: boolean;
}
const {
  rating,
  content,
  user,
  date,
  anonymous = false,
} = defineProps<IProps>();
const formatTime = (timestamp: number) => timeAgo(timestamp);
</script>
