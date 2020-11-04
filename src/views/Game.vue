<template>
  <div id="game">
    <!-- <h1>The Sweet Learning Computer</h1> -->
     <button class="move" v-if="active == 1 && bot_lose == false && displayWin == 0" style="font-size : 35px">
          ตา
          <img
            src="../assets/human.svg"
            alt="human"
            width="25%"
          />
          เดิน
        </button>
        <button class="move" v-if="active == 2 && Doit == true"> 
          ตา
          <img
            src="../assets/robot.svg"
            alt="robot"
            width="5%"
          />
          เดิน โดยคลิกรูปแบบการเดินด้านขวาที่ตรงกับปัจจุบันเพื่อสุ่มสีลูกศร
        </button>
        <button class="move" v-if="active == 2 && Doit == false">
          ตา
          <img
            src="../assets/robot.svg"
            alt="robot"
            width="10%"
          />
          เดิน ตามทางสีลูกศรที่สุ่มได้
          </button>
          <button v-if="displayWin == 1" class="move">
            <img
            src="../assets/human.svg"
            alt="robot"
            width="25%"
          />
          ชนะ
        </button>
        <button v-if="displayWin == 2" class="move">
          <img
            src="../assets/robot.svg"
            alt="robot"
            width="30%"
          />
          ชนะ
        </button>
    <div id="main-view">
      <div id="main-game">
        <h3 class="left-text"></h3>
        <button v-if="displayWin == 1" class="win" @click="restart">
          <p>เล่นอีกครั้ง</p>
        </button>
        <button v-if="displayWin == 2" class="win" @click="restart">
          <p>เล่นอีกครั้ง</p>
        </button>
        <DraggableChess
          :state="this.state"
          :Model="computerModel"
          v-bind:Doit="Doit"
          @new-state="handleNewState"
        />
        <h4 class="left-text">คะแนน</h4>
        <div class="points">
          <div>
            <div class="points-svg-container">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <image
                  width="50"
                  height="50"
                  xlink:href="../assets/human.svg"
                />
                <image
                  width="15"
                  height="15"
                  xlink:href="../assets/circle_blue.svg"
                />
              </svg>
            </div>
            <div style="width: 50px; margin: 0 auto;">{{ winsPlayer }}</div>
          </div>
          <div>
            <div class="points-svg-container">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <image
                  id="robot"
                  width="50"
                  height="50"
                  xlink:href="../assets/robot.svg"
                />
                <image
                  width="15"
                  height="15"
                  xlink:href="../assets/circle_grey.svg"
                />
              </svg>
            </div>
            <div style="width: 50px; margin: 0 auto;">{{ winsPC }}</div>
          </div>    
        </div>
      </div>
      <div id="main-rules">
        <div class="row">
          <h4>รูปแบบการเดินของเจ้าหุ่นยนต์</h4>
        </div>

        <div class="rulesets">
          <div
            v-for="(model, index) in computerModel.getModel()"
            :key="index"
            class="ruleset"
            v-bind:class="{ outlinerule: !Doit && compareStates(model.state, state) }"
          >
            <PossibleActions
              v-if="!filter || checkIfStateIsContained(filteredStates, model.state) && active == 2"
              v-bind:state="model.state"
              v-bind:actions="model.actions"
              v-bind:sweets="model.sweets"
              v-bind:forceUpdate="forceUpdate"
              v-bind:currentState="compareStates(model.state, state)"
              v-bind:chosenPlayType="chosenPlayType"
              v-bind:Doit="Doit"
              v-bind:blink="blink"
              @update_lastmove="updateLastMove"
              @check_beforemove="checkBeforeMove"
            />
          </div>
        </div>
        <div class="row">
          <h4>รูปแบบการเดินที่ เจ้าหุ่นยนต์ ใช้เดิน</h4>
        </div>

        <div class="rulesets">
          <div
            v-for="(model, index) in lastMove"
            :key="index"
            class="ruleset"
            v-bind:class="{ outlinerule: index == lastMove.length-1 && bot_lose }"
          >
          <!-- รูปแบบการเดินที่ถูกเลือก -->
            <PossibleActions
            
              v-bind:state="model.state"
              v-bind:actions="model.actions"
              v-bind:sweets="model.sweets"
              v-bind:forceUpdate="model.forceUpdate"
              v-bind:currentState="model.currentState"
              v-bind:chosenPlayType="model.chosenPlayType"
              :Doit="Show_hist"
              :blink="false"
            />
          </div>
        </div>
        <button class="move" v-if="bot_lose">
            <img
            src="../assets/robot.svg"
            alt="robot"
            width="7%"
          />
            เจ้าหุ่นยนต์แพ้จึงต้องลบการเดินล่าสุดที่ทำให้แพ้ออก
          </button>
      </div>
    </div>
    <Tour />
    <!-- <div class="blink_me"></div> -->
    <div class="small">

          <h1>สถิติการแข่ง</h1>

      <line-chart :chart-data="datacollection" :options="op"></line-chart>
    </div>
  </div>
