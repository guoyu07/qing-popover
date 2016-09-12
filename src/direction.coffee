class Direction extends QingModule

  @opts:
    pointTo: null
    popover: null
    direction: null

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
    @opts = $.extend {}, Direction.opts, @opts
    @pointTo = @opts.pointTo
    @popover = @opts.popover
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

  update: ->
    if @opts.direction
      directions = @opts.direction.split('-')
    else
      spaces = @_getSpaces()

      spaceCoefficient = [{
        direction: 'right'
        beyond: Math.max(@popover.outerWidth() - spaces.right, 0) * @popover.outerHeight() + Math.max(@popover.outerHeight() - @win.height(), 0) * @popover.outerWidth()
      }, {
        direction: 'left'
        beyond: Math.max(@popover.outerWidth() - spaces.left, 0) * @popover.outerHeight() + Math.max(@popover.outerHeight() - @win.height(), 0) * @popover.outerWidth()
      }, {
        direction: 'bottom'
        beyond: Math.max(@popover.outerHeight() - spaces.bottom, 0) * @popover.outerWidth() + Math.max(@popover.outerWidth() - @win.width(), 0) * @popover.outerHeight()
      }, {
        direction: 'top'
        beyond: Math.max(@popover.outerHeight() - spaces.top, 0) * @popover.outerWidth() + Math.max(@popover.outerWidth() - @win.width(), 0) * @popover.outerHeight()
      }].sort (a, b) ->
        return 1 if a.beyond > b.beyond
        -1

      directions = [spaceCoefficient[0].direction]

      if /top|bottom/.test directions[0]
        directions[1] = 'center'
      else if /left|right/.test directions[0]
        directions[1] = if spaces.top > spaces.bottom then 'top' else 'bottom'

    @directions = directions
    unless @toString() in Direction._directions
      throw new Error '[QingPopover] - direction is not valid'

  toString: ->
    "direction-#{ @directions.join('-') }"

module.exports = Direction
