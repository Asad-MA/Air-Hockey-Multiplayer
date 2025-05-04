jQuery(document).ready(function($){
    console.log("Global Loaded!");
    const OVERLAY = $('.overlay');

    OVERLAY.on('click' , function(){
        console.log('.');
        $(this).siblings('.active').removeClass('active');
    });
})