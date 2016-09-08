Popover = require './popover.coffee'
Position = require './position.coffee'

class QingPopover extends QingModule

  @opts:
    pointTo: null
    cls: null
    content: null
    direction: null
    arrowOffset: 16
    offset: null
    align:
      horizental: 'center'
      vertical: 'middle'

  constructor: (opts) ->
    super

    @pointTo = $ @opts.pointTo
    unless @pointTo.length > 0
      throw new Error 'QingPopover: option el is required'

    @opts = $.extend {}, QingPopover.opts, @opts

    QingPopover.destroyAll()
    @_render()
    @_bind()
    @refresh()

  _render: ->
    @pointTo.addClass 'qing-popover-point-to'
      .data 'qingPopover', @

    @popover = new Popover
      qingPopover: @
      cls: @opts.cls
      content: @opts.content

    @position = new Position
      pointTo: @pointTo
      popover: @popover.el
      direction: @opts.direction
      arrowOffset: @opts.arrowOffset
      offset: @opts.offset
      align: @opts.align

  _bind: ->
    $(window).on 'resize.qing-popover', =>
      @refresh()

    if @opts.autohide
      $(document).on 'mousedown.qing-popover', (e) =>
        target = $ e.target

        return if target.is(@pointTo) or
        @popover.el.has(target).length or
        target.is(@popover.el)

        @destroy()

  refresh: ->
    @popover.el.removeClass Position._directions.join(' ')
    @popover.arrow.css
      top: ''
      bottom: ''
      left: ''
      right: ''

    @position.update()

    @popover.el.addClass @position.direction
      .css @position.position

  destroy: ->
    $(window).off '.qing-popover'
    $(document).off '.qing-popover'
    @pointTo.off '.qing-popover'
    @popover.destroy()
    @pointTo.removeClass 'qing-popover-point-to'
      .removeData 'qingPopover'

  @destroyAll: ->
    $('.qing-popover').each ->
      $popoverEl = $ @
      qingPopover = $popoverEl.data 'qingPopover'

      if qingPopover.pointTo.index() is -1
        $popoverEl.remove()
      else
        qingPopover.destroy()

module.exports = QingPopover
