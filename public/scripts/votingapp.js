$(function(){
   
    //Add new poll option
    var optionsCount = 3;
    //user profile page- action = add new option to poll
    $('.add-poll-btn').click(function(e){
          e.preventDefault();
          optionsCount++;
          var option = `<div class="form-group">
                <label for="option3">Option ${optionsCount}</label>
                <input type="text" class="form-control" id="option${optionsCount}" placeholder="${'Insert an option'}" name="option${optionsCount}">
            </div>`;
         $(this).before(option);
    });
    
    // edit-poll page - action = delete
    $('.delete-poll-btn').click(function(e){
       $.ajax({
           type: 'POST',
           url: $(this).parent().attr('action'),
           success: function(){
               console.log('The poll has been deleted succesfuly!');
           },
           error: function(){
               console.log('Failed operation!')
           }
       });
    });
    
});