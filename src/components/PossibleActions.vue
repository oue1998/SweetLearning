<template id="chessground">
<div @click="choose">
  <div class="actions-field">
    <Chess
      v-bind:state="state"
      v-bind:dimension="dimension"
      v-bind:actions="actions"
    />
    <div class="actions-rating">
      <svg :width="dimension" :height="dimension">
        <g v-for="(sweet, index) in sweets" :key="index">
          <g v-for="i in sweet" :key="i">
            <defs> 
              <marker
                id="arrow-red"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,4 L5,2 z" fill="#f00" />
              </marker>
              <marker
                id="arrow-green"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,4 L5,2 z" fill="#008000" />
              </marker>
              <marker
                id="arrow-blue"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,4 L5,2 z" fill="#00f" />
              </marker>
              <marker
                id="arrow-yellow"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,4 L5,2 z" fill="#ffa500" />
              </marker>
              <marker
                id="arrow-purple"
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,4 L5,2 z" fill="#80f" />
              </marker>
            </defs>
            <!-- <line
              v-if="!Doit? ((currentState == false) || (currentState && index == chosenPlayType)):true"
                :x1="dimension/4 * index + 10"
                :y1="70"
                :x2="dimension/4 * index + 10"
                :y2="40"
                :stroke="colors[index].hex"
                stroke-width="4"
                :marker-end="colors[index].name"
              /> -->
              <line
              v-if="!Doit? ((currentState == false)):true"
                :x1="dimension/4 * index + 10"
                :y1="70"
                :x2="dimension/4 * index + 10"
                :y2="40"
                :stroke="colors[index].hex"
                stroke-width="4"
                :marker-end="colors[index].name"
              />
              <line class="blink_me"
              v-if="(Doit == false) && (blink == true)"
                :x1="dimension/4 * index + 10"
                :y1="70"
                :x2="dimension/4 * index + 10"
                :y2="40"
                :stroke="colors[index].hex"
                stroke-width="4"
                :marker-end="colors[index].name"
              />
              <line 
              v-if="(currentState && index == chosenPlayType) && (blink == false)"
                :x1="dimension/4 * index + 10"
                :y1="70"
                :x2="dimension/4 * index + 10"
                :y2="40"
                :stroke="colors[index].hex"
                stroke-width="4"
                :marker-end="colors[index].name"
              />
              <!-- <line
              v-if="!Doit? ((currentState == false) ||(currentState && index == chosenPlayType)):false"
                :x1="dimension/4 * index + 10"
                :y1="70"
                :x2="dimension/4 * index + 10"
                :y2="40"
                :stroke="colors[index].hex"
                stroke-width="4"
                :marker-end="colors[index].name"
              /> -->

              <!-- v-if="currentState && index != chosenPlayType" -->
            <!-- dur="0.3s" -->
            <!-- <animateMotion
              v-if="((Doit == false) && (currentState && index == chosenPlayType))"
              path="M 0 0 V -10 V -20 Z"
              begin="0s"
              dur="0.3s"
              repeatCount="indefinite"
            /> -->
            <!-- <animateMotion
              v-if="((currentState && index == chosenPlayType))"
              path="M 0 0 V -10 V -20 Z"
              begin="0s"
              dur="0.3s"
              repeatCount="indefinite"
            /> -->
          </g>
        </g>
      </svg>
    </div>
    <div style="display:none;">{{ forceUpdate }}</div>
    <!-- <div class="pass"></div> -->
    </div>
    </div>
</template>

<script>
import Chess from "./chess.vue";
export default {
  name: "PossibleActions",
  components: {
    Chess,
  },
  props: {
    state: Array,
    actions: Array,
    sweets: Array,
    forceUpdate: Number,
    currentState: Boolean,
    chosenPlayType: Number,
    Doit: Boolean,
    blink: Boolean,
  },
  data: function() {
    return {
      colors: [
        { name: "url(#arrow-blue)", hex: "#00f", fill: "blue" },
        { name: "url(#arrow-red)", hex: "#f00", fill: "red" },
        { name: "url(#arrow-green)", hex: "#008000", fill: "green" },
        { name: "url(#arrow-yellow)", hex: "#ffa500", fill: "orange" },
        { name: "url(#arrow-purple)", hex: "#80f", fill: "purple" },
      ],
      dimension: 90,
      currentSweets: this.sweets,
      forceUpdateHelper: 1,
      
    };
  },
  watch: {
    forceUpdate: function(newVal, oldVal) {
      this.forceUpdateHelper = newVal;
    },
    chosenPlayType: function(newVal, oldVal) {
    },
  },
  methods: {
    choose () {
      if(this.currentState == true){
        this.$emit("check_beforemove");
        const selfObject = this;
        this.sweets.forEach(function(sweet,index){
          if((selfObject.currentState && index == selfObject.chosenPlayType)){
            console.log("selfObject.currentState",selfObject.currentState)
            console.log("selfObject.chosenPlayType",selfObject.chosenPlayType)
            console.log(sweet,index)
            selfObject.$emit("update_lastmove",selfObject);
          }
        })
      }
    },


  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pass{
border: solid;
animation-name:myfirst;
animation-duration:3s;
animation-delay:0s;
animation-iteration-count:2;
animation-play-state:running;

}

@keyframes myfirst
{0%   {border-color:blue;}
25%  {border-color:red;}
50%  {border-color:green;}
75%  {border-color:orange;}
100%  {border-color:purple;}}

.blink_me {
  animation: blinker 1s linear 5;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

/* .box {
  background: #ffffff;
  transition-property: background;
  transition-duration: 0.3s;
  transition-timing-function: linear;
}
.box:hover {
  background: #ff450057;
} */

.actions-field {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-auto-rows: 1fr;
  padding: 0.2em;
  border: 1px solid lightgray;
}
</style>
