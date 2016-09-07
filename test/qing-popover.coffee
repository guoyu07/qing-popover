QingPopover = require '../src/qing-popover'
expect = chai.expect

describe 'QingPopover', ->

  $el = null
  qingPopover = null

  before ->
    $el = $('<div class="test-el"></div>').appendTo 'body'

  after ->
    $el.remove()
    $el = null

  beforeEach ->
    qingPopover = new QingPopover
      el: '.test-el'

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
        el: '.not-exists'
    catch e

    expect(spy.calledWithNew()).to.be.true
    expect(spy.threw()).to.be.true
