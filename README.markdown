
Bar Fly
=======

A flyweight bar chart plug-in for jQuery.  Bar Fly supports
multiple data sets and can animate the transition between sets.

Bar Fly is only 3 KB when minified.  It draws charts using only
CSS so it can be used in browsers without Flash or Canvas support.

Bar Fly's only requirement is jQuery, v1.3 or newer.  The jQuery
easing plug-in can be used for smoother animation:

 * jQuery: <http://jquery.com/>
 * easing: <http://gsgd.co.uk/sandbox/jquery/easing/>

Bar Fly is intentionally minimal and won't be appropriate for
everyone.  For a more complete graphing solution, check out
flot or jqPlot:

 * flot:   <http://code.google.com/p/flot/>
 * jqPlot: <http://code.google.com/p/jqplot/>


Usage
-----

Include the Bar Fly plug-in after jQuery:

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.barfly-1.0.min.js"></script>

Select an element and create a chart:

    $('#foo').barfly({ data: [1,2,3,4,5,6,7,8,9] });

There are a variety of configuration options available:

 * `data` - {Array, Object}
 
   > One or more lists of data to chart.  If an
   > Array is provided, its value will be used and
   > the chart will be created in "single set" mode.
   > If an Object is provided, it should contain
   > a single level of key - Array mappings.  The
   > keys will be used as aliases for the Arrays
   > of data.
 
 * `active` - {String}
 
   > (Optional)
   > If multiple data sets are being used, this
   > defines which one will be active initially.
 
 * `range` - {Array, Object}
 
   > (Optional)
   > Sets the bounds of the chart.  It can
   > be specified as an Array of minimum and maximum
   > values (`[0, 230]`) or an Object with "max" and
   > "min" keys (`{min: 0, max: 230}`).  If an Object
   > is used, the "min" key is optional and if omitted
   > will be set to 0.
 
 * `barSpacing` - {Integer}
 
   > (Optional)
   > Defines the amount of spacing added to each
   > side of the bars in the chart (in pixels).
   > So a chart with a `barSpacing` of 2 would have
   > 4 pixels in between any 2 adjacent bars.
 
 * `chartStyle` - {Object}
 
   > (Optional)
   > CSS styles that will be applied to the chart
   > element.  These styles will be the last ones
   > applied to the chart, giving them the highest
   > precedence.  CSS rules can be specified in
   > camel case or hyphenated.
 
 * `barStyle` - {Object}
 
   > (Optional)
   > CSS styles that will be applied to the bar
   > elements.  These styles take precedence over
   > the defaults but can be overridden by the
   > data styles.  CSS rules can be specified in
   > camel case or hyphenated.
 
 * `dataStyle` - {Object}
 
   > (Optional)
   > CSS styles that will be applied to the bar
   > elements for a data set.  If the chart is
   > using multiple data sets, this will be an
   > Object with an entry for each data set to be
   > customized with the data set id as the key
   > and an Object containing the CSS rules as
   > the value.  If the chart is using a single
   > data set, this parameter should just be an
   > Object containing the CSS rules.  These
   > styles will be the last ones applied to the
   > bars, giving them the highest precedence.
   > CSS rules can be specified in camel case
   > or hyphenated.
 
 * `animation` - {Object, false}
 
   > (Optional)
   > Defines the animation used to transition between data sets.
   > Example: `{duration: 800, easing: "linear"}`
   > If set to `false`, no animation will be used for the chart.
 

