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
    $.ajax({
        type: 'get',
        url: 'http://47.97.205.240:8800/',
        // url: 'http://localhost:5000/',
        success: function(data){
            user = data.user
        }
    })
}
function toChildValue() {
    return xishu_html
}
function showImgDiv() {
    $('.img_box').css({
        'display': 'block',
        
        // 'background': 'url("http://47.97.205.240:8800/static/' + user + '/5.png") no-repeat center top',
        // 'background-size': 'cover'
    })
    $('.btn-box').css({'top': '4%'})
    $('.result').css({
        'width': '100%',
        'height': '170px'
    })
    // code_out.setSize('100%','170px')
}
function hideImgDiv() {
    $('.img_box').css({
        'display': 'none',
        'background': ''
    })
    $('.btn-box').css({'top': '4%'})
    $('.result').css({
        'width': '100%',
        'height': '90%'
    })
    // code_out.setSize('100%','570px')
}
// function showPreBtn() {
//     $('#pre').show()
//     $('#next').css({
//         'position': '',
//         'left': '0',
//     })
// }
$('.next').click(function(){
    if (current_page < 9) {
        if (current_page < 7) {
            if (!run_code_clicked[current_page]) {
                alert('亲，先运行这一步哦~')
                return
            }
        }
        // showPreBtn()
        $('#result-tbody').html('')
        page_codes[current_page] = code_in.getValue()
        current_page ++
        if (current_page == 5)
            $('.img_box').show()
        else
            $('.img_box').hide()
        if (current_page == 7){
            $('.bottom-left img').attr('src', 'http://47.97.205.240:8800/static/' + user + '/5.png')
            pie1.setOption(pie_option);
            $('#page-eight-tbody').html(xishu_html)
        }
        code_in.setValue('')
        if (current_page < 7)
        code = page_codes[current_page].trim()
        if (code == '')
            code = codes[current_page]
        code_in.setValue(code)
        showPage(current_page)
    }
})
$('.pre').click(function(){
    if (current_page > 0){
        $('#result-tbody').html('')
        current_page --
        if (current_page == 5)
            $('.img_box').show()
        else
            $('.img_box').hide()
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
    $('.layui-layer-btn').css({'padding-right': '158px'})
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
                $('layui-layer-setwin a').click()
                layer.closeAll()
            } else if (btnName == 'buy'){
                layer.closeAll()
                layer.msg('购买成功！', {icon: 6});
                current_page ++
                showPage(current_page)
            }
        }
    });
}
$('#adjust').click(function(){
    eightShowAlert('adjust')
    for (i=4;i<7;i++)
        page_codes[i] = ''
})
$('#buy').click(function(){
    eightShowAlert('buy')
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
            if (status != 'showAdviseBtn') 
                window.location.href = 'index.html'
            else
                $('.advise-btn').show()
            layer.closeAll()
        }
    });
}
$('.nine-next').click(function(){
    if ($('.advise-btn').css('display') == 'none'){
        showNineAlert('showAdviseBtn')
    }
    if ($(".advise-btn").prop("disabled") == true){
        showNineAlert('showComplete')
    }
})
var advise_btn_click_count = 0
$('.advise-btn').click(function(){
    if (advise_btn_click_count == 2) {
        $(".advise-btn").attr("disabled", true);
        $(".advise-btn").css({'background-color' : 'gray'});
    }
    layer.open({
        type: 2,
        area: ['797px', '568px'], // 宽 高
        title: false,
        closeBtn: 1,
        shadeClose: true,
        btn: ['调仓', '不调仓'],
        skin: 'advise-alert',
        content: ['9-advise.html', 'no'],
        success: function(){
            $(".layui-layer-setwin .layui-layer-close2").css({
                'right': '18px',
                'top': '-5px',
                'background-position': '30px -32px'
            })
            $('.layui-layer-setwin a').append('X')
            $('.layui-layer-setwin a').css({
                'font-size': '44px',
                'color': 'white'
            })
            $('.layui-layer-btn').css({'padding-right': '316px'})
        }
    });
    advise_btn_click_count ++
})
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
            $('.layui-layer-btn').css({'padding-right': '202px'})
        }
    });
}
function showPage(current_page) {
    $('.left-pages>div').hide()
    $($('.left-pages>div')[current_page]).show()
    switch (current_page) {
        case 1:
            showIntroduceAlert(1)
            break
        case 6:
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
                    $('.layui-layer-btn').css({'padding-right': '202px'})
                }
            });
            break
        case 7:
            $('.right-page-content').hide()
            $('#right-page-eight').show()
            break
        case 8:
            $('#right-page-eight').hide()
            $('#right-page-nine').show()
            break
    }
}
function showWenhaoAlert(num) {
    confirm_a_css = {
        'font-size': '27px',
        'color': 'white'
    }
    // switch (num) {
    //     case 0:
    //         area = ['900px', '570px']
    //         content = ['1-wenhao.html']
    //         close_btn_css = {
    //             'right': '3px',
    //             'top': '1px',
    //             'background-position': '30px -32px'
    //         }
    //         confirm_btn_css = {'padding-right': '46%'}
    //         break
    //     case 1:
    //         area = ['700px', '470px']
    //         content = ['2-user.html']
    //         close_btn_css = {
    //             'right': '3px',
    //             'top': '1px',
    //             'background-position': '30px -32px'
    //         }
    //         confirm_btn_css = {'padding-right': '46%'}
    // }
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
            $('.layui-layer-btn').css(confirm_btn_css)
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
            $('.layui-layer-btn').css({'padding-right': '116px'})
        },
        btn2: function () {
            window.location.href = 'risk.html'
        }
    });
}
$('.wenhao').click(function(){
    showWenhaoAlert(current_page)
})
$('.user').click(function(){
    showUserAlert(current_page)
})

$('.back-to').click(function(){
    window.location.href = '../index.html'
})