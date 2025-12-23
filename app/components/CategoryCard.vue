<template>
  <div class="scene-wrap">
    <!-- 第一列：大竖 -->
    <a class="card v-big">
      <img src="//img02.hua.com/pc/pimg/home/home_channel_lover.png" />
    </a>

    <!-- 第二列 -->
    <div class="col">
      <a class="card h">
        <img src="//img02.hua.com/pc/pimg/home/home_channel_elder2.png" />
      </a>
      <a class="card h">
        <img src="//img02.hua.com/pc/pimg/home/home_channel_friend.png" />
      </a>
    </div>

    <!-- 第三列 -->
    <a class="card v-big">
      <img src="//img02.hua.com/pc/pimg/home/home_channel_birthday.png" />
    </a>

    <!-- 第四列 -->
    <div class="col">
      <div class="row">
        <a class="card v-mini">
          <img src="//img02.hua.com/pc/pimg/home/home_channel_express.png" />
        </a>
        <a class="card v-mini">
          <img src="//img02.hua.com/pc/pimg/home/home_channel_business.png" />
        </a>
      </div>
      <a class="card h">
        <img src="//img02.hua.com/pc/pimg/home/home_channel_you_3.png?v2" />
      </a>
    </div>
  </div>
</template>
<style scoped>
.scene-wrap {
  width: 1240px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

/* 列布局 */
.col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: flex;
  gap: 10px;
}

/* 卡片通用 */
.card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  display: block;
  background: #f5f5f5;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

/* 图片裁剪策略（重点） */
.card img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* hua.com 就是 cover */
  object-position: center top; /* 防止切头 */
  transition: transform 0.35s ease;
}

.card:hover img {
  transform: scale(1.05);
}

/* 尺寸（与 hua.com 接近） */
.v-big {
  width: 300px;
  height: 520px;
}

.h {
  width: 300px;
  height: 250px;
}

.v-mini {
  width: 145px;
  height: 250px;
}
</style>
