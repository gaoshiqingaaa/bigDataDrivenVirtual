var code_in = CodeMirror.fromTextArea(document.getElementById("code-in"), {
    mode: {
        name: 'python'
    },
    // lineNumbers: true,
    theme: "idea",	//设置主题
    lineWrapping: true,	//代码折叠
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    matchBrackets: true,	//括号匹配
    //readOnly: true,        //只读
});
code_in.setSize('500px','570px'); //宽 高

$('.run-code').click(function(){
    $.ajax({
        type: 'POST',
        url: 'http://47.97.205.240:8800',
        data: {
            id: '123',
            code: code_in.getValue()
        },
        success: function(data){
            $('.result').empty()
            if (data.result != ''){
                html = data.result.split('\n').map(a=>'<p>' + a + '</p>').join('\n')
                
            } else if (data.error != '') {
                html = data.error.split('\n').map(a=>'<p>' + a + '</p>').join('\n')
            }
            $('.result').append(html)
        }   
    })
})