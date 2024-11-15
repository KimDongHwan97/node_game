import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.att = 20;
    this.currenthp = this.hp;
  }

  async ability(stage){
    const addhp = Math.floor(Math.random() * this.hp);
    this.currenthp += addhp;
    const addatt = 20;
    this.att += addatt;
  }

  attack() {
    return Math.floor(Math.random() * this.att);
    // 플레이어의 공격
  }
}



class Monster {
  constructor() {
    this.hp = 100;
    this.att = 10;
    this.currenthp = this.hp;
  }
  
  ability(stage){
    this.currenthp += (stage - 1)* 10;
    this.att += (stage - 1)* 5;
  }

  attack() {
    return Math.floor(Math.random() * this.att);
    // 몬스터의 공격
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 관우 정보 : 체력 - ${player.currenthp}`, // 지금 체력으로 바꾸기
      `| 공격력 - ${player.att}`
    ) +
    chalk.redBright(
     `| 적장수 정보 : 체력 - ${monster.currenthp}|`,
     `| 공격력 - ${monster.att}`
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while(player.currenthp > 0 && monster.currenthp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속공격한다 3. 아무것도 하지않는다.`,
      ),
    );

    function battleInput() {
     const choice = readlineSync.question('당신의 선택은? ');
     
      switch (choice) {
       case '1':
         logs.push(chalk.yellow(`${choice}를 선택하셨습니다.`));
         const attP = player.attack(); 
         const attM = monster.attack();
         monster.currenthp -= attP;
          if(monster.currenthp > 0){
           player.currenthp -= attM;
           }else{
           break;
           }
         
         
        
         logs.push(chalk.blue(`관우가 적장수를 공격했습니다.`));
         logs.push(chalk.green(`적장수 체력${monster.currenthp}`));
         logs.push(chalk.blue(`적장수가 관우를 공격했습니다.`));
         logs.push(chalk.green(`관우 체력${player.currenthp}`));
         break;

       case '2':
        const doubleAtt = Math.floor(Math.random()*101)
        // 0~101 0~100.999999
        logs.push(chalk.yellow(`${choice}를 선택하셨습니다.`));
         if(doubleAtt <= 40){             
         const attP2 = player.attack(); 
         const attM2 = monster.attack();
         monster.currenthp -= (attP2*2);        
         if(monster.currenthp > 0){
          player.currenthp -= attM2;
          }else{
          break;
          }
       
         logs.push(chalk.blue(`관우가 적장수를 연속공격했습니다.`));
         logs.push(chalk.green(`적장수 체력${monster.currenthp}`));
         logs.push(chalk.blue(`적장수가 관우를 공격했습니다.`));
         logs.push(chalk.green(`관우 체력${player.currenthp}`));
         }else{
         const attM2 = monster.attack();
         player.currenthp -= attM2;
         logs.push(chalk.blue(`적장수가 관우를 공격했습니다.`));
         logs.push(chalk.green(`관우 체력${player.currenthp}`));
         }
         break;  
      
       case '3':
        const attM3 = monster.attack();
        player.currenthp -= attM3;

         logs.push(chalk.yellow(`${choice}를 선택하셨습니다.`));
         logs.push(chalk.blue(`아무것도 하지않았습니다.`));
         logs.push(chalk.blue(`적장수가 관우를 공격했습니다.`));
         logs.push(chalk.green(`관우 체력${player.currenthp}`));
         break;
         
       default:
         logs.push(chalk.yellow('올바른 선택을 하세요.')); 
      }
    //  monster.currenthp -= player.att;
    //  player.currenthp -= monster.att;

    

    // 플레이어의 선택에 따라 다음 행동 처리
    // logs.push(chalk.yellow(`${choice}를 선택하셨습니다.`));
    // logs.push(chalk.green(`플레이어 체력:${player.currenthp}`,`몬스터 체력:${monster.currenthp}`));
    // logs.push(chalk.blue(`플레이어가 몬스터를 공격했습니다.`));
    // logs.push(chalk.green(`몬스터 체력${monster.currenthp}`));
    // logs.push(chalk.blue(`몬스터가 플레이어를 공격했습니다.`));
    // logs.push(chalk.green(`플레이어 체력${player.currenthp}`));
    
    }
    battleInput();   
  }
  

  if(player.currenthp< 0){
    console.log(chalk.red("관우가 죽었습니다. 게임을 종료합니다."),);
    process.exit();
  }else{
    console.log(chalk.blue("적장수를 물리쳤습니다!"),);
  }
};



export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    monster.ability(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건

    stage++;
    player.ability(stage);  
    // 말 그대로 프라미스가 처리될 때까지 함수 실행을 기다리게 만듭니다. 프라미스가 처리되면 그 결과와 함께 실행이 재개

  }

  console.log(chalk.yellow(`모든스테이지를 완료했습니다.`),);
};