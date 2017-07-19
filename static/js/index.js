/**
 * Created by Admin on 2017/7/19.
 */
var gesture_img_list = ["1-wave.png", "2-swipe.png", "3-rotate.png", "4-spread-fist.png", "5-fist-spread.png",
    "6-point.jpg", "7-tap.gif", "8-circle.png", "9-write.jpg", "10-o.jpg", "11-10.png", "12-y.jpg", "13-r.jpg",
    "14-f.jpg", "15-q.jpg"];

var gesture_description_list = [
    "五指张开，“擦玻璃”",
    "五指张开，手掌左右扇动",
    "五指张开，手掌前后反转",
    "手张开->握拳",
    "手握拳->张开",
    "用食指指点：从前方指向右前方，再回到前方",
    "用食指在空中点击",
    "用食指画圈",
    "写字",
    "字母 O 的手势 (O)",
    "竖起拇指，左右摇动 (10)",
    "数字 6 的手势 (Y)",
    "食指、中指交叉 (R)",
    "OK 的手势 (F)",
    "手腕略向下弯曲，拇指和食指指向下 (Q)"];

var gesture_times_list = [];
var current_gesture_index = -1;
var experiment_start_flag = false;
var gesture_record_flag = false;
var gesture_max_index = gesture_description_list.length - 1;
var experiment_log_list = [];
var current_log = null;
var user_name = "";
var timer = null;
var max_times_per_gesture = 15;
var gesture_times = 0;
console.log("max gesture index:", gesture_max_index);

$(document).ready(function () {
    $("#start-recording-btn").hide();
    $("#finish-recording-btn").hide();
    $("#gesture-img").hide();
    $("#gesture-description").hide();

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
            if (experiment_start_flag) {
                return;
            }
            init_gesture_times_list();
            user_name = $("#user-name-input").val();
            $("#user-name-input").val("");
            console.log("user name:", user_name);
            experiment_log_list = [];
            experiment_start_flag = true;
            $("#start-recording-btn").show();
            $("#start-experiment-btn").hide();
            $("#gesture-img").show();
            $("#start-img").hide();
            $("#gesture-description").show();
            $("#start-description").hide();
            update_gesture();
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
                if (!experiment_start_flag) {
                    return;
                }
                experiment_start_flag = false;
                gesture_record_flag = false;
                $("#start-recording-btn").hide();
                $("#start-experiment-btn").show();
                $("#gesture-img").hide();
                $("#start-img").show();
                $("#gesture-description").hide();
                $("#start-description").show();
                download_logs();
                experiment_log_list = [];

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
        if (!experiment_start_flag) {
            return;
        }
        experiment_start_flag = false;
        gesture_record_flag = false;
        $("#start-recording-btn").hide();
        $("#start-experiment-btn").show();
        $("#gesture-img").hide();
        $("#start-img").show();
        $("#gesture-description").hide();
        $("#start-description").show();
        download_logs();
        experiment_log_list = [];
    }


}

function init_gesture_times_list() {
    for (var i = 0; i < gesture_description_list.length; i++)
        gesture_times_list.push(0);
    gesture_times = 0;

}

function download_logs() {
    var text = "gesture_index, start_time, finish_time\n";
    for (var i = 0; i < experiment_log_list.length; i++) {
        var log = experiment_log_list[i];
        console.log(log);
        text += log["gesture_index"] + ", " + log["start_time"] + ", " + log["finish_time"] + "\n";
    }
    saveAs(
        new Blob(
            [text]
            , {type: "text/plain;charset=" + 'utf-8'}
        )
        , user_name + "_log.csv"
    );

}


function get_next_gesture() {
    if (gesture_times >= max_times_per_gesture * (gesture_max_index + 1)) {
        return -1;
    }
    gesture_times += 1;
    var gesture_index = Math.floor(Math.random() * (gesture_max_index + 1));
    while (gesture_times_list[gesture_index] >= max_times_per_gesture) {
        gesture_index = Math.floor(Math.random() * (gesture_max_index + 1));
    }
    gesture_times_list[gesture_index] += 1;
    return gesture_index;
}

function start_recording() {
    if (!experiment_start_flag || gesture_record_flag)
        return -1;
    $("#start-recording-btn").hide();
    $("#finish-recording-btn").show();
    gesture_record_flag = true;
    current_log["start_time"] = get_timestamp();
    timer = setTimeout(finish_recording, 2000);
}

function finish_recording() {
    console.log("finish recording");
    clearTimeout(timer);
    if (!experiment_start_flag || !gesture_record_flag)
        return -1;
    $("#start-recording-btn").show();
    $("#finish-recording-btn").hide();
    gesture_record_flag = false;
    current_log["finish_time"] = get_timestamp();
    update_gesture();
}


function get_timestamp() {
    // console.log(Date.now());
    return Date.now();
}

function update_gesture() {
    if (current_log !== null)
        experiment_log_list.push(current_log);
    current_log = {};
    current_gesture_index = get_next_gesture();
    if (current_gesture_index === -1) {
        stop_experiment(1);
        return;
    }
    $("#collapse-btn").click();
    $("#collapse-btn").click();
    // setTimeout(collapse_gesture_panel, 100);
    console.log("gesture index", current_gesture_index);
    $("#gesture-img").attr("src", "img/" + gesture_img_list[current_gesture_index]);
    $("#gesture-description").html(gesture_description_list[current_gesture_index]);
    current_log["gesture_index"] = current_gesture_index;
}

$(document).keypress(function (e) {
    if (!experiment_start_flag)
        return;
    console.log(e.which);
    var key = e.which;
    if (key === 32) {
        if (gesture_record_flag) {
            finish_recording();
        } else {
            start_recording();
        }
    } else if (key === 113) {
        stop_experiment(0);
    }
});