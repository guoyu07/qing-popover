/**
 * qing-popover v0.0.1
 * http://mycolorway.github.io/qing-popover
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-popover/license.html
 *
 * Date: 2016-09-8
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
var Popover,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Popover = (function(superClass) {
  extend(Popover, superClass);

  Popover.opts = {
    qingPopover: null,
    cls: null,
    content: null
  };

  Popover._tpl = "<div class=\"qing-popover\">\n  <div class=\"qing-popover-content\"></div>\n  <div class=\"qing-popover-arrow\">\n    <i class=\"arrow arrow-shadow-0\"></i>\n    <i class=\"arrow arrow-border\"></i>\n    <i class=\"arrow arrow-basic\"></i>\n  </div>\n</div>";

  function Popover(opts) {
    Popover.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, Popover.opts, this.opts);
    this.qingPopover = this.opts.qingPopover;
    this._render();
  }

  Popover.prototype._render = function() {
    this.el = $(Popover._tpl).addClass(this.opts.cls);
    this.arrow = this.el.find('.qing-popover-arrow');
    this.content = this.el.find('.qing-popover-content').append(this.opts.content);
    return this.el.data('qingPopover', this.qingPopover).appendTo('body');
  };

  Popover.prototype.destroy = function() {
    return this.el.remove();
  };

  return Popover;

})(QingModule);

module.exports = Popover;

},{}],2:[function(require,module,exports){
var Position,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Position = (function(superClass) {
  extend(Position, superClass);

  Position.opts = {
    pointTo: null,
    popover: null,
    direction: null,
    arrowOffset: 16,
    offset: null,
    align: {
      horizental: 'center',
      vertical: 'middle'
    }
  };

  Position._directions = ["direction-left-top", "direction-left-middle", "direction-left-bottom", "direction-right-top", "direction-right-bottom", "direction-right-middle", "direction-top-left", "direction-top-right", "direction-top-center", "direction-bottom-left", "direction-bottom-right", "direction-bottom-center"];

  function Position(opts) {
    Position.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, Position.opts, this.opts);
    this.pointTo = this.opts.pointTo;
    this.popover = this.opts.popover;
    this.arrow = this.opts.popover.find('.qing-popover-arrow');
    this.doc = $(document);
    this.win = $(window);
  }

  Position.prototype._getSpaces = function() {
    var pointToH, pointToOffset, pointToW;
    pointToOffset = this.pointTo.offset();
    pointToW = this.pointTo.outerWidth();
    pointToH = this.pointTo.outerHeight();
    return {
      left: pointToOffset.left - this.doc.scrollLeft(),
      right: this.doc.scrollLeft() + this.win.width() - pointToOffset.left - pointToW,
      top: pointToOffset.top - this.doc.scrollTop(),
      bottom: this.doc.scrollTop() + this.win.height() - pointToOffset.top - pointToH
    };
  };

  Position.prototype._getSpacesCoefficient = function() {
    var spaces;
    spaces = this._getSpaces();
    return [
      {
        direction: 'left',
        beyond: Math.min(this.popover.outerWidth() + this.arrow.outerWidth() - spaces.left, 0) * this.popover.outerHeight() + Math.min(this.popover.outerHeight() - this.win.height(), 0) * this.popover.outerWidth()
      }, {
        direction: 'right',
        beyond: Math.min(this.popover.outerWidth() + this.arrow.outerWidth() - spaces.right, 0) * this.popover.outerHeight() + Math.min(this.popover.outerHeight() - this.win.height(), 0) * this.popover.outerWidth()
      }, {
        direction: 'top',
        beyond: Math.min(this.popover.outerHeight() + this.arrow.outerHeight() - spaces.top, 0) * this.popover.outerWidth() + Math.min(this.popover.outerWidth() - this.win.width(), 0) * this.popover.outerHeight()
      }, {
        direction: 'bottom',
        beyond: Math.min(this.popover.outerHeight() + this.arrow.outerHeight() - spaces.top, 0) * this.popover.outerWidth() + Math.min(this.popover.outerWidth() - this.win.width(), 0) * this.popover.outerHeight()
      }
    ].sort(function(a, b) {
      if (a.beyond > b.beyond) {
        return 1;
      }
      return -1;
    });
  };

  Position.prototype._getDirections = function() {
    var directions;
    if (this.opts.direction) {
      return this.opts.direction.split('-');
    }
    directions = [this._getSpacesCoefficient()[0].direction, 'top'];
    if (/top|bottom/.test(directions[0])) {
      directions[1] = 'center';
    }
    return directions;
  };

  Position.prototype.update = function() {
    var arrowHeight, arrowOffset, arrowWidth, left, pointToHeight, pointToOffset, pointToWidth, popoverHeight, popoverWidth, ref, top;
    this.directions = this._getDirections();
    this.direction = "direction-" + (this.directions.join('-'));
    if (ref = this.direction, indexOf.call(Position._directions, ref) < 0) {
      throw new Error('[QingPopover] - direction is not valid');
    }
    top = 0;
    left = 0;
    pointToOffset = this.pointTo.offset();
    pointToWidth = this.pointTo.outerWidth();
    pointToHeight = this.pointTo.outerHeight();
    popoverWidth = this.popover.outerWidth();
    popoverHeight = this.popover.outerHeight();
    arrowWidth = this.arrow.width();
    arrowHeight = this.arrow.height();
    arrowOffset = this.opts.arrowOffset;
    switch (this.directions[0]) {
      case 'left':
        left = pointToOffset.left - arrowWidth - popoverWidth;
        break;
      case 'right':
        left = pointToOffset.left + pointToWidth + arrowWidth;
        break;
      case 'top':
        top = pointToOffset.top - arrowHeight - popoverHeight;
        break;
      case 'bottom':
        top = pointToOffset.top + pointToHeight + arrowHeight;
    }
    switch (this.directions[1]) {
      case 'top':
        top = pointToOffset.top + pointToHeight / 2 + arrowHeight / 2 + arrowOffset - popoverHeight;
        break;
      case 'bottom':
        top = pointToOffset.top + pointToHeight / 2 - arrowHeight / 2 - arrowOffset;
        break;
      case 'left':
        left = pointToOffset.left + pointToWidth / 2 + arrowWidth / 2 + arrowOffset - popoverWidth;
        break;
      case 'right':
        left = pointToOffset.left + pointToWidth / 2 - arrowWidth / 2 - arrowOffset;
        break;
      case 'center':
        left = pointToOffset.left + pointToWidth / 2 - popoverWidth / 2;
        break;
      case 'middle':
        top = pointToOffset.top + pointToHeight / 2 - popoverHeight / 2;
    }
    if (/top|bottom/.test(this.directions[0])) {
      switch (this.opts.align.horizental) {
        case 'left':
          left -= pointToWidth / 2;
          break;
        case 'right':
          left += pointToWidth / 2;
      }
    }
    if (/left|right/.test(this.directions[0])) {
      switch (this.opts.align.vertical) {
        case 'top':
          top -= pointToHeight / 2;
          break;
        case 'bottom':
          top += pointToHeight / 2;
      }
    }
    return this.position = this._autoAdjustPosition(this._adjustOffset({
      top: top,
      left: left
    }));
  };

  Position.prototype._autoAdjustPosition = function(position) {
    var arrowOffset, delta, left, scrollLeft, scrollTop, top;
    left = position.left;
    top = position.top;
    scrollTop = this.doc.scrollTop();
    scrollLeft = this.doc.scrollLeft();
    arrowOffset = this.opts.arrowOffset;
    if (/top|bottom/.test(this.directions[0]) && left < scrollLeft) {
      delta = scrollLeft - left;
      left += delta;
      switch (this.directions[1]) {
        case 'left':
          this.arrow.css('right', arrowOffset + delta);
          break;
        case 'right':
          this.arrow.css('left', Math.max(arrowOffset - delta, arrowOffset));
          break;
        default:
          this.arrow.css('marginLeft', -arrowOffset / 2 - delta);
      }
    }
    if (/left|right/.test(this.directions[0]) && top < scrollTop) {
      delta = scrollTop - top;
      top += delta;
      switch (this.directions[1]) {
        case 'top':
          this.arrow.css('bottom', arrowOffset + delta);
          break;
        case 'bottom':
          this.arrow.css('top', Math.max(arrowOffset - delta, arrowOffset));
          break;
        default:
          this.arrow.css('marginTop', -arrowOffset / 2 - delta);
      }
    }
    return {
      top: top,
      left: left
    };
  };

  Position.prototype._adjustOffset = function(position) {
    var offset;
    if (!this.opts.offset) {
      return position;
    }
    offset = this.opts.offset;
    if (/top|left/.test(this.directions[0])) {
      offset = -offset;
    }
    if (/top|bottom/.test(this.directions[0])) {
      position.top += offset;
    }
    if (/left|right/.test(this.directions[0])) {
      position.left += offset;
    }
    return position;
  };

  return Position;

})(QingModule);

module.exports = Position;

},{}],"qing-popover":[function(require,module,exports){
var Popover, Position, QingPopover,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Popover = require('./popover.coffee');

Position = require('./position.coffee');

QingPopover = (function(superClass) {
  extend(QingPopover, superClass);

  QingPopover.opts = {
    pointTo: null,
    cls: null,
    content: null,
    direction: null,
    arrowOffset: 16,
    offset: null,
    align: {
      horizental: 'center',
      vertical: 'middle'
    }
  };

  function QingPopover(opts) {
    QingPopover.__super__.constructor.apply(this, arguments);
    this.pointTo = $(this.opts.pointTo);
    if (!(this.pointTo.length > 0)) {
      throw new Error('QingPopover: option el is required');
    }
    this.opts = $.extend({}, QingPopover.opts, this.opts);
    QingPopover.destroyAll();
    this._render();
    this._bind();
    this.refresh();
    this.trigger('ready');
  }

  QingPopover.prototype._render = function() {
    this.pointTo.addClass('qing-popover-point-to').data('qingPopover', this);
    this.popover = new Popover({
      qingPopover: this,
      cls: this.opts.cls,
      content: this.opts.content
    });
    return this.position = new Position({
      pointTo: this.pointTo,
      popover: this.popover.el,
      direction: this.opts.direction,
      arrowOffset: this.opts.arrowOffset,
      offset: this.opts.offset,
      align: this.opts.align
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
          if (target.is(_this.pointTo) || _this.popover.el.has(target).length || target.is(_this.popover.el)) {
            return;
          }
          return _this.destroy();
        };
      })(this));
    }
  };

  QingPopover.prototype.refresh = function() {
    this.popover.el.removeClass(Position._directions.join(' '));
    this.popover.arrow.css({
      top: '',
      bottom: '',
      left: '',
      right: ''
    });
    this.position.update();
    return this.popover.el.addClass(this.position.direction).css(this.position.position);
  };

  QingPopover.prototype.destroy = function() {
    $(window).off('.qing-popover');
    $(document).off('.qing-popover');
    this.pointTo.off('.qing-popover');
    this.popover.destroy();
    return this.pointTo.removeClass('qing-popover-point-to').removeData('qingPopover');
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

},{"./popover.coffee":1,"./position.coffee":2}]},{},[]);

return b('qing-popover');
}));
