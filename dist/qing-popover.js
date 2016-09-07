/**
 * qing-popover v0.0.1
 * http://mycolorway.github.io/qing-popover
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-popover/license.html
 *
 * Date: 2016-09-7
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
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Popover = (function(superClass) {
  extend(Popover, superClass);

  Popover.opts = {
    pointTo: null,
    cls: null,
    content: null,
    position: null,
    offset: null,
    autohide: true,
    align: "center",
    verticalAlign: "middle",
    autoAdjustPosition: true
  };

  Popover.arrowOffset = 16;

  Popover._directions = ["direction-left-top", "direction-left-middle", "direction-left-bottom", "direction-right-top", "direction-right-bottom", "direction-right-middle", "direction-top-left", "direction-top-right", "direction-top-center", "direction-bottom-left", "direction-bottom-right", "direction-bottom-center"];

  Popover._tpl = "<div class=\"qing-popover\">\n  <div class=\"qing-popover-content\"></div>\n  <div class=\"qing-popover-arrow\">\n    <i class=\"arrow arrow-shadow-1\"></i>\n    <i class=\"arrow arrow-shadow-0\"></i>\n    <i class=\"arrow arrow-border\"></i>\n    <i class=\"arrow arrow-basic\"></i>\n  </div>\n</div>";

  function Popover(opts) {
    Popover.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, Popover.opts, this.opts);
    this.pointTo = this.opts.pointTo;
    this._render();
    this._bind();
    this.refresh();
  }

  Popover.prototype._render = function() {
    this.el = $(Popover._tpl).addClass(this.opts.cls);
    this.arrow = this.el.find('.qing-popover-arrow');
    this.content = this.el.find('.simple-popover-content');
    this.content.append(this.opts.content);
    return this.el.appendTo('body');
  };

  Popover.prototype._bind = function() {
    if (this.opts.autohide) {
      return $(document).on("mousedown.qing-popover", (function(_this) {
        return function(e) {
          var target;
          target = $(e.target);
          if (target.is(_this.pointTo) || _this.el.has(target).length || target.is(_this.el)) {
            return;
          }
          return _this.trigger('autohide');
        };
      })(this));
    }
  };

  Popover.prototype.refresh = function() {
    var direction;
    this.el.removeClass(Popover._directions.join(' '));
    this.arrow.css({
      top: '',
      bottom: '',
      left: '',
      right: ''
    });
    this.directions = this._directions();
    direction = "direction-" + (this.directions.join('-'));
    if (indexOf.call(Popover._directions, direction) < 0) {
      throw new Error('[QingPopover] - position is not valid');
    }
    this.position = this._position();
    return this.el.addClass(direction).css(this.position);
  };

  Popover.prototype._directions = function() {
    var arrowHeight, arrowOffset, arrowWidth, bottomSpace, directions, leftSpace, pointToHeight, pointToOffset, pointToWidth, popoverWidth, rightSpace, scrollLeft, scrollTop, topSpace, winHeight, winWidth;
    if (this.opts.position) {
      return this.opts.position.split('-');
    }
    pointToOffset = this.pointTo.offset();
    pointToWidth = this.pointTo.outerWidth();
    pointToHeight = this.pointTo.outerHeight();
    popoverWidth = this.el.outerWidth();
    arrowWidth = this.arrow.width();
    arrowHeight = this.arrow.height();
    arrowOffset = Popover.arrowOffset;
    winHeight = $(window).height();
    winWidth = $(window).width();
    scrollTop = $(document).scrollTop();
    scrollLeft = $(document).scrollLeft();
    leftSpace = pointToOffset.left - scrollLeft;
    rightSpace = scrollLeft + winWidth - pointToOffset.left - pointToWidth;
    topSpace = pointToOffset.top - scrollTop;
    bottomSpace = scrollTop + winHeight - pointToOffset.top - pointToHeight;
    directions = ['right', 'bottom'];
    if (rightSpace < popoverWidth + arrowOffset && leftSpace > rightSpace && leftSpace > popoverWidth + arrowOffset) {
      direction[0] = 'left';
    }
    if (topSpace > bottomSpace) {
      direction[1] = 'top';
    }
    return directions;
  };

  Popover.prototype._position = function() {
    var arrowHeight, arrowOffset, arrowWidth, left, pointToHeight, pointToOffset, pointToWidth, popoverHeight, popoverWidth, top;
    top = 0;
    left = 0;
    pointToOffset = this.pointTo.offset();
    pointToWidth = this.pointTo.outerWidth();
    pointToHeight = this.pointTo.outerHeight();
    popoverWidth = this.el.outerWidth();
    popoverHeight = this.el.outerHeight();
    arrowWidth = this.arrow.width();
    arrowHeight = this.arrow.height();
    arrowOffset = Popover.arrowOffset;
    switch (this.directions[0]) {
      case 'left':
        left = pointToOffset.left - arrowHeight - popoverWidth;
        break;
      case 'right':
        left = pointToOffset.left + pointToWidth + arrowHeight;
        break;
      case 'top':
        top = pointToOffset.top - arrowHeight - popoverHeight;
        break;
      case 'bottom':
        top = pointToOffset.top + pointToHeight + arrowHeight;
    }
    switch (this.directions[1]) {
      case 'top':
        top = pointToOffset.top + pointToHeight / 2 + arrowWidth / 2 + arrowOffset - popoverHeight;
        break;
      case 'bottom':
        top = pointToOffset.top + pointToHeight / 2 - arrowWidth / 2 - arrowOffset;
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
      switch (this.opts.align) {
        case 'left':
          left -= pointToWidth / 2;
          break;
        case 'right':
          left += pointToWidth / 2;
      }
    }
    if (/left|right/.test(this.directions[0])) {
      switch (this.opts.verticalAlign) {
        case "top":
          top -= pointToHeight / 2;
          break;
        case "bottom":
          top += pointToHeight / 2;
      }
    }
    return this._autoAdjustPosition(this._adjustOffset({
      top: top,
      left: left
    }));
  };

  Popover.prototype._autoAdjustPosition = function(position) {
    var arrowOffset, delta, left, scrollLeft, scrollTop, top;
    if (!this.opts.autoAdjustPosition) {
      return position;
    }
    left = position.left;
    top = position.top;
    scrollTop = $(document).scrollTop();
    scrollLeft = $(document).scrollLeft();
    arrowOffset = Popover.arrowOffset;
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

  Popover.prototype._adjustOffset = function(position) {
    var xOffset, yOffset;
    if (!this.opts.offset) {
      return position;
    }
    yOffset = this.opts.offset.y;
    xOffset = this.opts.offset.x;
    if (yOffset) {
      if (this.directions[0] === 'top') {
        yOffset = -yOffset;
      }
      position.top += yOffset;
    }
    if (xOffset) {
      if (this.directions[0] === 'left') {
        xOffset = -xOffset;
      }
      position.left += xOffset;
    }
    return position;
  };

  Popover.prototype.destroy = function() {
    $(document).off('.qing-popover');
    return this.el.remove();
  };

  return Popover;

})(QingModule);

module.exports = Popover;

},{}],"qing-popover":[function(require,module,exports){
var Popover, QingPopover,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Popover = require('./views/popover.coffee');

QingPopover = (function(superClass) {
  extend(QingPopover, superClass);

  QingPopover.opts = {
    el: null,
    popover: {}
  };

  function QingPopover(opts) {
    QingPopover.__super__.constructor.apply(this, arguments);
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw new Error('QingPopover: option el is required');
    }
    this.opts = $.extend({}, QingPopover.opts, this.opts);
    QingPopover.destroyAll();
    this._render();
    this._initChildComponents();
    this._bind();
    this.trigger('ready');
  }

  QingPopover.prototype._render = function() {
    return this.el.addClass('qing-popover-point-to').data('qingPopover', this);
  };

  QingPopover.prototype._initChildComponents = function() {
    return this.popover = new Popover($.extend({
      pointTo: this.el
    }, this.opts.popover));
  };

  QingPopover.prototype._bind = function() {
    $(window).on('resize.qing-popover', (function(_this) {
      return function() {
        return _this.popover.refresh();
      };
    })(this));
    return this.popover.on('autohide', (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
  };

  QingPopover.prototype.destroy = function() {
    $(window).off('.qing-popover');
    this.el.off('.qing-popover');
    this.popover.destroy();
    return this.el.removeClass('qing-popover-point-to').removeData('qingPopover');
  };

  QingPopover.destroyAll = function() {
    return $('.qing-popover').each(function() {
      var $popoverEl, qingPopover;
      $popoverEl = $(this);
      qingPopover = $popoverEl.data('qingPopover');
      if (qingPopover.el.index() === -1) {
        return $popoverEl.remove();
      } else {
        return qingPopover.destroy();
      }
    });
  };

  return QingPopover;

})(QingModule);

module.exports = QingPopover;

},{"./views/popover.coffee":1}]},{},[]);

return b('qing-popover');
}));
