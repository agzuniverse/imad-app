function requester(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readystate==XMLHttpRequest.DONE && request.status==200){
            counter=request.responseText();
            document.getElementById('count').innerHTML=counter.toString();
        }
    }
    
    request.open('GET','http://aswinganesh666.imad.hasura-app.io/count',false);
    request.send();
}