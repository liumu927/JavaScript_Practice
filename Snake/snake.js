// 获取DOM对象
var tss_dom = document.querySelectorAll(".snack-timi div");
var s_head_dom = document.querySelector(".snack-timi .s-head");
var s_timi_dom = document.querySelector(".snack-timi");
var s_score_dom = document.querySelector(".score .s-score");
var min_dom = document.querySelector(".duration .min");
var sec_dom = document.querySelector(".duration .sec");

// 贪吃蛇身体数据，最后一个数据是蛇头
var tss_arr = [
  { left: 0, top: 0 },
  { left: 0, top: 0 },
];
// e.keycode弃用后，实现keycode与code的对应
var DIR = {
  DIR_LEFT: 37,
  DIR_TOP: 38,
  DIR_RIGHT: 39,
  DIR_BOTTOM: 40,
};
// 蛇头的left值属性数据
var tss_head = { left: 0, top: 0 };
// 贪吃蛇的运动方向变量：默认蛇向右移动
var tss_turn = DIR.DIR_RIGHT;
// 定义运动方向的对象
var tss_controller = {
  // 左
  37: {
    left: -20,
    top: 0,
    class: "left",
  },
  // 上
  38: {
    left: 0,
    top: -20,
    class: "top",
  },
  // 右
  39: {
    left: 20,
    top: 0,
    class: "right",
  },
  // 下
  40: {
    left: 0,
    top: 20,
    class: "bottom",
  },
};
// 蛇蛋数据结构
var egg = {
  left: 0,
  top: 0,
  class: "random-egg",
  dom: document.createElement("span"),
};
// 得分
var score = 0;
// 计时，秒数
var time = 0;

// 贪吃蛇运动函数
function move() {
  // 吃蛋检测
  eggDetection(tss_head);

  // 设置可见
  s_timi_dom.style.opacity = 1;

  // 递增蛇头位置
  tss_head.left += tss_controller[tss_turn].left;
  tss_head.top += tss_controller[tss_turn].top;

  // 更改蛇头朝向
  s_head_dom.classList.remove("left", "top", "right", "bottom");
  s_head_dom.classList.add(tss_controller[tss_turn].class);

  // 给蛇头赋值
  tss_arr[tss_arr.length - 1] = tss_head;

  // 反转数组，此时克隆了一个新数组
  var tss_arr_reverce = tss_arr.slice().reverse();

  // 规则：碰撞检测，如蛇头咬到身体时
  collisionDetection(tss_arr_reverce);

  // 给dom的样式赋值
  for (var i = 0; i < tss_dom.length; i++) {
    tss_dom[i].style.left = tss_arr_reverce[i].left + "px";
    tss_dom[i].style.top = tss_arr_reverce[i].top + "px";
  }

  // 给蛇身赋值，不遍历蛇头
  for (var i = 0; i < tss_arr.length - 1; i++) {
    tss_arr[i].left = tss_arr[i + 1].left;
    tss_arr[i].top = tss_arr[i + 1].top;
  }
}

// 碰撞检测函数
function collisionDetection(arr) {
  // console.log(arr);

  // 1. 判断头和每一个身体是否在相同位置，是则终止游戏
  let head = arr[0];
  let body = arr.slice(1);

  for (var i = 0; i < body.length; i++) {
    if (head.left === body[i].left && head.top === body[i].top) {
      gameOver();
    }
  }

  // 2. 判断是否撞墙，是则终止游戏
  if (head.left === 0 || head.left > 780 || head.top < 0 || head.top > 580) {
    gameOver();
  }
}

// 蛇蛋位置
function createRandomEgg() {
  egg.left = parseInt(Math.random() * 40) * 20;
  egg.top = parseInt(Math.random() * 30) * 20;

  // 给蛇蛋的dom对象赋值
  egg.dom.classList.add(egg.class);
  egg.dom.style.left = egg.left + "px";
  egg.dom.style.top = egg.top + "px";

  // 将蛇蛋渲染在页面上
  s_timi_dom.appendChild(egg.dom);
}

// 吃蛋检测
function eggDetection(head) {
  // 1. 是否吃到蛋
  if (head.left === egg.left && head.top === egg.top) {
    // 移除旧的蛋：不需要这个操作，因为appendChild不会重复渲染dom
    // egg.dom.classList.remove(egg.class);

    // console.log("吃蛋了！");

    // 记录得分
    writeScores();

    // 创建新的蛋
    createRandomEgg();

    // 2.添加蛇身体
    createSnakeBody();
  }
}

// 加长蛇身体
function createSnakeBody() {
  // 创建dom结构并放到页面中
  let body = document.createElement("div");
  body.classList.add("s-body");
  s_timi_dom.appendChild(body);

  // 解决元素“跳闪”问题
  body.style.display = "none";
  setTimeout(() => {
    body.style.display = "block";
  }, 500);

  // 更新整体选中的 dom
  tss_dom = document.querySelectorAll(".snack-timi div");

  // 将结构添加到蛇尾，即放入 tss_arr 中
  tss_arr.unshift({ left: 0, top: 0 });

  console.log(tss_arr);
}

// 得分
function writeScores() {
  // 得分加1
  score++;

  s_score_dom.innerHTML = score;
}

// 计时
function timeMeter() {
  time++;

  // 补零操作
  let min = parseInt(time / 60);
  if (min < 10) {
    min_dom.innerHTML = "0" + min;
  } else {
    min_dom.innerHTML = min;
  }

  let sec = parseInt(time % 60);
  if (sec < 10) {
    sec_dom.innerHTML = "0" + sec;
  } else {
    sec_dom.innerHTML = sec;
  }
}
var timeMeterInterval = setInterval(timeMeter, 1000);

// 结束游戏
function gameOver() {
  console.log("游戏结束！");
  clearInterval(moveInterval);
  clearInterval(timeMeterInterval);
}

// 贪吃蛇控制器
document.onkeyup = function (e) {
  switch (e.code) {
    case "ArrowLeft":
      // 规则：不许当行掉头，如，向右运动时，按下向左键，不予执行
      if (tss_turn === DIR.DIR_RIGHT) break;
      else tss_turn = DIR.DIR_LEFT;
      break;
    case "ArrowUp":
      if (tss_turn === DIR.DIR_BOTTOM) break;
      else tss_turn = DIR.DIR_TOP;
      break;
    case "ArrowRight":
      if (tss_turn === DIR.DIR_LEFT) break;
      else tss_turn = DIR.DIR_RIGHT;
      break;
    case "ArrowDown":
      if (tss_turn === DIR.DIR_TOP) break;
      else tss_turn = DIR.DIR_BOTTOM;
      break;
  }
};

createRandomEgg();
var moveInterval = setInterval(move, 200);
