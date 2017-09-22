var isTouchSupported = 'ontouchstart' in window;
var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';
var endEvent = isTouchSupported ? 'touchend' : 'mouseup';
window.ontouchstart = function (e) {
    e.preventDefault();
};
console.log(startEvent);
console.log(endEvent);


class Stopwatch {
    constructor(displaySec, displayMilli, results) {
        this.running = false;
        this.displaySec = displaySec;
        this.displayMilli = displayMilli;
        this.results = results;
        this.reset();
        this.print(this.times);
        this.attempt = 0;
        this.attempts = 3;
    }
    reset() {
        this.times = [0, 0, 0];
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    start() {
        console.log("mouse down");
                this.times = [0, 0, 0];
        this.print();
        // 修改点击后的图片背景大小
        document.getElementById("basketballImg").style.width = '110px';
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    stop() {
        console.log("mouse up");
        // 修改点击后的图片背景大小
        document.getElementById("basketballImg").style.width = "100px";
        // 次数加1
        this.attempt++;
        // 修改标签次数
        document.getElementById("leftTimesLabel").innerText = String(3 - this.attempt);
        // 检查次数
        console.log(this.attempt);
        if (!this.checkAttempt()) {
            var labelText = "";
            console.log(typeof Number(this.times[1]));
            if(Number(this.times[1]) < 1) {
                labelText = "出手有些仓促，差了一丢丢！";
                console.log("当前成绩：", labelText);
            }
            if(Number(this.times[1]) == 1 && Math.floor(Number(this.times[2])) > 0) {
                labelText = "比赛都散场了，居然还不出手！";
                console.log("当前成绩：", labelText);
               }
            if(Number(this.times[1]) == 1 && Math.floor(Number(this.times[2])) == 0) {
                labelText = "完美的出手，投中压哨绝杀！你的名字将被记录史册！";   
                console.log("当前成绩：", labelText);
            }
            
            $("#resultLabel").text(labelText);
        } else {
            $("#resultLabel").text("很遗憾，您错失名人堂~");
            $("#basketballCover").hide();
        }
        this.running = false;
        this.time = null;
    }
    clear() {
        clearChildren(this.results);
    }
    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 1000) {
            this.times[1] += 1;
            this.times[2] -= 1000;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }
    print() {
        this.displaySec.innerText = this.formatSeconds(this.times[1]);
        this.displayMilli.innerText = this.formatMilliSeconds(this.times[2].toFixed(3));
    }
    formatSeconds(times) {
        return `${pad0(this.times[1], 2)}`;
    }
    formatMilliSeconds(times) {
        return `:${padMilli0(Math.floor(this.times[2]), 3)}`;
    }
    checkAttempt() {
        return this.attempt >= 3 ? true : false;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count) result = '0' + result;
    return result;
}

function padMilli0(value, count) {
    var result = value.toString();
    if (result === '0') {
        return '000';
    }
    for (; result.length < count; --count) result = '0' + result;
    return result;
}

function clearChildren(node) {
    while (node.lastChild) node.removeChild(node.lastChild);
}
let stopwatch = new Stopwatch(document.querySelector('.second'), document.querySelector('.millisecond'), document.querySelector('.results'));


function addRuleElements(position, basketPosition) {
    $(".overlay").html(`
        <div id="rule-wrapper">
            <div class="row">
                <div class="col-12" style="text-align: center">
                    <h3>《NBA 2K18》活动规则</h3>
                </div>
            </div>
            <div class="row">
                <p>1.距离比赛结束还有1秒，球队仅落后1分，球队的胜利此时掌握在你的手中！</p>
                <p>2.长按屏幕，到达1秒后完美出手，投出制胜的一球吧！</p>
                <p>3.不要怕，时光倒流，你将有三次尝试的机会，来完成惊天逆转吧！</p>
                <p>4.带领队伍反败为胜，你将踏入名人堂，有机会获得丰厚大奖！</p>
            </div>
        </div>
    `);
    
    $("#block").css("left", `${basketPosition.left}px`).css("top", `${basketPosition.top}px`).show();
    $(".tour-hello-hopscotch").hide();
    $(".foot").after(`<img id="hintImg" src="/img/hintword.png" style="width:40%; position: absolute; z-index:999999; left:${position.left+ 40}px; top: ${position.top}px">`);
}

function addDropback() {
     $(".foot").after(`<div class="overlay"></div>`);
}

function showRuleUI(position, basketPosition) {
    addDropback();
    addRuleElements(position, basketPosition);
}

function clearDropback() {
    $("#rule-wrapper").remove();
    $(".overlay").remove();
    $("#hintImg").remove();
}


window.onload = function(){
    $(".helper").remove();
    var position = $(".tour-hello-hopscotch").position();
    var basketPosition = $("#basketballImg").position();
    addRuleElements(position, basketPosition);
    
    var basketballCover = $("#block").after($("#block").clone());
    basketballCover.attr("id","basketballCover").css("z-index",99999).attr("onTouchStart", "stopwatch.start();").attr("onTouchEnd", "stopwatch.stop();").attr("onMouseDown", "stopwatch.start();").attr("onMouseUp", "stopwatch.stop();").hide();
    
    $("#fameBtn").on("touchstart",function () {
        alert("显示名人堂");
    });
    $("#ruleBtn").on("touchstart",function () {
        basketballCover.hide();
        showRuleUI(position, basketPosition);
    });
    
    // 规则说明界面的篮球cover
    $("body").on('touchend', "#block", function() {
        clearDropback();
        console.log("已尝试次数：" + stopwatch.attempt);
        if(stopwatch.attempt < 3) {
            $(this).hide();             
        }
        basketballCover.show();
    });

};
