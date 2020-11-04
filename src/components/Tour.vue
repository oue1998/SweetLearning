<template id="tour">
  <v-tour name="myTour" :steps="steps" :options="myOptions"></v-tour>
</template>

<script>
export default {
  name: "Tour",
  data() {
    return {
      myOptions: {
        useKeyboardNavigation: false,
        labels: {
          buttonSkip: "ข้าม",
          buttonPrevious: "ย้อนกลับ",
          buttonNext: "ถัดไป",
          buttonStop: "เสร็จสิ้น"
        }
      },
      steps: [
        {
          target: "#main-game>h3", // We're using document.querySelector() under the hood
          content: `<strong>หน้ายิ้ม!</strong> เป็นฝ่ายเริ่มก่อน
          โดยให้เดินลงมาข้างล่าง และสามารถคิดการเดินได้เองโดยต้องอยู่ในกฎของเกม`,
          params: {
            placement: "right"
          }
        },
        //#robot
        {
          target: "#main-game>h3",
          content: `ส่วน <strong>เจ้าหุ่นยนต์</strong> ให้เดินขึ้นด้านบน
          แต่ไม่สามารถเลือกการเดินเองได้`,
          params: {
            placement: "bottom"
          }
        },
        {
          target: "#main-rules>div>h4",
          content:`<strong>เจ้าหุ่นยนต์</strong> ต้องค้นหารูปแบบการเดินด้านขวามือที่หน้าตาเหมือนหน้าตากระดานในปัจจุบัน
          และคลิกเพื่อสุ่มสีออกมา <strong>ใช้เดินตาม</strong>`,
          params: {
            placement: "right"
          }
        },
        {
          target: "#main-rules>div>h4",
          content:
            "และถ้าการเดินแบบไหนที่ทำให้ <strong>เจ้าหุ่นยนต์</strong> แพ้ การเดินแบบนั้นจะถูกกำจัดทิ้งเพื่อจะได้ไม่ทำแบบเดิมอีก!",
          params: {
            placement: "bottom"
          }
        }
      ],
    };
  },
  mounted: function() {
    this.$tours["myTour"].start();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
