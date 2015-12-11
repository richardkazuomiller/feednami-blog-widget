# Feednami Blog Widget

This tool uses [Feednami](https://feednami.com/) to fetch an RSS feed and display its contents in a browser

## How to use

Example source can be found [here](https://github.com/richardkazuomiller/feednami-blog-widget/tree/master/examples) or seen on [feednami.com](https://feednami.com/static/feednami-blog-widget/examples/index.html)

### Import 

    <script src="https://cdn.rawgit.com/richardkazuomiller/feednami-client/master/releases/1.0.1.min.js"></script>
    <script src="https://cdn.rawgit.com/richardkazuomiller/feednami-blog-widget/master/releases/1.0.0.min.js"></script>

If you don't load the [Feednami](https://feednami.com/) script, the widget will load it but you should include it for maximum efficiency.

### Add a container for your feed.

    <div class="feednami-blog-widget" data-url="<my feed url>"></div>
    
`<my feed url>` should be the __absolute__ (that means including `https://` in front) URL of the RSS feed you want to load. The widget will load the feed for any div with the class `feednami-blog-widget`.

### Style your widget.

There is no default CSS included with the widget. You can use the CSS in the [examples](https://github.com/richardkazuomiller/feednami-blog-widget/tree/master/examples), but you probably want it to have the same look and feel as the rest of your site. After the container is filled it will look something like this:

    <div class="feednami-blog-widget" data-url="http://blogs.un.org/feed/">
      <div class="inner">
        <a href="http://blogs.un.org/blog/2015/10/09/turn-the-world-unblue/" target="_blank">
          <div class="entry-container">
            <div class="entry">
              <div class="title-container">
                <span>Turn the world #UNBlue</span>
              </div>
              <div class="date-container">
                <span class="date">2015/10/10 2:07</span>
              </div>
            </div>
          </div>
        </a>
        ...and more entries wrappend in an <a> tag
      </div>
    </div>
    
The classes `inner`, `entry-container`, `entry`, `title-container`, `date-container`, and `date` will be available so you can add the CSS you need.

## Loading after `window.onload`

Elements with the class `feednami-blog-widget` are filled in when the window loads. If you want to load feeds after that, you can do so by using `feednamiBlogWidget.load(element,options)`.

    <div class="blog" id="my-blog" 
      data-url="http://site.com/myrss"></div>
    
    <script>
      feednamiBlogWidget.load(document.getElementById('my-blog'))
    </script>

Make sure the element __does not__ have the class `feednami-blog-widget` in this case.

## Working with the contents of the feed.

There some situations in which you may want to do something to the feed data before showing it.

### Format the date

The default date format is `YYYY/MM/DD HH:mm`. If you want to use a different format you can use it by overwriting `feednamiBlogWidget.formatDate(date)`.

    feednamiBlogWidget.formatDate = function(date){
      //return just the month and day
      var month = date.getMonth()+1
      var day = date.getDate()
      
      return month + '/' + day
    }
    
### Don't show certain posts

You may not want to show every entry in the feed. You can hide certain entries by implementing `options.filter` when calling `feednamiBlogWidget.load(element,options)`

This feed has an ad in the middle that I don't want to show:

    <div class="blog" id="sasaki-filtered" 
      data-url="http://feedblog.ameba.jp/rss/ameblo/sasaki-sd"></div>
    
Ads have the text "PR:" at the beginning, so I can easily hide them by checking the contents of the title.

    feednamiBlogWidget.load(document.getElementById('sasaki-filtered'),{
      filter: function(entry){
        //return true to show, false not to show
        return entry.title.indexOf('PR:') != 0
      }
    })