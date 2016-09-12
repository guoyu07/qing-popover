Direction = require './direction.coffee'
Position = require './position.coffee'

class QingPopover extends QingModule

  @opts:
    pointTo: null
    cls: null
    content: null
    direction: null
    offset: null
    autohide: true
    align:
      horizental: 'center'
      vertical: 'middle'

  @ARROW_OFFSET: 16

  @_tpl: """
    <div class="qing-popover">
      <div class="qing-popover-content"></div>
      <div class="qing-popover-arrow">
        <i class="arrow arrow-shadow-0"></i>
        <i class="arrow arrow-border"></i>
        <i class="arrow arrow-basic"></i>
      </div>
    </div>
  """

  constructor: (opts) ->
    super
    @opts = $.extend {}, QingPopover.opts, @opts

    @pointTo = $ @opts.pointTo
    unless @pointTo.length > 0
      throw new Error 'QingPopover: option el is required'

    QingPopover.destroyAll()
    @_render()
    @_bind()
    @refresh()
    @trigger 'ready'

  _render: ->
    @popover = $(QingPopover._tpl).addClass @opts.cls
    @arrow = @popover.find('.qing-popover-arrow')
    @content = @popover.find('.qing-popover-content').append @opts.content
    @popover.data 'qingPopover', @
      .appendTo 'body'

    @pointTo.addClass 'qing-popover-point-to'
      .data 'qingPopover', @

    @direction = new Direction
      pointTo: @pointTo
      popover: @popover
      direction: @opts.direction

    @position = new Position
      pointTo: @pointTo
      popover: @popover
      align: @opts.align
      offset: @opts.offset

  _bind: ->
    $(window).on 'resize.qing-popover', =>
      @refresh()

    if @opts.autohide
      $(document).on 'mousedown.qing-popover', (e) =>
        target = $ e.target

        return if target.is(@pointTo) or
        @popover.has(target).length or
        target.is(@popover)

        @destroy()

  refresh: ->
    @popover.removeClass Direction._directions.join(' ')
    @arrow.css
      top: ''
      bottom: ''
      left: ''
      right: ''

    @direction.update()

    @popover.addClass(@direction.toString())
      .css(@_positionWithArrow())

  _positionWithArrow: ->
    @position.update(@direction.directions)

    pos = {
      top: @position.top
      left: @position.left
    }

    switch @direction.directions[0]
      when 'top'
        pos.top -= @arrow.height()
      when 'bottom'
        pos.top += @arrow.height()
      when 'left'
        pos.left -= @arrow.width()
      when 'right'
        pos.left += @arrow.width()

    switch @direction.directions[1]
      when 'top'
        pos.top += @arrow.height() / 2 + QingPopover.ARROW_OFFSET
      when 'bottom'
        pos.top -= @arrow.height() / 2 + QingPopover.ARROW_OFFSET
      when 'left'
        pos.left += @arrow.width() / 2 + QingPopover.ARROW_OFFSET
      when 'right'
        pos.left -= @arrow.width() / 2 + QingPopover.ARROW_OFFSET

    pos

  destroy: ->
    $(window).off '.qing-popover'
    $(document).off '.qing-popover'
    @pointTo.off '.qing-popover'
    @popover.remove()
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
