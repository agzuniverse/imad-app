function requester(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        console.log("state changed!")
        if(request.readyState==XMLHttpRequest.DONE && request.status==200){
            console.log("USER LOGGED IN");
            alert("success!");
        }
    }
    
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    request.open('POST','http://aswinganesh666.imad.hasura-app.io/login',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
}