/**
 * qing-popover v0.0.1
 * http://mycolorway.github.io/qing-popover
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-popover/license.html
 *
 * Date: 2016-09-14
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('qing-module'));
  } else {
    root.QingPopover = factory(root.jQuery,root.QingModule);
  }
}(this, function ($,QingModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Direction,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Direction = (function(superClass) {
  extend(Direction, superClass);

  Direction.opts = {
    pointTo: null,
    popover: null,
    direction: null,
    boundarySelector: null
  };

  Direction._directions = ["direction-left-top", "direction-left-middle", "direction-left-bottom", "direction-right-top", "direction-right-bottom", "direction-right-middle", "direction-top-left", "direction-top-right", "direction-top-center", "direction-bottom-left", "direction-bottom-right", "direction-bottom-center"];

  function Direction(opts) {
    Direction.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, Direction.opts, this.opts);
    this.pointTo = this.opts.pointTo;
    this.popover = this.opts.popover;
    this.boundary = this.pointTo.closest(this.opts.boundarySelector);
    if (!this.boundary.length) {
      this.boundary = $(window);
    }
  }

  Direction.prototype._getSpaces = function($el) {
    var height, offset, width;
    if ($el[0] === window) {
      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
    }
    offset = $el.offset();
    width = $el.outerWidth();
    height = $el.outerHeight();
    return {
      left: offset.left - $(window).scrollLeft(),
      right: $(window).scrollLeft() + $(window).width() - offset.left - width,
      top: offset.top - $(window).scrollTop(),
      bottom: $(window).scrollTop() + $(window).height() - offset.top - height
    };
  };

  Direction.prototype.update = function() {
    var boundarySpaces, directions, pointToSpaces, ref, spaceCoefficient, spaces;
    if (this.opts.direction) {
      directions = this.opts.direction.split('-');
    } else {
      pointToSpaces = this._getSpaces(this.pointTo);
      boundarySpaces = this._getSpaces(this.boundary);
      spaces = ['left', 'right', 'top', 'bottom'].reduce(function(spaces, name) {
        spaces[name] = pointToSpaces[name] - boundarySpaces[name];
        return spaces;
      }, {});
      spaceCoefficient = [
        {
          direction: 'right',
          beyond: Math.max(this.popover.outerWidth() - spaces.right, 0) * this.popover.outerHeight() + Math.max(this.popover.outerHeight() - this.boundary.height(), 0) * this.popover.outerWidth()
        }, {
          direction: 'left',
          beyond: Math.max(this.popover.outerWidth() - spaces.left, 0) * this.popover.outerHeight() + Math.max(this.popover.outerHeight() - this.boundary.height(), 0) * this.popover.outerWidth()
        }, {
          direction: 'bottom',
          beyond: Math.max(this.popover.outerHeight() - spaces.bottom, 0) * this.popover.outerWidth() + Math.max(this.popover.outerWidth() - this.boundary.width(), 0) * this.popover.outerHeight()
        }, {
          direction: 'top',
          beyond: Math.max(this.popover.outerHeight() - spaces.top, 0) * this.popover.outerWidth() + Math.max(this.popover.outerWidth() - this.boundary.width(), 0) * this.popover.outerHeight()
        }
      ].sort(function(a, b) {
        if (a.beyond > b.beyond) {
          return 1;
        }
        return -1;
      });
      directions = [spaceCoefficient[0].direction];
      if (/top|bottom/.test(directions[0])) {
        directions[1] = 'center';
      } else if (/left|right/.test(directions[0])) {
        directions[1] = spaces.top > spaces.bottom ? 'top' : 'bottom';
      }
    }
    this.directions = directions;
    if (ref = this.toString(), indexOf.call(Direction._directions, ref) < 0) {
      throw new Error('[QingPopover] - direction is not valid');
    }
  };

  Direction.prototype.toString = function() {
    return "direction-" + (this.directions.join('-'));
  };

  return Direction;

})(QingModule);

module.exports = Direction;

},{}],2:[function(require,module,exports){
var Position,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Position = (function(superClass) {
  extend(Position, superClass);

  Position.opts = {
    pointTo: null,
    popover: null,
    offset: 0,
    align: {
      horizental: 'center',
      vertical: 'middle'
    }
  };

  function Position(opts) {
    Position.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, Position.opts, this.opts);
    this.pointTo = this.opts.pointTo;
    this.popover = this.opts.popover;
    this.top = 0;
    this.left = 0;
  }

  Position.prototype.update = function(directions) {
    this.directions = directions;
    this._position();
    this._adjustAlign();
    return this._adjustOffset();
  };

  Position.prototype._position = function() {
    var pointToHeight, pointToOffset, pointToWidth, popoverHeight, popoverWidth;
    pointToOffset = this.pointTo.offset();
    pointToWidth = this.pointTo.outerWidth();
    pointToHeight = this.pointTo.outerHeight();
    popoverWidth = this.popover.outerWidth();
    popoverHeight = this.popover.outerHeight();
    switch (this.directions[0]) {
      case 'left':
        this.left = pointToOffset.left - popoverWidth;
        break;
      case 'right':
        this.left = pointToOffset.left + pointToWidth;
        break;
      case 'top':
        this.top = pointToOffset.top - popoverHeight;
        break;
      case 'bottom':
        this.top = pointToOffset.top + pointToHeight;
    }
    switch (this.directions[1]) {
      case 'top':
        return this.top = pointToOffset.top - popoverHeight + pointToHeight / 2;
      case 'bottom':
        return this.top = pointToOffset.top + pointToHeight / 2;
      case 'left':
        return this.left = pointToOffset.left - popoverWidth + pointToWidth / 2;
      case 'right':
        return this.left = pointToOffset.left + pointToWidth / 2;
      case 'center':
        return this.left = pointToOffset.left + pointToWidth / 2 - popoverWidth / 2;
      case 'middle':
        return this.top = pointToOffset.top + pointToHeight / 2 - popoverHeight / 2;
    }
  };

  Position.prototype._adjustAlign = function() {
    if (/top|bottom/.test(this.directions[0])) {
      switch (this.opts.align.horizental) {
        case 'left':
          this.left -= this.pointTo.width() / 2;
          break;
        case 'right':
          this.left += this.pointTo.width() / 2;
      }
    }
    if (/left|right/.test(this.directions[0])) {
      switch (this.opts.align.vertical) {
        case 'top':
          return this.top -= this.pointTo.height() / 2;
        case 'bottom':
          return this.top += this.pointTo.height() / 2;
      }
    }
  };

  Position.prototype._adjustOffset = function() {
    if (!this.opts.offset) {
      return;
    }
    switch (this.directions[0]) {
      case 'top':
        return this.top -= this.opts.offset;
      case 'bottom':
        return this.top += this.opts.offset;
      case 'left':
        return this.left -= this.opts.offset;
      case 'right':
        return this.left += this.opts.offset;
    }
  };

  return Position;

})(QingModule);

module.exports = Position;

},{}],"qing-popover":[function(require,module,exports){
var Direction, Position, QingPopover,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Direction = require('./direction.coffee');

Position = require('./position.coffee');

QingPopover = (function(superClass) {
  extend(QingPopover, superClass);

  QingPopover.opts = {
    pointTo: null,
    cls: null,
    content: null,
    direction: null,
    offset: null,
    autohide: true,
    align: {
      horizental: 'center',
      vertical: 'middle'
    }
  };

  QingPopover.ARROW_OFFSET = 16;

  QingPopover._tpl = "<div class=\"qing-popover\">\n  <div class=\"qing-popover-content\"></div>\n  <div class=\"qing-popover-arrow\">\n    <i class=\"arrow arrow-shadow-0\"></i>\n    <i class=\"arrow arrow-border\"></i>\n    <i class=\"arrow arrow-basic\"></i>\n  </div>\n</div>";

  function QingPopover(opts) {
    QingPopover.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, QingPopover.opts, this.opts);
    this.pointTo = $(this.opts.pointTo);
    if (!(this.pointTo.length > 0)) {
      throw new Error('QingPopover: option el is required');
    }
    QingPopover.destroyAll();
    this._render();
    this._bind();
    this.refresh();
    this.trigger('ready');
  }

  QingPopover.prototype._render = function() {
    this.popover = $(QingPopover._tpl).addClass(this.opts.cls);
    this.arrow = this.popover.find('.qing-popover-arrow');
    this.content = this.popover.find('.qing-popover-content').append(this.opts.content);
    this.popover.data('qingPopover', this).appendTo('body');
    this.pointTo.data('qingPopover', this);
    this.direction = new Direction({
      pointTo: this.pointTo,
      popover: this.popover,
      boundarySelector: this.opts.boundarySelector,
      direction: this.opts.direction
    });
    return this.position = new Position({
      pointTo: this.pointTo,
      popover: this.popover,
      align: this.opts.align,
      offset: this.opts.offset
    });
  };

  QingPopover.prototype._bind = function() {
    $(window).on('resize.qing-popover', (function(_this) {
      return function() {
        return _this.refresh();
      };
    })(this));
    if (this.opts.autohide) {
      return $(document).on('mousedown.qing-popover', (function(_this) {
        return function(e) {
          var target;
          target = $(e.target);
          if (target.is(_this.pointTo) || _this.popover.has(target).length || target.is(_this.popover)) {
            return;
          }
          return _this.destroy();
        };
      })(this));
    }
  };

  QingPopover.prototype.refresh = function() {
    this.popover.removeClass(Direction._directions.join(' '));
    this.arrow.css({
      top: '',
      bottom: '',
      left: '',
      right: ''
    });
    this.direction.update();
    return this.popover.addClass(this.direction.toString()).css(this._positionWithArrow());
  };

  QingPopover.prototype._positionWithArrow = function() {
    var pos;
    this.position.update(this.direction.directions);
    pos = {
      top: this.position.top,
      left: this.position.left
    };
    switch (this.direction.directions[0]) {
      case 'top':
        pos.top -= this.arrow.height();
        break;
      case 'bottom':
        pos.top += this.arrow.height();
        break;
      case 'left':
        pos.left -= this.arrow.width();
        break;
      case 'right':
        pos.left += this.arrow.width();
    }
    switch (this.direction.directions[1]) {
      case 'top':
        pos.top += this.arrow.height() / 2 + QingPopover.ARROW_OFFSET;
        break;
      case 'bottom':
        pos.top -= this.arrow.height() / 2 + QingPopover.ARROW_OFFSET;
        break;
      case 'left':
        pos.left += this.arrow.width() / 2 + QingPopover.ARROW_OFFSET;
        break;
      case 'right':
        pos.left -= this.arrow.width() / 2 + QingPopover.ARROW_OFFSET;
    }
    return pos;
  };

  QingPopover.prototype.destroy = function() {
    $(window).off('.qing-popover');
    $(document).off('.qing-popover');
    this.pointTo.off('.qing-popover');
    this.popover.remove();
    return this.pointTo.removeData('qingPopover');
  };

  QingPopover.destroyAll = function() {
    return $('.qing-popover').each(function() {
      var $popoverEl, qingPopover;
      $popoverEl = $(this);
      qingPopover = $popoverEl.data('qingPopover');
      if (qingPopover.pointTo.index() === -1) {
        return $popoverEl.remove();
      } else {
        return qingPopover.destroy();
      }
    });
  };

  return QingPopover;

})(QingModule);

module.exports = QingPopover;

},{"./direction.coffee":1,"./position.coffee":2}]},{},[]);

return b('qing-popover');
}));
