/**
 * Created by Admin on 2017/7/19.
 */
var gesture_img_list = ["stop.png", "stop.png", "test.jpg"];

var gesture_description_list = [
    "字母 O 的手势 (O)",
    "数字 6 的手势 (Y)",
    "食指、中指交叉 (R)",
    "OK 的手势 (F)",
    "手腕略向下弯曲，拇指和食指指向下 (Q)",
    "八字形",
    "手呈握拳状",
    "手呈张开状",
    "手臂放在扶手上",
    "手臂竖直下垂",
    "手指点状，手臂移动",
    "向背后指点",
    "扇动手臂swipe",
    "挥舞手臂wave",
    "空中点击",
    "手张开",
    "五指张开，擦玻璃",
    "拍球",
    "跳绳",
    "打拳",
    "挥舞球拍",
    "往外推",
    "往里拉",
    "往上抬",
    "往下压",
    "握住东西",
    "在桌面上点击",
    "在桌面上用食指拖动",
    "在桌面上五指拖动",
    "在桌面上五指张开／收缩",
    "在桌面上两指张开／收缩",
    "在桌面上写字"
];


var STRENGTH_LIST = ["<strong>用力</strong>", "<strong>自然</strong>"];
var PAUSE_TIME_LIST = [2000, 500];

var gesture_times_list = [];
var gesture_index_g = -1;
var experiment_start_flag_g = false;
var gesture_record_flag_g = false;
var GESTURE_MAX_INDEX = gesture_description_list.length * STRENGTH_LIST.length - 1;
var experiment_log_list_g = [];
var experiment_log_list_per_gesture_g = [];
var current_log_g = null;
var user_name_g = "";
var MAX_TIMES_PER_GESTURE_EXPERIMENT = 15;
var max_times_per_gesture_g = MAX_TIMES_PER_GESTURE_EXPERIMENT;
var gesture_times_g = 0;
var experiment_start_type_g = 0;
var gesture_sum_g = max_times_per_gesture_g * (GESTURE_MAX_INDEX + 1);
console.log("max gesture index:", GESTURE_MAX_INDEX);
var INTERVAL_TIME = 1500;
var restart_flag_g = false;

// document.getElementById("progress-bar").style.width = "0%";
// $("#progress").show();
// var wordsNum = inputWindowText.length;
// $("#progress-bar").animate({width: '100%'}, wordsNum * tip);


$(document).ready(function () {
    $("#start-recording-btn").hide();
    $("#finish-recording-btn").hide();
    $("#restart-recording-btn").hide();
    $("#gesture-img").hide();
    $("#gesture-description").hide();
    $("#progress-panel").hide();
    $("#gesture-img").attr("src", "img/" + gesture_img_list[1]);
    $("#record-bar-panel").hide();
});

function start_experiment() {
    swal({
            title: "您确定要开始实验吗？",
            text: "请在帅帅的实验员指导下完成实验",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#4f9add",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true
        },
        function () {
            if (experiment_start_flag_g) {
                return;
            }
            setTimeout(confirm_start_experiment, 500);
        });
}

function confirm_start_experiment() {
    swal({
        title: "实验提示",
        text: "请帅帅的实验员再次确认数据采集程序正常运行。",
        type: "info",
        confirmButtonColor: "#4f9add",
        confirmButtonText: "确定",
        closeOnConfirm: true
    });
    experiment_start_type_g = 0;
    max_times_per_gesture_g = MAX_TIMES_PER_GESTURE_EXPERIMENT;
    gesture_sum_g = max_times_per_gesture_g * (GESTURE_MAX_INDEX + 1);
    init_gesture_times_list();
    console.log("max_times_per_gesture_g", max_times_per_gesture_g);
    user_name_g = $("#user-name-input").val();
    $("#user-name-input").val("");
    console.log("user name:", user_name_g);
    experiment_log_list_g = [];
    experiment_log_list_per_gesture_g = [];
    experiment_start_flag_g = true;
    $("#start-experiment-btn").hide();
    $("#practice-experiment-btn").hide();
    $("#record-bar-panel").show();
    document.getElementById("record-bar").style.width = "0%";
    $("#gesture-img").show();
    $("#start-img").hide();
    $("#gesture-description").show();
    $("#start-description").hide();
    $("#progress-panel").show();
    update_gesture(true);
}

