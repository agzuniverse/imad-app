function requester(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        console.log("state changed!")
        if(request.readystate==XMLHttpRequest.DONE && request.status==200){
            console.log("request done succesfully");
            counter=request.responseText();
            document.getElementById('count').innerHTML=counter.toString();
        }
    }
    
    request.open('GET','http://aswinganesh666.imad.hasura-app.io/count',true);
    request.send();
}