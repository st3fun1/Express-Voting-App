$(function(){
   
    //Add new poll option
    var optionsCount = 3;
    $('.add-poll-btn').click(function(e){
          e.preventDefault();
          optionsCount++;
          var option = `<div class="form-group">
                <label for="option3">Option ${optionsCount}</label>
                <input type="text" class="form-control" id="option${optionsCount}" placeholder="${'Insert an option'}" name="option${optionsCount}">
            </div>`;
         $(this).before(option);
    });
    
});