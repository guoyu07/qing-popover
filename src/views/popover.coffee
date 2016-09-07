class Popover extends QingModule

  @opts:
    pointTo: null
    cls:                 null
    content:             null
    position:            null
    offset:              null
    autohide:            true
    align:               "center"
    verticalAlign:       "middle"
    autoAdjustPosition:  true

  @arrowOffset = 16

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

  @_tpl: """
    <div class="qing-popover">
      <div class="qing-popover-content"></div>
      <div class="qing-popover-arrow">
        <i class="arrow arrow-shadow-1"></i>
        <i class="arrow arrow-shadow-0"></i>
        <i class="arrow arrow-border"></i>
        <i class="arrow arrow-basic"></i>
      </div>
    </div>
  """

  constructor: (opts) ->
    super
    @opts = $.extend {}, Popover.opts, @opts
    @pointTo = @opts.pointTo
    @_render()
    @_bind()
    @refresh()

  _render: ->
    @el = $(Popover._tpl).addClass @opts.cls
    @arrow = @el.find('.qing-popover-arrow')
    @content = @el.find('.simple-popover-content')
    @content.append @opts.content
    @el.appendTo 'body'

  _bind: ->
    if @opts.autohide
      $(document).on "mousedown.qing-popover", (e) =>
        target = $ e.target
        return if target.is(@pointTo) or @el.has(target).length or target.is(@el)
        @trigger 'autohide'

  refresh: ->
    @el.removeClass Popover._directions.join(' ')
    @arrow.css
      top: ''
      bottom: ''
      left: ''
      right: ''

    @directions = @_directions()
    direction = "direction-#{ @directions.join('-') }"
    unless direction in Popover._directions
      throw new Error '[QingPopover] - position is not valid'

    @position = @_position()

    @el.addClass direction
      .css @position

  _directions: ->
    return @opts.position.split('-') if @opts.position

    pointToOffset = @pointTo.offset()
    pointToWidth  = @pointTo.outerWidth()
    pointToHeight = @pointTo.outerHeight()
    popoverWidth  = @el.outerWidth()
    arrowWidth  = @arrow.width()
    arrowHeight = @arrow.height()
    arrowOffset = Popover.arrowOffset
    winHeight = $(window).height()
    winWidth = $(window).width()
    scrollTop  = $(document).scrollTop()
    scrollLeft = $(document).scrollLeft()

    leftSpace = pointToOffset.left - scrollLeft
    rightSpace = scrollLeft + winWidth - pointToOffset.left - pointToWidth
    topSpace = pointToOffset.top - scrollTop
    bottomSpace = scrollTop + winHeight - pointToOffset.top - pointToHeight

    directions = ['right', 'bottom']

    if rightSpace < popoverWidth + arrowOffset and
    leftSpace > rightSpace and
    leftSpace > popoverWidth + arrowOffset
      direction[0] = 'left'

    if topSpace > bottomSpace
      direction[1] = 'top'

    directions

  _position: ->
    top = 0
    left = 0

    pointToOffset = @pointTo.offset()
    pointToWidth  = @pointTo.outerWidth()
    pointToHeight = @pointTo.outerHeight()
    popoverWidth  = @el.outerWidth()
    popoverHeight = @el.outerHeight()
    arrowWidth  = @arrow.width()
    arrowHeight = @arrow.height()
    arrowOffset = Popover.arrowOffset

    switch @directions[0]
      when 'left'
        left = pointToOffset.left - arrowHeight - popoverWidth
      when 'right'
        left = pointToOffset.left + pointToWidth + arrowHeight
      when 'top'
        top = pointToOffset.top - arrowHeight - popoverHeight
      when 'bottom'
        top = pointToOffset.top + pointToHeight + arrowHeight

    switch @directions[1]
      when 'top'
        top = pointToOffset.top + pointToHeight / 2 + arrowWidth / 2 + arrowOffset - popoverHeight
      when 'bottom'
        top = pointToOffset.top + pointToHeight / 2 - arrowWidth / 2 - arrowOffset
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
        when "top"
          top -= pointToHeight / 2
        when "bottom"
          top += pointToHeight / 2

    @_autoAdjustPosition @_adjustOffset({top: top, left: left})

  _autoAdjustPosition: (position)->
    return position unless @opts.autoAdjustPosition

    left = position.left
    top = position.top

    scrollTop  = $(document).scrollTop()
    scrollLeft = $(document).scrollLeft()
    arrowOffset = Popover.arrowOffset

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

    yOffset = @opts.offset.y
    xOffset = @opts.offset.x

    if yOffset
      yOffset = -yOffset if @directions[0] is 'top'
      position.top += yOffset

    if xOffset
      xOffset = -xOffset if @directions[0] is 'left'
      position.left += xOffset

    position

  destroy: ->
    $(document).off '.qing-popover'
    @el.remove()

module.exports = Popover