function practice_experiment() {
    swal({
            title: "您确定要开始练习吗？",
            text: "请在帅帅的实验员指导下完成练习",
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#4f9add",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: true
        },
        function () {
            if (experiment_start_flag_g) {
                return;
            }
            experiment_start_type_g = 1;
            max_times_per_gesture_g = 1;
            gesture_sum_g = max_times_per_gesture_g * (GESTURE_MAX_INDEX + 1);
            console.log("max_times_per_gesture_g", max_times_per_gesture_g);
            init_gesture_times_list();
            user_name_g = $("#user-name-input").val();
            $("#user-name-input").val("");
            console.log("user name:", user_name_g);
            experiment_log_list_g = [];
            experiment_log_list_per_gesture_g = [];
            experiment_start_flag_g = true;
            $("#start-experiment-btn").hide();
            $("#practice-experiment-btn").hide();
            $("#record-bar-panel").show();
            document.getElementById("record-bar").style.width = "0%";
            $("#gesture-img").show();
            $("#start-img").hide();
            $("#gesture-description").show();
            $("#start-description").hide();
            $("#progress-panel").show();
            update_gesture(true);
        });

}

function stop_experiment(flag) {
    if (flag === 0) {
        swal({
                title: "您确定要终止实验吗？",
                text: "终止实验后，之前的实验数据将会清空",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#4f9add",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                confirm_stop_experiment();

            });
    } else {
        swal({
            title: "实验完成",
            text: "感谢您的配合",
            type: "info",
            confirmButtonColor: "#4f9add",
            confirmButtonText: "确定",
            closeOnConfirm: true
        });
        confirm_stop_experiment();
    }
}

function confirm_stop_experiment() {
    if (!experiment_start_flag_g) {
        return;
    }
    $("#gesture-img").attr("src", "img/" + gesture_img_list[1]);
    experiment_start_flag_g = false;
    gesture_record_flag_g = false;
    $("#start-recording-btn").hide();
    $("#finish-recording-btn").hide();
    $("#restart-recording-btn").hide();
    $("#start-experiment-btn").show();
    $("#practice-experiment-btn").show();
    $("#gesture-img").hide();
    $("#start-img").show();
    $("#gesture-description").hide();
    $("#start-description").show();
    $("#progress-panel").hide();
    if (experiment_start_type_g === 0)
        download_logs();
    experiment_log_list_g = [];
    experiment_log_list_per_gesture_g = [];
}

function init_gesture_times_list() {
    gesture_times_list = [];
    for (var i = 0; i <= GESTURE_MAX_INDEX; i++)
        gesture_times_list.push(0);
    gesture_times_g = 0;
    gesture_index_g = -1;

}

function download_logs() {
    var text = "gesture_index, strength_type, start_time, finish_time\n";
    for (var i = 0; i < experiment_log_list_g.length; i++) {
        var experiment_log_list_per_gesture = experiment_log_list_g[i];
        for (var j = 0; j < experiment_log_list_per_gesture.length; j++) {
            var log = experiment_log_list_per_gesture[j];
            console.log(log);
            text += log["gesture_index"] + ", " + log["strength_type"] + ", " + log["start_time"] + ", " + log["finish_time"] + "\n";
        }
    }
    saveAs(
        new Blob(
            [text]
            , {type: "text/plain;charset=" + 'utf-8'}
        )
        , user_name_g + "_log.csv"
    );

}

function update_progressbar() {
    var width = gesture_times_g * 100 / gesture_sum_g;
    $("#progress-bar").attr("style", "width: " + width + "%");
    $("#progress-bar").html(gesture_times_g);
}

function get_next_gesture() {
    if (gesture_times_g >= gesture_sum_g) {
        gesture_index_g = -2;
        return -1;
    }
    console.log("gesture_times_g:", gesture_times_g);

    update_progressbar();

    // judge if switch gesture
    if (gesture_index_g < 0 || gesture_times_list[gesture_index_g] >= max_times_per_gesture_g) {
        gesture_index_g = Math.floor(Math.random() * (GESTURE_MAX_INDEX + 1));
        while (gesture_times_list[gesture_index_g] >= max_times_per_gesture_g) {
            gesture_index_g = Math.floor(Math.random() * (GESTURE_MAX_INDEX + 1));
        }
        return 1;
    }
    return 0;
}

function start_recording() {
    if (!experiment_start_flag_g)
        return -1;
    if (restart_flag_g) {
        restart_flag_g = false;
        return -1;
    }
    // console.log("start recording");
    $("#start-recording-btn").hide();
    // $("#finish-recording-btn").show();
    $("#restart-recording-btn").show();
    $("#gesture-img").attr("src", "img/" + gesture_img_list[2]);
    gesture_record_flag_g = true;
    current_log_g["start_time"] = get_timestamp();
    document.getElementById("record-bar").style.width = "0%";
    $("#record-bar").attr("class", "progress-bar progress-bar-info progress-bar-striped");
    $("#record-bar").animate({width: '100%'}, INTERVAL_TIME, 'linear', finish_recording);
    // setTimeout(finish_recording, INTERVAL_TIME);
}