</template>

<script>
const resetToState = [1, 1, 1, 0, 0, 0, 2, 2, 2];
import DraggableChess from "../components/DraggableChess.vue";
import PossibleActions from "../components/PossibleActions.vue";
import Tour from "../components/Tour.vue";
import LineChart from '../utils/LineChart'
import {
  performMove,
  checkIfPlayerWins,
  compareStates,
  checkIfStateIsContained,
  calculatePossibleMoves,
} from "../utils/moves.js";
import LearningModel from "../utils/model.js";

export default {
  name: "Game",
  components: {
    DraggableChess,
    PossibleActions,
    Tour,
    LineChart,
  },
  data: function() {
    return {
      state: [...resetToState],
      player: 1,
      computer: 2,
      active: 1,
      winsPlayer: 0,
      winsPC: 0,
      computerModel: new LearningModel([...resetToState]),
      forceUpdate: 1,
      timeForPC: 3000,
      displayWin: 0,
      chosenPlayType: -1,
      filteredStates: [],
      // รูปแบบที่เป็นไปได้เท่านั่น
      filter: true,
      lastMove : [],
      bot_lose : false,
      lose_text : "",
      Doit : true,
      datacollection: null,
      op:{
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'จำนวนครั้งที่เล่น'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'แต้มที่ได้'
          }
        }]
      }
    },
      humandata:[],
      botdata:[],
      turn:[],
      t:1,
      move:true,
      blink:true,
      
    };
  },
  methods: {
    compareStates,
    checkIfStateIsContained,
    restart() {
      const self = this;
      self.displayWin = 0;
      self.state = [...resetToState];
      self.updateSelection();
      this.lastMove = [];
      this.bot_lose = false;
      this.lose_text = ""
      this.Doit = true;
      this.move = true;
      this.blink = true;
    },
    checkWinner: function(newState, who) {
      if (checkIfPlayerWins(newState, who)) {
        const self = this;
        if (who === this.player) {
          this.displayWin = 1;
          self.winsPlayer++;
          console.log(this.humandata,'humandata')

        } else {
          this.displayWin = 2;
          self.winsPC++;
          console.log(this.botdata,'botdata')
        }
        this.t = this.t + 1;
        this.turn.push(this.t);
        this.humandata.push(this.winsPlayer);
        this.botdata.push(this.winsPC);
        this.fillData();
        return true;
      }
      return false;
    },
    updateSelection: function() {
      let relevantStates = [];
      const moves = calculatePossibleMoves(this.state, this.player);
      for (let index in moves) {
        relevantStates.push(performMove([...this.state], moves[index]));
      }
      this.filteredStates = relevantStates;
    },
    updateLastMove: function(thisObject) {
      console.log("updateLastMove")
      if(this.move == true){
        this.move = false;
      }
      let self = this;
      setTimeout(this.blinkFunc, 3000);
      setTimeout(function(){self.lastMove.push(thisObject)}, 3000);
      console.log(this.lastMove,"this is lastMove")
    },
    blinkFunc(){
      this.blink = false;
      console.log(this.blink,"this.blink")
    },
    checkBeforeMove: function() {
      this.Doit = false;
      console.log(this.Doit,"this.Doit")
    },
    handleNewState: function(newState) {
      this.$forceUpdate();
      console.log(this.active);
      if (this.active == 2) {
        this.move = true;
        this.blink = true;
        console.log(this.move,"bot move");
        this.chosenPlayType = -1;
        this.state = newState;
        this.updateSelection();
        if (this.checkWinner(newState, this.computer)) {
          console.log("wow bot win!!!!!");
          this.computerModel.computerWon();
          this.forceUpdate++;
          const self = this;
          
     
        } else if (this.checkWinner(newState, this.player)) {
          console.log("human won!!!");
          this.computerModel.humanWon();
          this.forceUpdate++;
          const self = this;
          this.bot_lose = true;
        }
      }
      if (this.active == 1) {
        console.log("human move");
        this.Doit = true;
        if (this.checkWinner(newState, this.player)) {
          console.log("human won!!!");
          this.computerModel.humanWon();
          this.forceUpdate++;
          const self = this;
           this.bot_lose = true;

        } else if (this.checkWinner(newState, this.computer)) {
          console.log("wow bot win!!!!!");
          this.computerModel.computerWon();
          this.forceUpdate++;
          const self = this;

        }

        // ท่อนหลังจากนี้ จะเป็นการจัดเก็บว่าบอทจะเดินอย่างไรต่อไป
        const [move, sweetChosen] = this.computerModel.choosePlayType(
          this.state
        );
        // console.log("move and sweetchosen", [move, sweetChosen])
        if (move === undefined) {
          this.computerModel.humanWon();
          this.forceUpdate++;
          this.winsPlayer++;

          const self = this;

          setTimeout(function() {
            self.state = [...resetToState];
            self.updateSelection();
          }, self.timeForPC * 1.5);
        } else {
          this.chosenPlayType = sweetChosen;
        }
      }
      this.active = this.active == this.player ? this.computer : this.player;
    },
    fillData () {
        this.datacollection = {
          labels: this.turn,
          datasets: [
            {
              label: 'หน้ายิ้ม',
              borderColor: '#56a8c9',
              backgroundColor:'#fff',
              borderWidth: 5,
              data:this.humandata,
            }, {
              label: 'เจ้าหุ่นยนต์',
              borderColor: '#a0a0a0',
              backgroundColor:'#fff',
              borderWidth: 5,
              data:this.botdata,
            }
          ]
        }
      },
  },
  mounted: function() {
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    if (params.get("time")) {
      this.timeForPC = params.get("time");
    }
    this.updateSelection();
    this.fillData();
    this.turn.push(this.t);

  },
};
</script>

