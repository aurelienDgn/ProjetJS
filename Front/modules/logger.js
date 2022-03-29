let logger = (function(){

    function postLog(username) {
        console.log('username :', username);
        $.ajax({
            type: "POST",
            url: "/signin",
            data: {
                login: username,
            },
            success: () => {
                if(window.location.pathname === '/'){
                    window.location.href="/waitingRoom";
                }
                else if(window.location.pathname === '/signin' || window.location.pathname === '/signup'){
                    window.location.href="/";
                }
            },
        });
    }

    return {
        sendLogin(username) {
            postLog(username);
        }
    }
})();