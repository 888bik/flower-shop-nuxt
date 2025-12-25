<template>
  <div>
    <!-- 蒙版 -->
    <div class="fixed inset-0 bg-black/50 z-40" @click="$emit('close')"></div>

    <!-- 聊天框 -->
    <div
      class="fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg"
    >
      <!-- 顶部 -->
      <div
        class="relative flex w-full items-center justify-between px-3 py-2 border-b border-gray-200"
      >
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <span class="font-semibold">客服</span>
        </div>
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- 消息列表 -->
      <div class="p-3 max-h-64 overflow-y-auto">
        <ul class="space-y-2">
          <li class="flex flex-col items-end">
            <span class="text-xs text-gray-500">8:34 AM</span>
            <div class="bg-blue-600/70 text-white px-2 py-1 rounded-lg text-sm">
              你好
            </div>
          </li>
          <li class="flex flex-col items-start">
            <span class="text-xs text-gray-500">8:35 AM</span>
            <div class="bg-gray-100 px-2 py-1 rounded-lg text-sm">
              请问有什么需要咨询的?
            </div>
          </li>
        </ul>
      </div>

      <!-- 输入框 -->
      <div class="relative border-t border-gray-200">
        <input
          type="text"
          placeholder="发送"
          class="w-full h-10 px-3 text-sm rounded-b-lg bg-gray-100 focus:outline-none"
        />
        <button
          class="absolute right-1 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-gray-200 p-1 rounded-full"
        >
          <svg
            class="w-4 h-4"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M4.5 10.5L12 3m0 0L19.5 10.5M12 3v18"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
