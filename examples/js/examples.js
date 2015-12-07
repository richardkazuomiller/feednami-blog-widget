(function(){
  
  if(window.addEventListener){
    window.addEventListener('load',load)
  }
  else{
    window.attachEvent('onload',load)
  }
  function load(){
    feednamiBlogWidget.load(document.getElementById('sasaki-filtered'),{
      filter: function(entry){
        return entry.title.indexOf('PR:') != 0
      }
    })
  }
})();