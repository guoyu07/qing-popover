Popover = require './views/popover.coffee'

class QingPopover extends QingModule

  @opts:
    el: null
    popover: {}

  constructor: (opts) ->
    super

    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingPopover: option el is required'

    @opts = $.extend {}, QingPopover.opts, @opts

    QingPopover.destroyAll()
    @_render()
    @_initChildComponents()
    @_bind()
    @trigger 'ready'

  _render: ->
    @el.addClass 'qing-popover-point-to'
      .data 'qingPopover', @

  _initChildComponents: ->
    @popover = new Popover $.extend(
      pointTo: @el
    , @opts.popover)

  _bind: ->
    $(window).on 'resize.qing-popover', =>
      @popover.refresh()

    @popover.on 'autohide', =>
      @destroy()

  destroy: ->
    $(window).off '.qing-popover'
    @el.off '.qing-popover'
    @popover.destroy()
    @el.removeClass 'qing-popover-point-to'
      .removeData 'qingPopover'

  @destroyAll: ->
    $('.qing-popover').each ->
      $popoverEl = $ @
      qingPopover = $popoverEl.data 'qingPopover'

      if qingPopover.el.index() is -1
        $popoverEl.remove()
      else
        qingPopover.destroy()

module.exports = QingPopover
