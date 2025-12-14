<template>
  <v-container class="py-8" style="max-width: 720px">
    <v-card rounded="xl" elevation="4">
      <v-card-title class="text-h6 font-weight-bold">
        编辑个人资料
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <!-- 头像 -->
          <div class="d-flex align-center mb-6">
            <v-avatar size="96" class="mr-4">
              <v-img v-if="form.avatar" :src="form.avatar" />
              <v-icon v-else size="48">mdi-account</v-icon>
            </v-avatar>

            <v-btn variant="outlined" @click="triggerFileInput">
              更换头像
            </v-btn>
            <!-- 隐藏文件输入 -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange"
            />
          </div>

          <!-- 昵称 -->
          <v-text-field
            v-model="form.nickname"
            label="昵称"
            placeholder="请输入昵称"
            :rules="[rules.required, rules.max20]"
          />

          <!-- 手机号 -->
          <v-text-field
            v-model="form.phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[rules.phone]"
          />

          <!-- 邮箱 -->
          <v-text-field
            v-model="form.email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[rules.email]"
          />

          <!-- 备注 / 简介 -->
          <!-- <v-textarea
            v-model="form.bio"
            label="个人简介"
            rows="3"
            counter="100"
          /> -->
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="goBack">取消</v-btn>
        <v-btn
          color="primary"
          :loading="saving"
          :disabled="!valid"
          @click="onSubmit"
        >
          保存修改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <!-- 弹窗 -->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/user";

definePageMeta({ layout: "profile", requiresAuth: true });

const router = useRouter();
const userStore = useUserStore();

const valid = ref(false);
const saving = ref(false);
const uploading = ref(false);
const formRef = ref();
const fileInput = ref<HTMLInputElement | null>(null);

const form = reactive({
  avatar: "",
  nickname: "",
  phone: "",
  email: "",
});

const rules = {
  required: (v: string) => !!v || "必填项",
  max20: (v: string) => !v || v.length <= 20 || "最多 20 个字符",
  phone: (v: string) => !v || /^1[3-9]\d{9}$/.test(v) || "手机号格式不正确",
  email: (v: string) => !v || /.+@.+\..+/.test(v) || "邮箱格式不正确",
};

onMounted(() => {
  const u = userStore.userInfo?.user;
  if (u) {
    form.avatar = u.avatar ?? "";
    form.nickname = u.nickname ?? "";
    form.phone = u.phone ?? "";
    form.email = u.email ?? "";
  }
});

// 触发文件选择
function triggerFileInput() {
  fileInput.value?.click();
}
//上传文件
async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];

  if (!file) return; // 如果没有文件，直接返回

  // 预览 Base64
  const reader = new FileReader();
  reader.onload = (event) => {
    form.avatar = event.target?.result as string;
  };
  reader.readAsDataURL(file);

  // 上传到服务器
  const formData = new FormData();
  formData.append("file", file);
  uploading.value = true;

  try {
    const { $api } = useNuxtApp();
    const res = await $api.user.uploadAvatar(formData);
    form.avatar = res.url; // 用返回的 URL 替换 Base64
  } catch (err: any) {
    console.error(err);
    $toast.error("上传失败");
  } finally {
    uploading.value = false;
  }
}

async function onSubmit() {
  const ok = await formRef.value?.validate();
  if (!ok) return;

  try {
    saving.value = true;
    await userStore.updateUserInfo({ ...form });
    router.push("/profile");
  } finally {
    saving.value = false;
  }
}

function goBack() {
  router.back();
}
</script>

<style scoped></style>
