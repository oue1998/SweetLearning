<template>
    <div>
      <h1>มาเรียนรู้เกมนี้กันอย่างคร่าว ๆ กันก่อนนะ</h1>
      <br>
      <video width="700" height="400" controls>
      <source src="../assets/teach.mp4" type="video/mp4">
       Your browser does not support the video tag.
      </video>
       <div><button id="nav"><router-link to="/game">NEXT</router-link></button></div>
        <!-- <h1>วิธีการเล่นเกม Hexapawn</h1>
        <h2>วิธีการเดิน</h2>
        <div class="box">
            <img
          id="gif"
          src="../assets/t1.gif"
          alt="t1"
        />
        <p class="box-text"> วิธีการเดินคือให้ ลากแล้วปล่อยลงตำแหน่งที่ต้องการโดยสามารถเดินได้ 2แบบคือ<br>
        <ul style="text-align: left;">
          <li>เดินไปข้างหน้าตรง ๆ</li>
          <li>จะเดินทแยงข้างต่อเมื่อมีหมากของศัตรูให้กิน</li>
          </ul></p>
        </div>
        <h2>รูปแบบการชนะ</h2>
        <div class="box">
            <img
          id="gif"
          src="../assets/win1.gif"
          alt="t1"
        />
        </div>
        <p class="box-win"> ตัวหมากตัวใดตัวหนึ่งของคุณไปถึงอีกด้านของกระดาน </p>
        <div class="box">
            <img
          id="gif"
          src="../assets/win2.gif"
          alt="t1"
        />
        </div>
         <p class="box-win"> คู่ต่อสู้ไม่สามารถเคลื่อนไหวได้อีกต่อไป </p>
        <div class="box">
            <img
          id="gif"
          src="../assets/win3.gif"
          alt="t1"
        />
        </div>
        <p class="box-win"> หรือคุณกินตัวหมากของศัตรูจนหมด </p>
        <div><button id="nav"><router-link to="/game">NEXT</router-link></button></div> -->
    </div>
</template>

<script>
export default {
  name: 'Rules',
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

#gif{
    width: 25%;
    
}
.box{
display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.box-text {
  text-align: left;
  background: #51596c;
  color: white;
  font-size: 20px;
  border-radius: 2px;
  display: inline-block;
  height: 150px;
  margin-left: 1rem;
  margin-top: 0%;
  padding: 20px;
  position: relative;
  width: 350px;
}

.box-win {
  text-align: center;
  background: #51596c;
  color: white;
  font-size: 20px;
  border-radius: 2px;
  display: inline-block;
  
  margin-left: 1rem;
  margin-top: 0%;
  padding: 20px;
  position: relative;
  width: 500px;
}
</style>