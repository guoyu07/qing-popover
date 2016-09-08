QingPopover = require '../src/qing-popover'
Popover = require '../src/popover'
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

    qingPopover.popover.el.trigger('mousedown')
    expect($('body > .qing-popover').length).to.equal(1)

    $(document).mousedown()
    expect($('body > .qing-popover').length).to.equal(0)

describe 'Position', ->

  $pointTo = null
  $popover = null
  position = null

  before ->
    $pointTo = $('<span class="test-el">click me</span>').appendTo 'body'
    $popover = $(Popover._tpl).find('.qing-popover-content').append('hello')
                              .end().appendTo 'body'

  after ->
    $pointTo.remove()
    $popover.remove()
    $pointTo = null
    $popover = null

  afterEach ->
    position = null

  it 'should throw error on specific wrong direction', ->
    position = new Position
      pointTo: $pointTo
      popover: $popover
      direction: 'xxx-center'

    spy = sinon.spy position, 'update'

    try
      position.update()
    catch e

    expect(spy.threw()).to.be.true

  it 'should using specific direction', ->
    position = new Position
      pointTo: $pointTo
      popover: $popover
      direction: 'top-center'

    position.update()
    expect(position.direction).to.equal 'direction-top-center'

  it 'should offset', ->
    position = new Position
      pointTo: $pointTo
      popover: $popover

    position.update()
    oldPos = position.position

    position = new Position
      pointTo: $pointTo
      popover: $popover
      offset: 10

    position.update()
    newPos = position.position

    expect(position.direction).to.equal('direction-right-top')
    expect(newPos.left - oldPos.left).to.equal(10)
