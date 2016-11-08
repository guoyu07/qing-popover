class Direction extends QingModule

  @opts:
    pointTo: null
    popover: null
    direction: null
    boundarySelector: null

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

  _setOptions: (opts) ->
    super
    $.extend @opts, Direction.opts, opts

  _init: ->
    @pointTo = @opts.pointTo
    @popover = @opts.popover
    @boundary = @pointTo.closest(@opts.boundarySelector)
    @boundary = $(window) unless @boundary.length

  _getSpaces: ($el) ->
    return {
      left: 0, right: 0, top: 0, bottom: 0
    } if $el[0] is window

    offset = $el.offset()
    width = $el.outerWidth()
    height = $el.outerHeight()

    {
      left: offset.left - $(window).scrollLeft()
      right: $(window).scrollLeft() + $(window).width() - offset.left - width
      top: offset.top - $(window).scrollTop()
      bottom: $(window).scrollTop() + $(window).height() - offset.top - height
    }

  update: ->
    if @opts.direction
      directions = @opts.direction.split('-')
    else
      beyond = @_spaceCoefficient()

      vertical = if beyond.top > 0
                   'bottom'
                 else if beyond.top >= beyond.bottom
                   'bottom'
                 else
                   'top'

      horizental = if beyond.left > 0
                     'right'
                   else if beyond.left >= beyond.right
                     'right'
                   else
                     'left'

      directions = if beyond[vertical] > beyond[horizental]
                     horizental
                   else
                     vertical

      directions = [directions]

      if /top|bottom/.test directions[0]
        directions[1] = horizental
      else if /left|right/.test directions[0]
        directions[1] = vertical

    @directions = directions
    unless @toString() in Direction._directions
      throw new Error '[QingPopover] - direction is not valid'

  _spaceCoefficient: ->
    pointToSpaces = @_getSpaces @pointTo
    boundarySpaces = @_getSpaces @boundary

    spaces = ['left', 'right', 'top', 'bottom'].reduce (spaces, name) ->
      spaces[name] = pointToSpaces[name] - boundarySpaces[name]
      spaces
    , {}

    {
      left: Math.max(@popover.outerWidth() - spaces.left, 0) * @popover.outerHeight() + Math.max(@popover.outerHeight() - @boundary.height(), 0) * @popover.outerWidth()
      right: Math.max(@popover.outerWidth() - spaces.right, 0) * @popover.outerHeight() + Math.max(@popover.outerHeight() - @boundary.height(), 0) * @popover.outerWidth()
      top: Math.max(@popover.outerHeight() - spaces.top, 0) * @popover.outerWidth() + Math.max(@popover.outerWidth() - @boundary.width(), 0) * @popover.outerHeight()
      bottom: Math.max(@popover.outerHeight() - spaces.bottom, 0) * @popover.outerWidth() + Math.max(@popover.outerWidth() - @boundary.width(), 0) * @popover.outerHeight()
    }

  toString: ->
    "direction-#{ @directions.join('-') }"

module.exports = Direction