<style scoped>
.blink_me {
   width: 100px;
  height: 100px;
  background-color: red;
  animation-name: blinker;
  animation-duration: 10s;
}

@keyframes blinker {
  from {background-color: red;}
  to {background-color: yellow;}
}

#game {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}

@media (min-width: 800px) {
  #main-view {
    display: grid;
    justify-content: center;
    grid-template-columns: 40% 60%;
  }
  #main-game {
    margin-left: 10%;
    margin-right: 10%;
  }

  .rulesets {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (max-width: 800px) {
  #main-game {
    display: inline-grid;
    justify-content: center;
  }
  .rulesets {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.left-text {
  text-align: left;
  margin: 10px;
}

h3{
  font-size: 35px;
}

.outlinerule {
  background-color: #ff450057;
}

.points {
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 50px;
}

.points > div {
  width: 75%;
}

.move{
  text-align: center;
  background-color: #fdf678;
  border: #fdf678;
  font-size: 30px;
  padding: 10px;
  margin: 10px;
}

.win {
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  background-color: #92d14f;
  border: black;
  margin-left: 11vw;
  margin-right: 11vw;
  margin-bottom: 3px;
  padding: 5px;
}

.win > svg {
  display: block;
  margin: 5px;
}

.win > p {
  font-size: 24px;
  font-weight: bold;
}

.points-svg-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.points-svg-container > svg {
  margin: 0 auto;
  display: block;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.limit-options-btn {
  margin-top: 0.5em;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 1em;
}

.small {
    max-width: 600px;
    margin:  50px auto;
  }
</style>
