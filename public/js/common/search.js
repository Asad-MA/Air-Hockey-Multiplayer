import { NotificationManager } from "../modules/notificationManager.js";

const searchInput = document.getElementById('searchInput');
const resultList = document.getElementById('resultList');

let debounceTimer;
let notification = new NotificationManager();
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const query = searchInput.value.trim();

    if (query.length === 0) {
      resultList.innerHTML = '';
      resultList.classList.remove('active');
      return;
    }

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const users = await response.json();

      resultList.innerHTML = users.map(user => `<li data-username="${user.name}" data-useremail="${user.email}" class="text-sm p-10 d-flex align-center gap-10 justify-between">
        <div class="d-flex align-center gap-20"><span class="user-avatar-sm bg-gray box-rounded"></span>${user.name}</div>
        <span class="text-gray d-flex align-center gap-20"><i data-action="friend-request" class="fa-solid fa-user-plus"></i><i class="fa-solid fa-gamepad"></i></span></li>`).join('');

        resultList.classList.add('active');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, 300); // 300ms debounce
});

jQuery(document).ready(function($){

  var addFriend = $('[data-action="friend-request"]');

  $(document).on('click' , '[data-action="friend-request"]' , async function(){
    var to = $(this).closest('li').attr('data-useremail')
      console.log();
     
      try {
        const response = await fetch('/socail/add-friend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ to })
        });
      
        const data = await response.json();
          if(!data.success) throw new Error(data.message);
          notification.push('Done',`${data.message}`, { type: 'success', duration: 10000 });
        
      } catch (e) {
        notification.push(`Error`,e.message, { type: 'error', duration: 10000 });
      }
      
        
     
      
  })


})