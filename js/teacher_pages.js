var initValue = code_in.getValue()
var page_codes = {}
var user
var run_code_clicked = []
for (i = 0; i < 7; i++)
    run_code_clicked.push(false)
for (i = 0; i < 7; i++)
    page_codes[i] = ''
var current_page = 0
window.onload = function(){
    $($('.left-pages>div')[current_page]).show()
    $('#right-page-code').show()
    // $('#right-page-code').hide()
    // $('#right-page-nine').show()
    // localStorage.clear()
    localStorage.setItem('old_weight', null)
    localStorage.setItem('new_weight', null)
    localStorage.setItem('analyse_score', null)
    localStorage.setItem('combine_score', null)
    user = JSON.parse(localStorage.getItem('temporary_user'))
    if (user == null) {
        $.ajax({
            type: 'get',
            url: 'http://47.97.205.240:8800/',
            // url: 'http://localhost:5000/',
            success: function(data){
                user = data.user
            }
        })
    }
    $.ajax({
        type: 'post',
        url: 'http://47.97.205.240:8800/delete',
        data: {
            user: user
        },
    })
}
function toChildValue() {
    return xishu_html
}
var caled_score = false
$('.next').click(function(){
    html = ''
    if (current_page < 9) {
        if (current_page < 7) {
            if (!run_code_clicked[current_page]) {
                html += '<tr style="text-align: center"><td colspan=7 style="color: red">亲，先运行这一步哦~</td></tr>'
                $('#result-tbody').html(html)
                return
            }
        }
        $('#result-tbody').html('')
        page_codes[current_page] = code_in.getValue()
        current_page ++ //增加了1 后面的页数 页面显示多少就是多少
        if (current_page == 5) 
            $('.img_box').show()
        else {
            $('.img_box').hide()
            $('.img_box').css({'background': 'url()'})
        }
        if (current_page == 7){
            $('.bottom-left img').attr('src', 'http://47.97.205.240:8800/static/' + user + '/5.png')
            pie1.setOption(pie_option);
            $('#page-eight-tbody').html(xishu_html)
            if (!isTeacher) {
                best_combine = localStorage.getItem('best_combine')
                if (best_combine == null)
                    best_combine = ''
                $('#combine').html(best_combine)
            }
        }
        code_in.setValue('')
        showPage(current_page)
    }
})
$('.pre').click(function(){
    if (current_page > 0){
        $('#result-tbody').html('')
        current_page --
        if (current_page == 5)
            $('.img_box').show()
        else{
            $('.img_box').css({'background': 'url()'})
            $('.img_box').hide()
        }
        showPage(current_page)
        code_in.setValue(page_codes[current_page])
    }
})
function eightAlertButton() {
    $(".layui-layer-setwin .layui-layer-close2").css({
        'right': '-13px',
        'top': '-11px',
        'background-position': '30px -32px'
    })
    $('.layui-layer-setwin a').append('X')
    $('.layui-layer-setwin a').css({
        'font-size': '27px',
        'color': 'white'
    })
    $('.layui-layer-iframe').css({'border-radius': '12px'})
    alertBtnArgs()
}
function eightShowAlert(btnName) {
    if (btnName == 'adjust') {
        content = ['8-adjust.html', 'no']
        btn = ['确定']
    } else {
        content = ['8-buy.html', 'no']
        btn = ['确定买入']
    }
    layer.open({
        type: 2,
        area: ['400px', '250px'], 
        title: false,
        closeBtn: 1,
        shadeClose: true,
        skin: '',
        content: content,
        btn: btn,
        success: function(elem) {
            eightAlertButton()
        },
        btn1: function () {
            if (btnName == 'adjust'){
                current_page = 4
                $('.left-pages>div').hide()
                $($('.left-pages>div')[4]).show()
                $('#right-page-eight').hide()
                $('#right-page-code').show()
                // $('layui-layer-setwin a').click()
                layer.closeAll()
            } else if (btnName == 'buy'){
                layer.closeAll()
                layer.msg('购买成功！', {icon: 6});
                current_page ++
                // 买入后直接显示 
                if (money_info.combination > 0) {
                    $('.right-content-bottom-all-nine .combination h3').css({'color': 'red'})
                    combination = '+' + money_info.combination + '%'
                } else {
                    $('.right-content-bottom-all-nine .combination h3').css({'color': 'green'})
                    combination = money_info.combination + '%'
                }
                $('.right-content-bottom-all-nine .combination h3').html(combination)
                line_smooth.setOption(line_smooth_option)
            }
            showPage(current_page)
        }
    });
}
$('#adjust').click(function(){
    eightShowAlert('adjust')
    // for (i=4;i<7;i++)
    //     page_codes[i] = ''
})
$('#buy').click(function(){
    eightShowAlert('buy')
    init_pie()
    init_line_smooth(0, 100000)
    pie.setOption(pie_option);
    // line_smooth.setOption(line_smooth_option)
})
function showNineAlert(status) {
    if (status == 'showAdviseBtn') {
        content = ['9-showAdviseBtn.html', 'no']
        btn = ['确认']
    } else {
        content = ['9-complete.html', 'no']
        btn = ['完成实验']
    }
    layer.open({
        type: 2,
        area: ['400px', '250px'], 
        title: false,
        closeBtn: 1,
        shadeClose: true,
        skin: '',
        content: content,
        btn: btn,
        success: function(elem) {
            eightAlertButton()
        },
        btn1: function () {
            if (status != 'showAdviseBtn') {
                window.location.href = '../index.html'
            }
            else{
                $('.advise-btn').show()
                pie.setOption(pie_option);
                line_smooth.setOption(line_smooth_option)
                setMoney()
            }
            layer.closeAll()
        }
    });
}
function getWeight(step, risk) {
    $.ajax({
        type: 'POST',
        // url: 'http://127.0.0.1:5000/weight',
        url: 'http://47.97.205.240:8800/weight',
        data: {
            step: step,
            risk: risk
        },
        success: function(data){
            localStorage.setItem('old_weight', JSON.stringify(six_best_weight))
            localStorage.setItem('new_weight', JSON.stringify(data))
        }
    
    })
}
var nine_next_click_count = 0
var total_money = 100000.00
var nine_next_click_flag = false
$('.nine-next').click(function(){
    if (advise_flag == true) {
        init_pie()
        init_line_smooth(nine_next_click_count, total_money)
    }
    risk = window.location.href.indexOf('teacher') != -1? 3: getRiskAversion()
    getWeight(nine_next_click_count + 1, risk)
    if (nine_next_click_count >= 3){
        showNineAlert('showComplete')
    } else {
        if (advise_click_flag || nine_next_click_count == 0){
            nine_next_click_flag = true
            nine_next_click_count ++
            showNineAlert('showAdviseBtn')
        }
    }
    advise_flag = false
    advise_click_flag = false
    step_score['leiji'] = $('.right-content-top-left-nine .bottom .right .text h2').text()
    $.ajax({
        url: "http://47.97.205.240:8800/sendStepScore",
        method: 'post',
        data: {
            user: user,
            step_score: JSON.stringify(step_score)
        }
    })
})
var advise_btn_click_count = 0
var advise_flag = false
var advise_click_flag = false
$('.advise-btn').click(function(){
    advise_click_flag = true
    if (nine_next_click_flag) {
        if (advise_btn_click_count == 1) {
            $(".advise-btn").attr("disabled", true);
            $(".advise-btn").css({'background-color' : 'gray'});
        }
        layer.open({
            type: 2,
            area: ['640px', '460px'], // 宽 高
            title: false,
            closeBtn: 1,
            shadeClose: true,
            btn: ['调仓', '不调仓'],
            skin: 'advise-alert',
            content: ['9-advise.html', 'no'],
            success: function(){
                $(".layui-layer-setwin .layui-layer-close2").css({
                    'right': '1px',
                    'top': '-5px',
                    'background-position': '30px -32px'
                })
                $('.layui-layer-setwin a').append('X')
                $('.layui-layer-setwin a').css({
                    'font-size': '30px',
                    'color': 'white'
                })
                $('.layui-layer-iframe').css({'border-radius': '22px'})
                $('.layui-layer-btn a').css({
                    'height': '40px',
                    'line-height': '40px',
                    'width': '210px',
                    'text-align': 'center',
                    'font-size': '16px'
                })
                $('.layui-layer-btn').css({
                    'position': 'relative',
                    'bottom': '5%',
                    'text-align': 'center'
                })
                $('.layui-layer-btn1').css({
                    'border-color': '#1E9FFF',
                    'background-color': '#1E9FFF',
                    'color': '#fff'
                })
                
            },
            btn1: function(){
                six_best_weight = JSON.parse(localStorage.getItem('new_weight'))
                for (var o in six_best_weight) {
                    six_best_weight_code[name_code_reverse[o]] = six_best_weight[o]
                }
                advise_flag = true
                // init_line_smooth(advise_btn_click_count, total_money)
                // risk = window.location.href.indexOf('teacher') != -1? 3: getRiskAversion()
                // getWeight(2, risk)
                // init_pie()
                layer.closeAll()
            }
        });
        nine_next_click_flag = false
        advise_btn_click_count ++
    }
    
})
function setMoney(){
    var new_earning, leiji, combination
    if (money_info.new_earning > 0) {
        $('.right-content-top-left-nine .bottom .left .text h2').css({'color': 'red'})
        new_earning = '+' + money_info.new_earning
    } else {
        $('.right-content-top-left-nine .bottom .left .text h2').css({'color': 'green'})
        new_earning = money_info.new_earning
    }
    if (money_info.leiji > 0) {
        leiji = '+' + money_info.leiji
        $('.right-content-top-left-nine .bottom .right .text h2').css({'color': 'red'})
    } else {
        $('.right-content-top-left-nine .bottom .right .text h2').css({'color': 'green'})
        leiji = money_info.leiji
    }
    if (money_info.combination > 0) {
        $('.right-content-bottom-all-nine .combination h3').css({'color': 'red'})
        combination = '+' + money_info.combination + '%'
    } else if (money_info.combination < 0){
        $('.right-content-bottom-all-nine .combination h3').css({'color': 'green'})
        combination = money_info.combination + '%'
    } else if (money_info.combination == undefined) {
        money_info.combination = 0 
    }
    $('.right-content-top-left-nine .top .text h1').html(money_info.total_money)
    $('.right-content-top-left-nine .bottom .left .text p').html('最新收益(' + money_info.new_day.split('-')[1] + '-' + money_info.new_day.split('-')[2] + ')')
    $('.right-content-top-left-nine .bottom .left .text h2').html(new_earning)
    $('.right-content-top-left-nine .bottom .right .text h2').html(leiji)
    $('.right-content-bottom-all-nine .combination h3').html(combination)
}
function showIntroduceAlert(num) {
    switch (num) {
        case 1:
            content = ['2-intro.html', 'no']
            btn = ['知道了']
            break
        case 6:
            content = ['7-intro.html', 'no']
            btn = ['知道了']
            break
    }
    layer.open({
        type: 2,
        area: ['500px', '270px'], 
        title: false,
        closeBtn: 1,
        shadeClose: true,
        skin: 'introduce-alert',
        content: content,
        btn: btn,
        success: function(elem) {
            $(".layui-layer-setwin .layui-layer-close2").css({
                'right': '3px',
                'top': '-8px',
                'background-position': '30px -32px'
            })
            $('.layui-layer-setwin a').append('X')
            $('.layui-layer-setwin a').css({
                'font-size': '27px',
                'color': 'white'
            })
            alertBtnArgs()
            $('.layui-layer-iframe').css({'border-radius': '12px'})
        }
    });
}
function alertBtnArgs() {
    $('.layui-layer-btn a').css({
        'height': '40px',
        'line-height': '40px',
        'width': '145px',
        'text-align': 'center',
        'font-size': '16px'
    })
    $('.layui-layer-btn').css({
        'position': 'relative',
        'bottom': '8%',
        'text-align': 'center'
    })
}
function showPage(current_page) {
    if (current_page < 7)
    code = page_codes[current_page].trim()
    if (code == '')
        code = codes[current_page]
    code_in.setValue(code)
    $('.left-pages>div').hide()
    $($('.left-pages>div')[current_page]).show()
    switch (current_page) {
        case 1:
            showIntroduceAlert(1)
            break
        case 6:
            if (isTeacher) {
                layer.open({
                    type: 2,
                    area: ['500px', '270px'], 
                    title: false,
                    closeBtn: 1,
                    shadeClose: true,
                    skin: 'introduce-alert',
                    content: '7-intro.html',
                    btn: ['知道了'],
                    success: function(elem) {
                        $(".layui-layer-setwin .layui-layer-close2").css({
                            'right': '3px',
                            'top': '-11px',
                            'background-position': '30px -32px'
                        })
                        $('.layui-layer-setwin a').append('X')
                        $('.layui-layer-setwin a').css({
                            'font-size': '27px',
                            'color': 'white'
                        })
                        $('.layui-layer-iframe').css({'border-radius': '12px'})
                        alertBtnArgs()
                    }
                });
            }
            break
        case 7:
            $('.right-page-content').hide()
            $('#right-page-eight').show()
            break
        case 8:
            $('#right-page-eight').hide()
            $('#right-page-nine').show()
            var analyse_score = localStorage.getItem('analyse_score') == 'null'? 0: 5
            var combine_score = localStorage.getItem('combine_score') == 'null'? 0: 5
            step_score[5] += + analyse_score + combine_score
            localStorage.setItem("step_score", JSON.stringify(step_score))
            break
    }
}
function showWenhaoAlert(num) {
    confirm_a_css = {
        'font-size': '27px',
        'color': 'white'
    }
    area = ['700px', '470px']
    content = ['2-user.html']
    close_btn_css = {
        'right': '3px',
        'top': '1px',
        'background-position': '30px -32px'
    }
    confirm_btn_css = {'padding-right': '46%'}
    layer.open({
        type: 2,
        area: area, 
        title: false,
        closeBtn: 1,
        shadeClose: true,
        skin: [],
        content: content,
        btn: ['知道了'],
        success: function(elem) {
            $(".layui-layer-setwin .layui-layer-close2").css(close_btn_css)
            $('.layui-layer-setwin a').append('X')
            $('.layui-layer-setwin a').css(confirm_a_css)
            $('.layui-layer-iframe').css({'border-radius': '20px'})
            alertBtnArgs()
            $('.layui-layer-btn').css({
                'bottom': '5%',
            })
        }
    });
}
function showUserAlert(num) {
    confirm_a_css = {
        'font-size': '27px',
        'color': 'white'
    }
    layer.open({
        type: 2,
        area: ['400px', '250px'], 
        title: false,
        closeBtn: 1,
        shadeClose: true,
        skin: '',
        content: ['risk_result_alert.html', 'no'],
        btn: ['确认', '重新测试'],
        success: function(elem) {
            $(".layui-layer-setwin .layui-layer-close2").css({
                'right': '-13px',
                'top': '-11px',
                'background-position': '30px -32px'
            })
            $('.layui-layer-setwin a').append('X')
            $('.layui-layer-setwin a').css({
                'font-size': '27px',
                'color': 'white'
            })
            $('.layui-layer-iframe').css({'border-radius': '20px'})
            $('iframe').css({'border-radius': '12px'})
            $('.layui-layer-btn a').css({
                'height': '40px',
                'line-height': '40px',
                'width': '110px',
                'text-align': 'center',
                'font-size': '16px',
                'border-color': '#1E9FFF',
                'background-color': '#1E9FFF',
                'color': 'white'
            })
            $('.layui-layer-btn').css({
                'position': 'relative',
                'bottom': '8%',
                'text-align': 'center',
            })
        },
        btn2: function () {
            window.location.href = 'risk.html'
        }
    });
}
layer.config({
    extend: 'myskin/style.css'
});
$('#help').click(function(){
    // showWenhaoAlert(current_page)
    layer.open({
        type: 2,
        area:['1000px', '600px'], 
        content:'../system.html',
        skin: 'layer-bg',
    })
})
$('#friends').click(function(){
    showUserAlert(current_page)
})

$('.back-to').click(function(){
    window.location.href = '../index.html'
})