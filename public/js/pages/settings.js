jQuery(document).ready(function($){

    const removeAvatar = $('.remove-avatar');
    const editAvatar = $('.update-avatar');
    const avatarPopup = $('.avatars-popup')
    const saveEdits = $('.update-settings');
    const overlay = $('.popup-overlay');
    const avatarItem = $('.avatar-item');
    const updateAvatarBtn = $('.update-avatar-btn');


    editAvatar.on('click' , function(){
        avatarPopup.addClass('active');
    });

     overlay.on('click' , function(){
         avatarPopup.removeClass('active');
    });


    removeAvatar.on('click' , function(){
        $('.player-avatar img').attr('src' , '');
    });


     avatarItem.on('click' , function(){
         avatarItem.removeClass('selected');
        $(this).addClass('selected');
         
    });

    updateAvatarBtn.on('click' , function(){
        let avatar = $('.avatar-item.selected').attr('data-url');
        $('.player-avatar img').attr('src' , avatar);
        avatarPopup.removeClass('active');
    })

    
$('.update-settings').on('click', function () {
  const newPassword = $('#newPassword').val();
  const confirmPassword = $('#confirmPassword').val();

  const data = {
    displayName: $('input[placeholder="Display name"]').val(),
    email: $('input[placeholder="Email address"]').val(),
    avatar: $('.player-avatar img').attr('src')
  };

  if (newPassword.trim() && confirmPassword.trim()) {
    data.newPassword = newPassword;
    data.confirmPassword = confirmPassword;
  }

  $.ajax({
    url: '/api/user/update-settings',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (response) {
      alert('Settings updated successfully!');
    },
    error: function (err) {
      alert(err.responseJSON?.message || 'Error updating settings.');
    }
  });
});




});
