class Popover extends QingModule

  @opts:
    qingPopover: null
    cls: null
    content: null

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
    @opts = $.extend {}, Popover.opts, @opts
    @qingPopover = @opts.qingPopover
    @_render()

  _render: ->
    @el = $(Popover._tpl).addClass @opts.cls
    @arrow = @el.find('.qing-popover-arrow')
    @content = @el.find('.qing-popover-content').append @opts.content
    @el.data 'qingPopover', @qingPopover
      .appendTo 'body'

  destroy: ->
    @el.remove()

module.exports = Popover
