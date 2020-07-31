var code_in = CodeMirror.fromTextArea(document.getElementById("code-in"), {
    mode: {
        name: 'python'
    },
    lineNumbers: true,
    theme: "idea",	//设置主题
    lineWrapping: true,	//代码折叠
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    matchBrackets: true,	//括号匹配
    //readOnly: true,        //只读
});
code_in.setSize('500px','570px'); //宽 高

var code_out = CodeMirror.fromTextArea(document.getElementById("code-out"), {
    mode: {
        name: 'python'
    },
    // lineNumbers: true,
    theme: "idea",	//设置主题
    lineWrapping: true,	//代码折叠
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    matchBrackets: true,	//括号匹配
    readOnly: true,        //只读
});
code_out.setSize('500px','570px'); //宽 高


$('.run-code').click(function(){
    $.ajax({
        type: 'POST',
        url: 'http://47.97.205.240:8800/code',
        data: {
            user: '123',
            step: '1',
            code: code_in.getValue()
        },
        success: function(data){
            $('.result').empty()
            result = data.error == ''? data.result: data.error
            code_out.setValue(result)
        }   
    })
})