function finish_recording() {
    if (!experiment_start_flag_g)
        return -1;
    if (restart_flag_g) {
        restart_flag_g = false;
        return -1;
    }
    // console.log("finish recording");
    // console.log("-----------------");
    // $("#start-recording-btn").show();
    $("#finish-recording-btn").hide();
    // $("#restart-recording-btn").hide();
    current_log_g["finish_time"] = get_timestamp();
    update_gesture(false);

}

function restart_recording() {
    if (!experiment_start_flag_g)
        return -1;
    console.log("restart recording");
    gesture_record_flag_g = false;
    restart_flag_g = true;
    experiment_log_list_per_gesture_g = [];
    gesture_times_g -= gesture_times_list[gesture_index_g];
    gesture_times_list[gesture_index_g] = 0;
    update_progressbar();
    $("#gesture-img").attr("src", "img/" + gesture_img_list[1]);
    $("#start-recording-btn").show();
    $("#finish-recording-btn").hide();
    $("#restart-recording-btn").hide();
}


function get_timestamp() {
    // console.log(Date.now());
    return Date.now();
}

function get_gesture_sub_index() {
    var gesture_strength_index = 0;
    var gesture_sub_index = gesture_index_g;
    while (gesture_sub_index >= gesture_description_list.length) {
        gesture_strength_index++;
        gesture_sub_index -= gesture_description_list.length;
    }
    return [gesture_strength_index, gesture_sub_index]
}

function update_gesture(start_tag) {
    if (current_log_g !== null)
        experiment_log_list_per_gesture_g.push(current_log_g);
    current_log_g = {};
    if (!start_tag) {
        gesture_times_g += 1;
        gesture_times_list[gesture_index_g] += 1;
        console.log("current_times:", gesture_times_list[gesture_index_g]);
    }
    var flag = get_next_gesture();
    if (flag !== 0 || start_tag) {
        if (experiment_log_list_per_gesture_g.length > 0) {
            experiment_log_list_g.push(experiment_log_list_per_gesture_g);
            experiment_log_list_per_gesture_g = [];
        }
        gesture_record_flag_g = false;
    }
    if (flag === -1) {
        stop_experiment(1);
        return;
    }
    // show the "stop" image
    $("#gesture-img").attr("src", "img/" + gesture_img_list[0]);
    var gesture_index_tuple = get_gesture_sub_index();
    // $("#collapse-btn").click();
    document.getElementById("record-bar").style.width = "0%";
    $("#record-bar").attr("class", "progress-bar progress-bar-danger progress-bar-striped");
    $("#record-bar").animate({width: '100%'}, PAUSE_TIME_LIST[gesture_index_tuple[0]], 'linear', function () {
        if (start_tag) {
            next_update_gesture(1);
        } else {
            next_update_gesture(flag);
        }
    });
    // setTimeout(function () {
    //     if (start_tag) {
    //         next_update_gesture(1);
    //     } else {
    //         next_update_gesture(flag);
    //     }
    // }, PAUSE_TIME_LIST[gesture_index_tuple[0]]);
}

function next_update_gesture(flag) {
    if (flag === 1) {
        $("#start-recording-btn").show();
    }
    console.log("gesture index", gesture_index_g);
    var gesture_index_tuple = get_gesture_sub_index();
    // $("#gesture-img").attr("src", "img/" + gesture_img_list[gesture_index_tuple[1]]);
    $("#gesture-description").html(gesture_description_list[gesture_index_tuple[1]] + "</br>" + STRENGTH_LIST[gesture_index_tuple[0]]);
    current_log_g["gesture_index"] = gesture_index_tuple[1];
    current_log_g["strength_type"] = gesture_index_tuple[0];
    if (flag === 0) {
        start_recording();
    } else {
        $("#gesture-img").attr("src", "img/" + gesture_img_list[1]);
        $("#restart-recording-btn").hide();
    }

}

$(document).keypress(function (e) {
    if (!experiment_start_flag_g)
        return;
    // console.log(e.which);
    var key = e.which;
    if (key === 32) {
        if (gesture_record_flag_g) {
            // finish_recording();
        } else {
            start_recording();
        }
    } else if (key === 113) {
        stop_experiment(0);
    } else if (key === 114) {
        restart_recording();
    }
});