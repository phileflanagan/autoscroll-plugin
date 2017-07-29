(function() {
    window.AutoScroll2 = function(el, options) {
        this.el = el;

        this.speed = null;
        this.isBeingThrown = false;
        this.isMouseOver = false;
        this.isRunning = false;
        this.thrownInterval = null;
        this.previousScrollTop = null;

        var defaults = {
            speed: 10,
            pauseBottom: 500,
            pauseStart: 500
        };

        if (options && typeof options === 'object') {
            this.options = extendDefaults(defaults, options);
        } else {
            this.options = defaults;
        }

        _init.call(this);
    }

    AutoScroll2.prototype.autoScroll = function() {
        if (this.isRunning && !this.isBeingThrown && !this.isMouseOver) {
            if (this.el.scrollTop < this.el.scrollHeight - this.el.offsetHeight) {
                window.requestAnimationFrame(this.autoScroll.bind(this));
                this.el.scrollTop += this.speed;
            } else {
                this.isRunning = false;
                setTimeout(this.resetScroll.bind(this), this.options.pauseBottom);
            }
        } else {
            return;
        }
    }

    AutoScroll2.prototype.startScroll = function() {
        this.isRunning = true;
        this.autoScroll.call(this);
    }

    AutoScroll2.prototype.pauseScroll = function() {
        this.isRunning = false;
    }

    AutoScroll2.prototype.resetScroll = function() {
        this.el.scrollTop = 0;
        setTimeout(this.startScroll.bind(this), this.options.pauseStart);
    }

    AutoScroll2.prototype.mouseEnter = function(e) {
        this.isMouseOver = true;
        this.isRunning = false;
    }

    AutoScroll2.prototype.mouseLeave = function(e) {
        this.isMouseOver = false;
        this.isRunning = true;
        this.startScroll.call(this);
    }

    AutoScroll2.prototype.mobileTouchStart = function(e) {
        this.isBeingThrown = true;
    }

    AutoScroll2.prototype.mobileTouchEnd = function(e) {
        this.thrownInterval = setInterval(this.wasThrown.bind(this), 10);
    }

    AutoScroll2.prototype.wasThrown = function() {
        if (this.previousScrollTop !== this.el.scrollTop) this.previousScrollTop = this.el.scrollTop;
        else this.thrownEnd.call(this);
    }

    AutoScroll2.prototype.thrownEnd = function() {
        clearInterval(this.thrownInterval);
        this.isBeingThrown = false;
        this.startScroll.call(this);
    }

    // Private Methods
    function _init() {
        this.speed = _setSpeed(this.options.speed);
        _initEvents.call(this);
        setTimeout(this.startScroll.bind(this), this.options.pauseStart);
    }

    function _initEvents() {
        this.el.addEventListener('mouseenter', this.mouseEnter.bind(this));
        this.el.addEventListener('mouseleave', this.mouseLeave.bind(this));
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

var Scroller1 = new AutoScroll2(element1, {
    speed: 60
});
var Scroller2 = new AutoScroll2(element2, {
    speed: 80
});
