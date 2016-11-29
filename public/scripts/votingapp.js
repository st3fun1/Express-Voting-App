$(function(){
    /*var optionsCount = 3;*/
    //Add new poll option
    
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
    $('#delete-poll').click(function(e){
       var deletePollCheck = $('.checkbox input').is(':checked');
        console.log($('.checkbox input[type="checkbox"]'));
        console.log(deletePollCheck);
       if(deletePollCheck){
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
       } else {
           return false;
       }
    });
    
    //Edit poll page
    $('#add-option').click(function(e){
        e.preventDefault();
        var optionsCount = $('#updatePoll input.form-control').length;
        console.log(optionsCount);
        optionsCount++;
        var option =`<div class="form-group">
                <label class="col-sm-2" for="option${optionsCount}">Option${optionsCount}</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="option${optionsCount}" placeholder="${'Insert an option'}" name="option${optionsCount}" required>
                </div>
        </div>`;
        $('#updatePoll .form-btns').before(option);
    });
    
    $('#delete-option').click(function(e){
       e.preventDefault();
       var optionsCount = $('#updatePoll input.form-control').length;
       var dbOptionsCount = $('#updatePoll').attr('data-optionsCount');
       if(optionsCount != dbOptionsCount){
         $('#updatePoll .form-btns').prev().remove();
         return true;
        }
        return false;
       
    });
    
    $('#update-poll').click(function(e){
        e.preventDefault();
           $.ajax({
               type: 'POST',
               data: $('#updatePoll').serialize(),
               url: $('#updatePoll').attr('action'),
               success: function(){
                   console.log('success')
               },
               error: function(){
                   console.log('fail')
               }
           }).done(function(data){
               $('.message').html(data.message).css({'visibility':'visible'});
           });
    })
    
});