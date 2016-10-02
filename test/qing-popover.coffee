QingPopover = require '../src/qing-popover'
Direction = require '../src/direction'
Position = require '../src/position'
expect = chai.expect

describe 'QingPopover', ->

  $pointTo = null
  qingPopover = null

  before ->
    $pointTo = $('<span class="test-el">click me</span>').appendTo 'body'

  after ->
    $pointTo.remove()
    $pointTo = null

  beforeEach ->
    qingPopover = new QingPopover
      pointTo: '.test-el'
      content: 'test'

  afterEach ->
    qingPopover.destroy()
    qingPopover = null

  it 'should inherit from QingModule', ->
    expect(qingPopover).to.be.instanceof QingModule
    expect(qingPopover).to.be.instanceof QingPopover

  it 'should throw error when element not found', ->
    spy = sinon.spy QingPopover
    try
      new spy
        pointTo: '.not-exists'
    catch e

    expect(spy.calledWithNew()).to.be.true
    expect(spy.threw()).to.be.true

  it 'should be unique', ->
    qingPopover = new QingPopover
      pointTo: '.test-el'
      content: 'hello'

    expect($('body > .qing-popover').length).to.equal(1)
    expect($('body > .qing-popover:contains("hello")').length).to.equal(1)

  it 'should response to window resize', ->
    spy = sinon.spy qingPopover, 'refresh'
    $(window).resize()
    expect(spy.calledOnce).to.be.true

describe 'autohide', ->

  $pointTo = null
  qingPopover = null

  before ->
    $pointTo = $('<span class="test-el">click me</span>').appendTo 'body'

  after ->
    $pointTo.remove()
    $pointTo = null

  afterEach ->
    qingPopover.destroy()
    qingPopover = null

  it 'should not hide on autohide:false', ->
    qingPopover = new QingPopover
      pointTo: '.test-el'
      content: 'test'
      autohide: false

    $(document).click()
    expect($('body > .qing-popover').length).to.equal(1)

  it 'should hide on autohide:true', ->
    qingPopover = new QingPopover
      pointTo: '.test-el'
      content: 'test'
      autohide: true

    qingPopover.el.trigger('mousedown')
    expect($('body > .qing-popover').length).to.equal(1)

    $(document).mousedown()
    expect($('body > .qing-popover').length).to.equal(0)

describe 'Direction', ->

  $pointTo = null
  $popover = null
  direction = null

  before ->
    $pointTo = $('<span class="test-el">click me</span>').appendTo 'body'
    $popover = $(QingPopover._tpl).find('.qing-popover-content').append('hello')
                              .end().appendTo 'body'

  after ->
    $pointTo.remove()
    $popover.remove()
    $pointTo = null
    $popover = null

  afterEach ->
    direction = null

  it 'should throw error on specific wrong direction', ->
    direction = new Direction
      pointTo: $pointTo
      popover: $popover
      direction: 'xxx-center'

    spy = sinon.spy direction, 'update'

    try
      direction.update()
    catch e

    expect(spy.threw()).to.be.true

  it 'should using specific direction', ->
    direction = new Direction
      pointTo: $pointTo
      popover: $popover
      direction: 'top-center'

    direction.update()
    expect(direction.toString()).to.equal 'direction-top-center'

  it 'should auto calculate direction without specific direction', ->
    $popover.width(200).height(300)
    $pointTo.css
      position: 'absolute'
      top: 40
      left: 40

    direction = new Direction
      pointTo: $pointTo
      popover: $popover

    direction.update()
    expect(direction.toString()).to.equal 'direction-right-bottom'

    $pointTo.css
      top: 40
      left: 'auto'
      right: 40

    direction.update()
    expect(direction.toString()).to.equal 'direction-left-bottom'

    $pointTo.css
      top: 'auto'
      bottom: 40
      right: 40

    direction.update()
    expect(direction.toString()).to.equal 'direction-left-top'

    $pointTo.css
      left: 40
      bottom: 40
      right: 'auto'

    direction.update()
    expect(direction.toString()).to.equal 'direction-right-top'

describe 'Position', ->

  $pointTo = null
  $popover = null

  before ->
    $pointTo = $('<span class="test-el">click me</span>').appendTo 'body'
    $popover = $(QingPopover._tpl).find('.qing-popover-content').append('hello')
                              .end().appendTo 'body'

  after ->
    $pointTo.remove()
    $popover.remove()
    $pointTo = null
    $popover = null

  it 'should offset', ->
    oldPosition = new Position
      pointTo: $pointTo
      popover: $popover

    oldPosition.update ['bottom', 'center']

    newPosition = new Position
      pointTo: $pointTo
      popover: $popover
      offset: 10

    newPosition.update ['bottom', 'center']

    expect(newPosition.opts.offset).to.equal(10)
    expect(newPosition.top - oldPosition.top).to.equal(10)
