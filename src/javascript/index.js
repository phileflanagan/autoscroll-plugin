(function() {
    window.AutoScroll2 = function(el, options) {
        this.el = el;
        this.speed = null;

        var defaults = {
            scrollDistancePerSecond: 10,
            pauseBottom: 500,
            pauseStart: 500
        };

        if (options && typeof options === 'object') {
            this.options = extendDefaults(defaults, arguments[0]);
        } else {
            this.options = defaults;
        }
        console.log('options', this.options);

        _init.call(this);
    }

    AutoScroll2.prototype.startScroll = function() {
        console.log('start')
    }

    AutoScroll2.prototype.pauseScroll = function() {
        console.log('pause')
    }

    AutoScroll2.prototype.resetScroll = function() {
        console.log('reset')
    }

    AutoScroll2.prototype.mobileTouchStart = function() {
        console.log('mobile start')
    }

    AutoScroll2.prototype.mobileTouchEnd = function() {
        console.log('mobile end');
    }

    AutoScroll2.prototype.wasThrown = function() {

    }

    AutoScroll2.prototype.thrownEnd = function() {
      
    }

    // Private Methods
    function _init() {
        this.speed = _setSpeed(this.options.scrollDistancePerSecond);
        _initEvents.call(this);
    }

    function _initEvents() {
        this.el.addEventListener('mouseover', this.pauseScroll.bind(this));
        this.el.addEventListener('mouseleave', this.startScroll.bind(this));
        this.el.addEventListener('touchstart', this.mobileTouchStart.bind(this));
        this.el.addEventListener('touchend', this.mobileTouchEnd.bind(this));
    }

    function _setSpeed(scrollDistance) {
        return Math.ceil(scrollDistance / 60);
    }

    // Utility Methods
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

})();

function AutoScroll(div, scrollDistancePerSecond) {
    this.div = div || null;
    this.scrollDistancePerSecond = scrollDistancePerSecond || 10;
    this._scrollDistancePerAnimationFrame = Math.ceil(this.scrollDistancePerSecond / 60);

    this._isBeingThrown = false;
    this._running = false;
    this._thrownInterval = null;
    this._previousScrollTop = null;

    this._autoScroll = function() {
        if (this._running && !this._isBeingThrown) {
            if (this.div.scrollTop < this.div.scrollHeight - this.div.offsetHeight) {
                window.requestAnimationFrame(this._autoScroll.bind(this));
                this.div.scrollTop += this._scrollDistancePerAnimationFrame;
            } else {
                setTimeout(this._resetScroll.bind(this), 500);
            }
        } else {
            return;
        }
    }

    this._startScroll = function(e) {
        this._running = true;
        this._autoScroll();
    }

    this._pauseScroll = function(e) {
        this._running = false;
    }

    this._resetScroll = function() {
        this.div.scrollTop = 0;
        setTimeout(this._startScroll.bind(this), 500);
    }

    this._mobileTouchStart = function(e) {
        this._isBeingThrown = true;
    }

    this._mobileTouchEnd = function(e) {
        this._thrownInterval = setInterval(this._checkIsThrown.bind(this), 10);
    }

    this._checkIsThrown = function() {
        if (this._previousScrollTop !== this.div.scrollTop) this._previousScrollTop = this.div.scrollTop;
        else this._thrownEnd();
    }

    this._thrownEnd = function() {
        this._isBeingThrown = false;
        clearInterval(this._thrownInterval);
        this._startScroll();
    }

    this._initEventListeners = function() {
        this.div.addEventListener('mouseover', this._pauseScroll.bind(this));
        this.div.addEventListener('mouseleave', this._startScroll.bind(this));
        this.div.addEventListener('touchstart', this._mobileTouchStart.bind(this));
        this.div.addEventListener('touchend', this._mobileTouchEnd.bind(this));
    }

    this._hasInitErrors = function() {
        //Rudimentary error handling
        if (!this.div) {
            console.error('AutoScroll Construction Error: No element supplied');
            return true;
        }

        if (!(div instanceof HTMLElement)) {
            console.error('AutoScroll Construction Error: First parameter must be a DOM Element');
            return true;
        }

        if (scrollDistancePerSecond && typeof scrollDistancePerSecond !== 'number') {
            console.error('AutoScroll Construction Error: Second parameter must be a number');
            return true;
        }

        return false;
    }

    this._init = function() {
        if (this._hasInitErrors()) return;
        this._initEventListeners();
        setTimeout(this._startScroll.bind(this), 500);
    }

    this._init();
}

var element1 = document.getElementById('element1');
var element2 = document.getElementById('element2');

var Scroller2 = new AutoScroll(element2);

var Scroller3 = new AutoScroll2(element1);
console.log(Scroller3)
