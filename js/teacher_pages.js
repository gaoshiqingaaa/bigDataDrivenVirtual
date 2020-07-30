var current_page = 0
window.onload = function(){
    $($('.left-pages>div')[current_page]).show()
    $('#right-page-code').show()
    
}
$('.next').click(function(){
    if (current_page < 9) {
        current_page ++
        showPage(current_page)
        console.log(current_page);
    }
})
$('.pre').click(function(){
    if (current_page > 0){
        current_page --
        showPage(current_page)
    }
})
$('#adjust').click(function(){
    layer.alert('将返回第五步重新构建组合', {
        closeBtn: 1
    }, function(){
        current_page = 4
        $('.left-pages>div').hide()
        $($('.left-pages>div')[4]).show()
        $('#right-page-eight').hide()
        $('#right-page-code').show()
        layer.close(layer.alert())
    })
})
$('#buy').click(function(){
    layer.alert('将投入100000元购买该投资组合', {
        closeBtn: 1
    }, function(){
        layer.msg('购买成功！', {icon: 6});
        current_page ++
        showPage(current_page)
    })
})
$('.nine-next').click(function(){
    if ($('.advise-btn').css('display') == 'none'){
        layer.alert('2个月以后，由于资本市场的变化，产生了新的投资策略，请点击“调仓”按钮查看详情。', {
        closeBtn: 1
        },function(){
            $('.advise-btn').show()
            layer.close(layer.alert())
        })
    }
})
$('.advise-btn').click(function(){
    layer.open({
        type: 2,
        area: ['50%', '75%'], // 宽 高
        title: false,
        closeBtn: 0,
        shadeClose: true,
        skin: 'advise-alert',
        content: '9-advise.html',
    });
})
function showPage(current_page) {
    $('.left-pages>div').hide()
    $($('.left-pages>div')[current_page]).show()
    switch (current_page) {
        case 6:
            layer.open({
                    type: 2,
                    area: ['600px', '270px'],
                    title: false,
                    closeBtn: 0,
                    shadeClose: true,
                    skin: 'yourclass',
                    content: '7-intro.html',
                    btn: ['知道了']
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
