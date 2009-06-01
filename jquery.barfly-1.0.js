/*
 * Bar Fly - A flyweight bar chart plug-in for jQuery.
 * 
 * Supports multiple data sets and animated transitions.
 * 
 * Copyright (c) 2009 Mike Demers
 * <http://9astronauts.com/code/jquery/barfly/>
 * 
 * Released under the MIT License (MIT-LICENSE)
 * 
 * History:
 * 
 *   v1.0 - [2009.05.01] Initial Release
 * 
 */
(function ($) {
    
    // Create a new chart in +domNode+ with the given
    // +options+.  domNode can be a unique selector or
    // a jQuery element.
    //
    function BarFly(domNode, options) {
        this._el = $(domNode);
        this._init(options || {});
        this.draw();
    }
    
    BarFly.prototype = {
        
        // Activates (displays) the specified data set
        //
        activate: function(dataId) {
            if (this._isMultiset && this._setActiveData(dataId)) this.draw();
        },
        
        // Add a data set to the chart.  This is a no-op if
        // the barchart was created in "single set" mode (the
        // "data" parameter was an Array of values rather than
        // an Object).
        // data can be an Array of values (if none was given
        // when the chart was created)
        // 
        //   addData([1, 2, 3, 4])
        // 
        // or data can be an Object containing one or more
        // data sets:
        // 
        //   addData({setA: [1, 2, 3], setB: [4, 5, 6]})
        // 
        addData: function(data) {
            if ($.isArray(data)) {
                if (this._isMultiset == null) {
                    this._isMultiset = false;
                    this._addDataSet("1", data);
                }
            } else if (this._isMultiset != false) {
                this._isMultiset = true;
                var self = this;
                $.each(data, function(i, ds) { self._addDataSet(i, ds); });
            }
        },
        
        // Redraws the chart.
        //
        draw: function() {
            if (!this._activeSet) return false;
            if (!this._barEls) this._setupDom();
            var self = this,
                data = this._dataSets[this._activeSet],
                dataStyle = this._getDataStyle(),
                barStyle = {},
                barScale = this._el.innerHeight() / (this._dataRangeMax - this._dataRangeMin);
            
            if (this._animation) this._barEls.stop();
            
            this._barEls.each(function(i) {
                barStyle.height = Math.max(0,Math.floor((data[i] - self._dataRangeMin) * barScale - self._barPadH))+'px';
                if (self._animation) {
                    $(this).css(dataStyle).animate(barStyle, self._animation.duration, self._animation.easing);
                } else {
                    $(this).css(dataStyle).css(barStyle);
                }
            });
            this._el.trigger('barfly.drawn', [ this._activeSet, !!this._animation ]);
        },
        
        // Returns the list of data set names.
        //
        listData: function() {
            var dataIds = [];
            for (var id in this._dataSets) dataIds.push(id);
            return dataIds;
        },
        
        // Add the given data set to the chart.  If no
        // range was provided when the chart was created,
        // the calculated range will be adjusted to fit
        // this new data, if necessary.  All data sets
        // must have the same number of elements.
        //
        _addDataSet: function(dataId, data) {
            var id = dataId.toString();
            this._dataSets[id] = data;
            if (!this._activeSet) this._setActiveData(id);
            if (!this._isBounded) {
                for (var i=0,n=data.length; i<n; ++i) {
                    if ((this._dataRangeMax == null) || (this._dataRangeMax < data[i]))
                        this._dataRangeMax = data[i];
                    if ((this._dataRangeMin == null) || (this._dataRangeMin > data[i]))
                        this._dataRangeMin = data[i];
                }
            }
            this._el.trigger('barfly.added', [ dataId ]);
        },
        
        // Retrieves the custom style for the currently
        // active data set, if available.
        //
        _getDataStyle: function() {
            var id = this._isMultiset ? this._activeSet : "1";
            return $.extend({}, this._barStyle, this._dataStyles[id] || {});
        },
        
        // Initialize a new BarFly instance with the given
        // options.  Called from the constructor when a new
        // chart is created
        //
        _init: function(options) {
            this._dataSets = {};
            this._dataStyles = {};
            this._initAnimation(options);
            if (options.range) this._setRange(options.range);
            if (options.data) this.addData(options.data);
            if (options.active) this._setActiveData(options.active);
            this._barSpacing = (options.barSpacing) ? parseInt(options.barSpacing) : 0;
            this._setChartStyle(options.chartStyle);
            this._setBarStyle(options.barStyle);
            if (options.dataStyle) this._setDataStyles(options.dataStyle);
        },
        
        // Initializes the animation parameters based on the
        // given options and the global defaults.
        //
        _initAnimation: function(options) {
            if (typeof options.animation == "object") {
                this._animation = $.extend({}, options.animation);
            } else if ($.barflyDefaults.animation && options.animation != false) {
                this._animation = $.extend({}, $.barflyDefaults.animation);
            } else {
                this._animation = false;
            }
        },
        
        // Finds the data set identified by dataId
        // and makes it active.  If there is no such
        // data set or if it's already active, this
        // will return false
        //
        _setActiveData: function(dataId) {
            var id = dataId.toString();
            if (!this._dataSets[id] || this._activeSet == id) return false;
            this._activeSet = id;
            this._el.trigger('barfly.activate', [ id ]);
            return id;
        },
        
        // Sets the base CSS style for the bars in the
        // chart based on the defaults and the given style.
        //
        _setBarStyle: function(style) {
            this._barStyle = $.extend({}, this._baseBarStyle, $.barflyDefaults.barStyle, (style || {}));
        },
        
        // Sets the CSS style for the chart based on the
        // defaults and the given style object.
        //
        _setChartStyle: function(style) {
            this._chartStyle = $.extend({}, this._baseChartStyle, $.barflyDefaults.chartStyle, (style || {}));
        },
        
        // Sets up the CSS styles for the individual data sets
        // in the chart based on the provided style(s).
        //
        _setDataStyles: function(style) {
            this._dataStyles = {};
            if (this._isMultiset) {
                for (var id in style)
                    this._dataStyles[id] = $.extend({}, style[id] || {});
            } else {
                this._dataStyles["1"] = $.extend({}, style);
            }
        },
        
        // Sets the bounds for the chart.
        // The range can be an Array of min and max values:
        // 
        //   _setRange([0, 100])
        // 
        // Or the range can be an Object containing the min
        // and max values:
        // 
        //   _setRange({min: 12, max: 38})
        // 
        // If min is omitted, it will default to 0:
        // 
        //   _setRange({max: 300})
        // 
        _setRange: function(range) {
            if ($.isArray(range)) {             // range: [0, 73]
                this._dataRangeMin = range[0];
                this._dataRangeMax = range[1];
            } else {                            // range: {min: 0, max: 73}
                this._dataRangeMin = range.min || 0;
                this._dataRangeMax = range.max;
            }
            this._isBounded = true;
        },
        
        // Initialize the DOM elements for the chart
        //
        _setupDom: function() {
            var self = this,
                _el = this._el,
                data = this._dataSets[this._activeSet],
                dataSize = data.length,
                dataStyle = this._getDataStyle(),
                barStyle = $.extend({}, this._barStyle);
            
            // setup the chart container element
            _el.addClass('barflyChart').css(this._chartStyle);
            if (_el.width() == 0) _el.width($.barflyDefaults.chartWidth);
            if (_el.height() == 0) _el.height($.barflyDefaults.chartHeight);
            
            // create the bar elements and insert into container
            var barCode = [];
            for (var i=0; i<dataSize; ++i) barCode.push('<div class="barflyBar"></div>');
            _el.append(barCode.join(""));
            this._barEls = $('div.barflyBar', _el);
            
            // use first bar to figure out the box "padding"
            barStyle.left = '0';
            var x = this._barEls.eq(0).css(dataStyle).css(barStyle).width(0).height(0);
            this._barPadW = x.outerWidth();
            this._barPadH = x.outerHeight();
            
            // resize and position the bar elements inside the chart
            var barScale = _el.innerWidth() / dataSize,
                barSpacing = this._barSpacing;
            barStyle.bottom = (this._barPadH > 0) ? (0 - Math.floor(this._barPadH / 2))+'px' : 0;
            this._barEls.css(dataStyle).each(function(i) {
                var thisLeft = Math.floor(i * barScale + barSpacing),
                    nextLeft = Math.floor((i + 1) * barScale + barSpacing);
                barStyle.left = thisLeft+'px';
                barStyle.width = (nextLeft - thisLeft - self._barPadW - 2 * barSpacing)+'px';
                $(this).addClass('barflyBar'+i).css(barStyle);
            });
        },
        
        // The minimum CSS styles required for proper bar display
        //
        _baseBarStyle: { "position": "absolute", "display": "block" },
        
        // The minimum CSS styles required for proper chart display
        //
        _baseChartStyle: { "position": "relative", "display": "block", "overflow": "hidden" },
        
        _activeSet: null,
        _animation: null,
        _barEls: null,
        _el: null,
        _dataRangeMin: null,
        _dataRangeMax: null,
        _dataSets: null,
        _isBounded: null,
        _isMultiset: null,
        _barStyle: null,
        _chartStyle: null,
        _dataStyles: null
    };
    
    // Register the `barfly` method in the jQuery element
    // object.  Only creates a chart in an element once.
    // Subsequent calls on the same element will be ignored.
    //
    $.fn.barfly = function(options) {
        return this.each(function() {
            var el = $(this);
            if (!el.data('barfly'))
                el.data("barfly", new BarFly(this, options));
        });
    };
    
    // Default configuration values for all Bar Fly charts.
    //
    $.barflyDefaults = {
        chartStyle: {
            "backgroundColor": "#eeeeee",
            "borderWidth": "1px",
            "borderColor": "#666666",
            "borderStyle": "solid"
        },
        chartWidth: 400,
        chartHeight: 100,
        barStyle: {
            "backgroundColor": "#999999",
            "borderWidth": "1px",
            "borderColor": "#666666",
            "borderStyle": "solid"
        },
        animation: { duration: 500, easing: "linear" }
    };
    
    // Global helper.  Slightly easier than having
    // to access the "barfly" data value direclty.
    // 
    //   // Create a barfly chart:
    //   
    //   $('#my_chart').barfly({data: {one: [1,2,3,4,5], two: [4,5,3,1,2]}});
    //   
    //   // Now the helper can be used to access
    //   // and interact with the chart instance:
    //   
    //   $.barfly('#my_chart').activate('two');
    // 
    $.barfly = function(el) {
        return $(el).eq(0).data('barfly');
    };
    
})(jQuery);
