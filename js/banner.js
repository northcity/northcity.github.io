(function(){
    var bannerWrap = document.querySelector('.banner-wrap'),
        banner = bannerWrap.querySelector('.banner');
        banner.addEventListener('mousemove', function(e){
            var centerX = banner.offsetLeft + banner.offsetWidth / 2,
                centerY = banner.offsetTop + banner.offsetHeight / 2;        
            var deltaX = e.pageX - centerX,
                deltaY = e.pageY - centerY;
            var percentageX = deltaX / centerX,
                percentageY = deltaY / centerY;
            var deg = 10;
            this.style.transform = 'rotateX(' + percentageY * -deg + 'deg)' 
                                    + 'rotateY(' + percentageX * deg + 'deg)';
        });
        banner.addEventListener('mouseleave', function(e){
            this.style.transform = '';
        })    
})();