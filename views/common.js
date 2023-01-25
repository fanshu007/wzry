$(() => {

   // 获取用户信息
    const getUserinfo = ()=>{
        $.get({
          url:"getUserinfo",
          success(res){
            if(res.msg==='未登录'){
              location = 'login.html'
            } else {
              const html =`
              <p class="navbar-text navbar-right " style="font-weight: 700">
                  欢迎 【${res.userName}】登录
                  <a href="#" class="logout">退出</a>
                </p>
              `;
              $('#bs-example-navbar-collapse-1').html(html);
            }
          }
        })
      }
      getUserinfo()
  // 点击-退出
  $("#bs-example-navbar-collapse-1").on("click", ".logout", () => {
    $.get({
      url: "logout",
      success(res) {
        if (res.status == "success") {
          location = "login.html?returnUrl="+location.href.split(location.port+'/')[1];
        }
      },
    });
  });

});