When there are multiple charts on a page, some common
settings can be specifed through `$.barflyDefaults`:

 * `chartWidth` - {Integer}
 
   > When the chart is created, Bar Fly will try to
   > retain the dimensions of its DOM element.  However,
   > if that DOM element has a 0 width, this setting will
   > be used.  Essentially, it functions as a *min-width*.
   > It should be an Integer and will define the width
   > in pixels.  This is a safety valve and shouldn't
   > really be used for chart customization.  For chart
   > styling, use the `chartStyle` parameter in the
   > Bar Fly defaults or in the chart's configuration.
 
 * `chartHeight` - {Integer}
 
   > When the chart is created, Bar Fly will try to
   > retain the dimensions of its DOM element.  However,
   > if that DOM element has a 0 height, this setting will
   > be used.  Essentially, it functions as a *min-height*.
   > It should be an Integer and will define the height
   > in pixels.  This is a safety valve and shouldn't
   > really be used for chart customization.  For chart
   > styling, use the `chartStyle` parameter in the
   > defaults or in the chart's configuration.
 
 * `chartStyle` - {Object}
 
   > CSS styles that will be applied to every chart
   > element.  These styles will be the first ones
   > applied to the chart, giving them a precedence
   > lower than the `chartStyle` configuration parameter
   > but higher than any styles from the HTML page or
   > included stylesheets.  CSS rules can be specified
   > in camel case or hyphenated.
 
 * `barStyle` - {Object}
 
   > CSS styles that will be applied to all bar
   > elements in all charts.  These styles will be
   > the first ones applied to the bars, giving them
   > a precedence lower than the `barStyle` configuration
   > parameter but higher than any styles from the
   > HTML page or included stylesheets.  CSS rules can
   > be specified in camel case or hyphenated.
 
 * `animation` - {Object, false}
 
   > Default animation configuration for all charts.
   > Will be overridden by the `animation` configuration
   > parameter.  If set to `false`, all animations will
   > be disabled.  Otherwise, should be set to an Object
   > defining the `duration` and `easing` values.
   > Example: `{duration: 800, easing: "linear"}`
 

Once a Bar Fly chart has been created, it can be controlled
or queried through its public methods:

 * `activate(name)` - name: {String}; returns: {void}
 
   > Activates the data set identified by `name`.
 
 * `addData(data)` - data: {Object}; returns: {void}
 
   > Adds one or more new data sets to the chart.  `data`
   > should be an Object mapping name(s) to Array(s) of
   > values.  Example: `{alpha: [1, 2, 3], beta: [5, 6, 7]}`
 
 * `draw()` - returns: {void}
 
   > Force a redraw of the chart.
 
 * `listData()` - returns: {Array}
 
   > Returns a list of data set names
 

Before the public methods of a chart can be called, the
chart object must be retrieved.  Accessing the Bar Fly
chart instance can be accomplished in two ways:

 * `$('#foo').data('barfly')`
 
   > Bar Fly stores the chart instance as `barfly` in
   > the element's data storage.
 
 * `$.barfly('#foo')`
 
   > Bar Fly provides a global helper that makes it
   > easier to access the chart instance.


A Bar Fly chart will trigger events at various points
in its lifecycle.  See the examples for 

 * `barfly.activate` - event: {Event}, name: {String}
 
   > Triggered when a data set is activated.  Listener
   > will receive 2 parameters: the Event and the name
   > of the currently active data set.
 
 * `barfly.added` - event: {Event}, name: {String}
 
   > Triggered when a data set is added.  Listener
   > will receive 2 parameters: the Event and the name
   > of the newly added data set.
 
 * `barfly.drawn` - event: {Event}, name: {String}, isAnimated: {Boolean}
 
   > Triggered whenever the chart is drawn.  Listener
   > will receive 3 parameters: the Event, the name of
   > the data set that was drawn, and a Boolean flag
   > indicating whether or not the drawing was animated.
 

Tutorial
--------

Check out the [Bar Fly tutorial][1] for an introduction to jQuery
plug-in development as well as an examination of the Bar Fly code.

[1]: http://9astronauts.com/articles/javascript-tutorial-create-a-bar-chart-plug-in-for-jquery


Support
-------

 * Homepage:      <http://9astronauts.com/code/jquery/barfly/>
 * Issue Tracker: <http://github.com/mikedemers/jquery-barfly/issues>
 * Source Code:   <http://github.com/mikedemers/jquery-barfly/tree>


License
-------

Bar Fly is distributed under the MIT License:

Copyright (c) 2009 Mike Demers, http://9astronauts.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
