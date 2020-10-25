<template>
    <div id="home">
        <div class="h">
        <h1>Machine Learning คือ การทำให้ระบบคอมพิวเตอร์เรียนรู้ได้ด้วยตนเอง โดยใช้ ข้อมูล</h1>
        <h1>เรามาเรียนรู้ Machine Learning ผ่านเกมนี้กันดีกว่า</h1>
        <button id="nav"><router-link to="/rules">START</router-link></button>
        </div>

    </div>
</template>

<script>

export default {
    name: 'Home'
}
</script>
<style scoped>
#nav {
  margin-top: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 50px;
  padding-right: 50px;
  background-color: #ed7d31;
  font-size: 30px;
  border:  #ed7d31;
}

.h{
    margin-top:30vh;
    margin-bottom: 30vh;
}
</style>