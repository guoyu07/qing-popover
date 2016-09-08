class Position extends QingModule

  @opts:
    pointTo: null
    popover: null
    direction: null
    arrowOffset: 16
    offset: null
    align:
      horizental: 'center'
      vertical: 'middle'

  @_directions: [
    "direction-left-top"
    "direction-left-middle"
    "direction-left-bottom"
    "direction-right-top"
    "direction-right-bottom"
    "direction-right-middle"
    "direction-top-left"
    "direction-top-right"
    "direction-top-center"
    "direction-bottom-left"
    "direction-bottom-right"
    "direction-bottom-center"
  ]

  constructor: (opts) ->
    super
    @opts = $.extend {}, Position.opts, @opts
    @pointTo = @opts.pointTo
    @popover = @opts.popover
    @arrow = @opts.popover.find('.qing-popover-arrow')
    @doc = $ document
    @win = $ window

  _getSpaces: ->
    pointToOffset = @pointTo.offset()
    pointToW = @pointTo.outerWidth()
    pointToH = @pointTo.outerHeight()

    {
      left: pointToOffset.left - @doc.scrollLeft()
      right: @doc.scrollLeft() + @win.width() - pointToOffset.left - pointToW
      top: pointToOffset.top - @doc.scrollTop()
      bottom: @doc.scrollTop() + @win.height() - pointToOffset.top - pointToH
    }

  _getSpacesCoefficient: ->
    spaces = @_getSpaces()

    [{
      direction: 'left'
      beyond: Math.min(@popover.outerWidth() + @arrow.outerWidth() - spaces.left, 0) * @popover.outerHeight() + Math.min(@popover.outerHeight() - @win.height(), 0) * @popover.outerWidth()
    }, {
      direction: 'right'
      beyond: Math.min(@popover.outerWidth() + @arrow.outerWidth() - spaces.right, 0) * @popover.outerHeight() + Math.min(@popover.outerHeight() - @win.height(), 0) * @popover.outerWidth()
    }, {
      direction: 'top'
      beyond: Math.min(@popover.outerHeight() + @arrow.outerHeight() - spaces.top, 0) * @popover.outerWidth() + Math.min(@popover.outerWidth() - @win.width(), 0) * @popover.outerHeight()
    }, {
      direction: 'bottom'
      beyond: Math.min(@popover.outerHeight() + @arrow.outerHeight() - spaces.top, 0) * @popover.outerWidth() + Math.min(@popover.outerWidth() - @win.width(), 0) * @popover.outerHeight()
    }].sort (a, b) ->
      return 1 if a.beyond > b.beyond
      -1

  _getDirections: ->
    return @opts.direction.split('-') if @opts.direction
    directions = [@_getSpacesCoefficient()[0].direction, 'top']
    directions[1] = 'center' if /top|bottom/.test directions[0]
    directions

  update: ->
    @directions = @_getDirections()
    @direction = "direction-#{ @directions.join('-') }"
    unless @direction in Position._directions
      throw new Error '[QingPopover] - direction is not valid'

    top = 0
    left = 0

    pointToOffset = @pointTo.offset()
    pointToWidth  = @pointTo.outerWidth()
    pointToHeight = @pointTo.outerHeight()
    popoverWidth  = @popover.outerWidth()
    popoverHeight = @popover.outerHeight()
    arrowWidth  = @arrow.width()
    arrowHeight = @arrow.height()
    arrowOffset = @opts.arrowOffset

    switch @directions[0]
      when 'left'
        left = pointToOffset.left - arrowWidth - popoverWidth
      when 'right'
        left = pointToOffset.left + pointToWidth + arrowWidth
      when 'top'
        top = pointToOffset.top - arrowHeight - popoverHeight
      when 'bottom'
        top = pointToOffset.top + pointToHeight + arrowHeight

    switch @directions[1]
      when 'top'
        top = pointToOffset.top + pointToHeight / 2 + arrowHeight / 2 + arrowOffset - popoverHeight
      when 'bottom'
        top = pointToOffset.top + pointToHeight / 2 - arrowHeight / 2 - arrowOffset
      when 'left'
        left = pointToOffset.left + pointToWidth / 2  + arrowWidth / 2 + arrowOffset - popoverWidth
      when 'right'
        left = pointToOffset.left + pointToWidth / 2  - arrowWidth / 2 - arrowOffset
      when 'center'
        left = pointToOffset.left + pointToWidth / 2  - popoverWidth / 2
      when 'middle'
        top = pointToOffset.top + pointToHeight / 2  - popoverHeight / 2

    # set align
    if /top|bottom/.test @directions[0]
      switch @opts.align
        when 'left'
          left -= pointToWidth / 2
        when 'right'
          left += pointToWidth / 2

    # set vertical align
    if /left|right/.test @directions[0]
      switch @opts.verticalAlign
        when 'top'
          top -= pointToHeight / 2
        when 'bottom'
          top += pointToHeight / 2

    @position = @_autoAdjustPosition @_adjustOffset({top: top, left: left})

  _autoAdjustPosition: (position)->
    left = position.left
    top = position.top

    scrollTop  = @doc.scrollTop()
    scrollLeft = @doc.scrollLeft()
    arrowOffset = @opts.arrowOffset

    if /top|bottom/.test(@directions[0]) and left < scrollLeft
      delta = scrollLeft - left
      left += delta

      switch @directions[1]
        when 'left'
          @arrow.css('right', arrowOffset + delta)
        when 'right'
          @arrow.css('left', Math.max(arrowOffset - delta, arrowOffset))
        else
          @arrow.css('marginLeft', -arrowOffset / 2 - delta)

    if /left|right/.test(@directions[0]) and top < scrollTop
      delta = scrollTop - top
      top += delta

      switch @directions[1]
        when 'top'
          @arrow.css('bottom', arrowOffset + delta)
        when 'bottom'
          @arrow.css('top', Math.max(arrowOffset - delta, arrowOffset))
        else
          @arrow.css('marginTop', -arrowOffset / 2 - delta)

    {top: top, left: left}

  _adjustOffset: (position) ->
    return position unless @opts.offset

    offset = @opts.offset
    offset = -offset if /top|left/.test @directions[0]

    position.top += offset if /top|bottom/.test @directions[0]
    position.left += offset if /left|right/.test @directions[0]
    position

module.exports = Position
