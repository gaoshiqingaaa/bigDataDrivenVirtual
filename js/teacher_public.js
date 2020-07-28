var code_in = CodeMirror.fromTextArea(document.getElementById("code-in"), {
    mode: {
        name: 'python'
    },
    // lineNumbers: true,	//显示行号
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
    // lineNumbers: true,	//显示行号
    theme: "idea",	//设置主题
    lineWrapping: true,	//代码折叠
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    matchBrackets: true,	//括号匹配
    //readOnly: true,        //只读
});

code_out.setSize('550px','510px');