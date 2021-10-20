function showData(str){
    if(str !== ""){
        $.ajax({
            url: "/a",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({NameData: str}),
            success: function(result){
                console.log(result);
                $('#myDiv').html(result.html);
            },
            error: function(err){
              console.log(err.status);
            }
          });
        
    }
}