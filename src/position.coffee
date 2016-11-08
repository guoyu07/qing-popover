class Position extends QingModule

  @opts:
    pointTo: null
    popover: null
    offset: 0
    align:
      horizental: 'center'
      vertical: 'middle'

  _setOptions: (opts) ->
    super
    $.extend @opts, Position.opts, opts

  _init: ->
    @pointTo = @opts.pointTo
    @popover = @opts.popover
    @top = 0
    @left = 0

  update: (directions) ->
    @directions = directions

    @_position()
    @_adjustAlign()
    @_adjustOffset()

  _position: ->
    pointToOffset = @pointTo.offset()
    pointToWidth  = @pointTo.outerWidth()
    pointToHeight = @pointTo.outerHeight()
    popoverWidth  = @popover.outerWidth()
    popoverHeight = @popover.outerHeight()

    switch @directions[0]
      when 'left'
        @left = pointToOffset.left - popoverWidth
      when 'right'
        @left = pointToOffset.left + pointToWidth
      when 'top'
        @top = pointToOffset.top - popoverHeight
      when 'bottom'
        @top = pointToOffset.top + pointToHeight

    switch @directions[1]
      when 'top'
        @top = pointToOffset.top - popoverHeight + pointToHeight / 2
      when 'bottom'
        @top = pointToOffset.top + pointToHeight / 2
      when 'left'
        @left = pointToOffset.left - popoverWidth + pointToWidth / 2
      when 'right'
        @left = pointToOffset.left + pointToWidth / 2
      when 'center'
        @left = pointToOffset.left + pointToWidth / 2  - popoverWidth / 2
      when 'middle'
        @top = pointToOffset.top + pointToHeight / 2  - popoverHeight / 2

  _adjustAlign: ->
    if /top|bottom/.test @directions[0]
      switch @opts.align.horizental
        when 'left'
          @left -= @pointTo.width() / 2
        when 'right'
          @left += @pointTo.width() / 2

    if /left|right/.test @directions[0]
      switch @opts.align.vertical
        when 'top'
          @top -= @pointTo.height() / 2
        when 'bottom'
          @top += @pointTo.height() / 2

  _adjustOffset: ->
    return unless @opts.offset

    switch @directions[0]
      when 'top'
        @top -= @opts.offset
      when 'bottom'
        @top += @opts.offset
      when 'left'
        @left -= @opts.offset
      when 'right'
        @left += @opts.offset

module.exports = Position
