(function(){
  window.feednamiBlogWidget = {}
  feednamiBlogWidget.load = function(element,options){
    if(window.feednami){
      if(element.classList){
        element.classList.add('loading')
      }
      var url = element.getAttribute('data-url')
      var loader = new BlogLoader(element,url,options)
      loader.load()
    }
    else{
      addLoadCallback(function(){
        feednamiBlogWidget.load(element,options)
      })
    }
  }
  feednamiBlogWidget.formatDate = function(date){
    var year = date.getYear()
    if(year < 1900){
      year += 1900
    }
    var month = date.getMonth()+1
    var day = date.getDate()
    var hour = date.getHours()
    var minutes = date.getMinutes()
    if(minutes < 10){
      minutes = '0' + minutes
    }
    return year + '/' + month + '/' + day + ' ' + hour + ':' +minutes
  }
  
  var loadCallbacks = []
  
  function addLoadCallback(callback){
    loadCallbacks.push(callback)
  }
  
  function init(){
    if(window.addEventListener){
      window.addEventListener('load',preload)
    }
    else{
      window.attachEvent('onload',preload)
    }
  }
  
  function preload(){
    if(window.feednami){
      load()
    }
    else{
      var script = document.createElement('script')
      script.src = 'https://storage.googleapis.com/feednami-static/js/feednami-client-v1.0.1.js'
      script.onload = script.onreadystatechange = load
      document.body.appendChild(script)
    }
  }

  function load(){
    if ( !feednamiBlogWidget.loaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
      feednamiBlogWidget.loaded = true              
      widgetDivs = document.querySelectorAll('.feednami-blog-widget')
      for(var i = 0; i < widgetDivs.length; i++){
        var element = widgetDivs[i]
        feednamiBlogWidget.load(element)
      }
      for(var i = 0; i < loadCallbacks.length; i++){
        var callback = loadCallbacks[i]
        callback()
      }
      loadCallbacks = []
    }
  }
  
  init()
  
  function BlogLoader(rootElement,url,options){
    this.rootElement = rootElement
    this.url = url
    if(options){
      if(options.filter){
        this.filter = options.filter
      }
    }
  }
  
  BlogLoader.prototype.filter = function(entry){
    return true;
  }
  
  BlogLoader.prototype.load = function(){
    var self = this
    
    var url = self.url
    
    feednami.load(url,function(res){
      self.res = res
      if(res.feed && res.feed.entries){
        self.appendEntries()
      }
    })
  }
  
  BlogLoader.prototype.appendEntries = function(){
    var self = this
    
    self.innerElement = document.createElement('div')
    self.innerElement.className = 'inner'
    self.rootElement.appendChild(self.innerElement)
    
    var limit = self.rootElement.getAttribute('data-limit') || Infinity
    
    if(this.res && this.res.feed && this.res.feed.entries){
      var　entries = this.res.feed.entries
      for(var i = 0; i < entries.length && i < limit; i++){
        var entry = entries[i]
        self.appendEntry(entry)
      }
    }
  }
  
  BlogLoader.prototype.appendEntry = function(entry){
    var self = this
    
    var shouldAppend = this.filter(entry)
    if(shouldAppend){
      var anchor = document.createElement('a')
      anchor.href = entry.link
      anchor.target = '_blank'
      
      var entryContainer = document.createElement('div')
      entryContainer.className = 'entry-container'
      anchor.appendChild(entryContainer)
      
      var entryDiv = document.createElement('div')
      entryDiv.className = 'entry'
      entryContainer.appendChild(entryDiv)
      
      var titleContainer = document.createElement('div')
      titleContainer.className = 'title-container'
      entryDiv.appendChild(titleContainer)
      
      var titleElement = document.createElement('span')
      titleElement.classname = 'title'
      titleElement.innerHTML = entry.title
      titleContainer.appendChild(titleElement)
      
      var dateString = feednamiBlogWidget.formatDate(new Date(entry.pubdate_ms))
      
      var dateContainer = document.createElement('div')
      dateContainer.className = 'date-container'
      entryDiv.appendChild(dateContainer)
      
      var dateElement = document.createElement('span')
      dateElement.className = 'date'
      dateElement.innerHTML = dateString
      dateContainer.appendChild(dateElement)
      
      self.innerElement.appendChild(anchor)
    }
    
    
  }
  
})();