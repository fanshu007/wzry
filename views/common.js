$(() => {

   // 获取用户信息
    const getUserinfo = ()=>{
        $.get({
          url:"getUserinfo",
          success(res){
            if(res.msg==='未登录'){
              location = 'login.html'
            } else {
              $('#bs-example-navbar-collapse-1 p strong').text(res.userName);
            }
          }
        })
      }
      getUserinfo()
  // 点击-退出
  $("#bs-example-navbar-collapse-1").on("click", ".logout", () => {
    if(confirm("陛下,您真的要退出吗?")){
    $.get({
      url: "logout",
      success(res) {
        if (res.status == "success") {
          location = "login.html?returnUrl="+location.href.split(location.port+'/')[1];
        } else {
          alert('登出失败')
        }
      },
    });
    }
  });

});
