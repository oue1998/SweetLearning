<template>
  <div id="game">
    <h1>The Sweet Learning Computer</h1>

    <div id="main-view">
      <div id="main-game">
        <h3 class="left-text">
          <img
            v-if="active == 1"
            src="../assets/human.svg"
            alt="human"
            width="15%"
          />
          <img
            v-if="active == 2"
            src="../assets/robot.svg"
            alt="human"
            width="15%"
          />
          เดิน
        </h3>
        <button v-if="displayWin == 1" class="win" @click="restart">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <image width="50" height="50" xlink:href="../assets/human.svg" />
          </svg>
          <p>ชนะ / เล่นอีกครั้ง</p>
        </button>
        <button v-if="displayWin == 2" class="win" @click="restart">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <image
              id="robot"
              width="50"
              height="50"
              xlink:href="../assets/robot.svg"
            />
          </svg>
          <p>ชนะ / เล่นอีกครั้ง</p>
        </button>
        <DraggableChess
          :state="this.state"
          :Model="computerModel"
          v-bind:Doit="Doit"
          @new-state="handleNewState"
        />
        <!-- <button class="re" v-if="displayWin > 0" @click="restart">RESTART</button> -->
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
            <!-- <div v-if="displayWin == 1" style="float: right; color: green;">
              +1
            </div> -->
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
            <!-- <div v-if="displayWin == 2" style="float: right; color: red;">
              +1
            </div> -->
            <div style="width: 50px; margin: 0 auto;">{{ winsPC }}</div>
          </div>    
        </div>
      </div>
      <!-- Da meistens 16:9 Monitore verwendet werden, sollte das vermutlich rechts vom Spielfeld angezeigt werden -->
      <div id="main-rules">
        <div class="row">
          <h4 class="left-text">รูปแบบการเดินของเจ้าหุ่นยนต์</h4>
          <!-- Rounded switch -->
        </div>

        <div class="rulesets">
          <div
            v-for="(model, index) in computerModel.getModel()"
            :key="index"
            class="ruleset"
            v-bind:class="{ outlinerule: !Doit && compareStates(model.state, state) }"
          >
            <PossibleActions
              v-if="
                !filter || checkIfStateIsContained(filteredStates, model.state)
              "
              v-bind:state="model.state"
              v-bind:actions="model.actions"
              v-bind:sweets="model.sweets"
              v-bind:forceUpdate="forceUpdate"
              v-bind:currentState="compareStates(model.state, state)"
              v-bind:chosenPlayType="chosenPlayType"
              v-bind:Doit="Doit"
              @update_lastmove="updateLastMove"
              @check_beforemove="checkBeforeMove"
            />
          </div>
        </div>

        
        <div class="row">
          <br>
          <h4 class="left-text">รูปแบบการเดินที่ เจ้าหุ่นยนต์ ใช้เดิน</h4>
          <!-- Rounded switch -->
        </div>

        <div class="rulesets">
          <div
            v-for="(model, index) in lastMove"
            :key="index"
            class="ruleset"
            v-bind:class="{ outlinerule: index == lastMove.length-1 && bot_lose }"
          >
            <PossibleActions
              v-bind:state="model.state"
              v-bind:actions="model.actions"
              v-bind:sweets="model.sweets"
              v-bind:forceUpdate="model.forceUpdate"
              v-bind:currentState="model.currentState"
              v-bind:chosenPlayType="model.chosenPlayType"
              :Doit="false"
            />
          </div>
          <div
            v-if="bot_lose"
          >
            <!-- {{lose_text}} -->
            <h4>เจ้าหุ่นยนต์แพ้จึงต้องลบการเดินล่าสุดที่ทำให้แพ้ออก</h4>
          </div>
        </div>
      </div>

      
    </div>
    <Tour />
    <!-- <div class="blink_me"></div> -->
  </div>
</template>

<script>
const resetToState = [1, 1, 1, 0, 0, 0, 2, 2, 2];
import DraggableChess from "../components/DraggableChess.vue";
import PossibleActions from "../components/PossibleActions.vue";
import Tour from "../components/Tour.vue";
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
    },
    checkWinner: function(newState, who) {
      if (checkIfPlayerWins(newState, who)) {
        const self = this;

        if (who === this.player) {
          this.displayWin = 1;
          // setTimeout(function() {
            // self.displayWin = 0;
            self.winsPlayer++;
          // }, this.timeForPC / 2);
        } else {
          this.displayWin = 2;
          // setTimeout(function() {
            // self.displayWin = 0;
            self.winsPC++;
          // }, this.timeForPC / 2);
        }
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
      this.lastMove.push(thisObject);
      console.log(this.lastMove,"this is lastMove")
    },
    checkBeforeMove: function() {
      this.Doit = false;
    },
    handleNewState: function(newState) {
      this.$forceUpdate();
      console.log(this.active);
      if (this.active == 2) {
        console.log("bot move");
        this.chosenPlayType = -1;
        this.state = newState;
        this.updateSelection();
        if (this.checkWinner(newState, this.computer)) {
          console.log("wow bot win!!!!!");
          this.computerModel.computerWon();
          this.forceUpdate++;
          const self = this;
          
     
          // setTimeout(function() {
          //   self.state = [...resetToState];
          //   self.updateSelection();
          // }, this.timeForPC / 2);
        } else if (this.checkWinner(newState, this.player)) {
          console.log("human won!!!");
          this.computerModel.humanWon();
          this.forceUpdate++;
          const self = this;

           this.bot_lose = true;
           this.lose_text = "ผมแพ้แล้ว จะลบละนะ"
          // setTimeout(function() {
          //   self.state = [...resetToState];
          //   self.updateSelection();
          // }, this.timeForPC / 2);
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
           this.lose_text = "ผมแพ้แล้ว จะลบละนะ"
          // setTimeout(function() {
          //   self.state = [...resetToState];
          //   self.updateSelection();
          // }, this.timeForPC / 2);
        } else if (this.checkWinner(newState, this.computer)) {
          console.log("wow bot win!!!!!");
          this.computerModel.computerWon();
          this.forceUpdate++;
          const self = this;
          // setTimeout(function() {
          //   self.state = [...resetToState];
          //   self.updateSelection();
          // }, this.timeForPC / 2);
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
  },
  mounted: function() {
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    if (params.get("time")) {
      this.timeForPC = params.get("time");
    }
    this.updateSelection();
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

.win {
  display: flex;
  align-items: center;
  width: 46vh;
  height: 70px;
  background-color: #92d14f;
  border: black;
  margin-left: 13vh;
  margin-bottom: 5px;
}

.win > svg {
  display: block;
  margin: 5px;
}

.win > p {
  font-size: 28px;
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
</style>
