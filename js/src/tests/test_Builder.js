const require_helper = require('./helpers/require_helper')
const Builder = require_helper('Builder')

const d3_body = require('./helpers/d3_body')

// Should test for the broken function that use utils.draw_array/object

const get_map = require('./helpers/get_map').get_map
const get_small_map = require('./helpers/get_map').get_small_map
const get_model = require('./helpers/get_model').get_model
const get_small_model = require('./helpers/get_model').get_small_model

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const sinon = require('sinon')

function make_parent_sel (s) {
  return s.append('div').style('width', '100px').style('height', '100px')
}

describe('Builder', () => {
  it('Small map, no model. Multiple instances.', function() {
    this.slow(10000)
    const sels = []
    for (let i = 0, l = 3; i < l; i++) {
      const sel = make_parent_sel(d3_body)
      const b = Builder(get_map(), null, '', sel,
        { never_ask_before_quit: true })

      assert.strictEqual(sel.select('svg').node(), b.map.svg.node())
      assert.strictEqual(sel.selectAll('#nodes').size(), 1)
      assert.strictEqual(sel.selectAll('.node').size(), 79)
      assert.strictEqual(sel.selectAll('#reactions').size(), 1)
      assert.strictEqual(sel.selectAll('.reaction').size(), 18)
      assert.strictEqual(sel.selectAll('#text-labels').size(), 1)
      sels.push(sel)
    }
    sels.map(sel => sel.remove())
  }).timeout(10000)

  it('check for model+highlight_missing bug', () => {
    Builder(get_map(), get_model(), '', make_parent_sel(d3_body),
      { never_ask_before_quit: true, highlight_missing: true })
  })

  it('SVG selection error', () => {
    const sel = make_parent_sel(d3_body).append('svg').append('g')
    assert.throws(() => {
      Builder(null, null, '', sel, { never_ask_before_quit: true })
    }, /Builder cannot be placed within an svg node/)
  })

  it('fix scales', () => {
    const sel = make_parent_sel(d3_body)
    const b = Builder(
      null, null, '', sel,
      { reaction_scale: [{ type: 'median', color: '#9696ff', size: 8 }],
        never_ask_before_quit: true }
    )
    assert.deepEqual(b.options.reaction_scale,
      [
        { type: 'median', color: '#9696ff', size: 8 },
        { type: 'min', color: '#ffffff', size: 10 },
        { type: 'max', color: '#ffffff', size: 10 }
      ])
  })

  it('fix scales after callback', () => {
    const sel = make_parent_sel(d3_body)
    const b2 = Builder(null, null, '', sel, { metabolite_scale: [
      { type: 'median', color: 'red', size: 0 },
      { type: 'min', color: 'red', size: 0 },
      { type: 'max', color: 'red', size: 0 }
    ], never_ask_before_quit: true })
    b2.settings.set_conditional('metabolite_scale', [{ type: 'median', color: '#9696ff', size: 8 }])
    assert.deepEqual(b2.options.metabolite_scale,
      [
        { type: 'median', color: '#9696ff', size: 8 },
        { type: 'min', color: '#ffffff', size: 10 },
        { type: 'max', color: '#ffffff', size: 10 }
      ])
  })

  describe('set_added_reactions', () => {
    // it('draws added reactions', () => {
    //   const builder = Builder(get_small_map(), get_small_model(), '', make_parent_sel(d3_body),
    //     { never_ask_before_quit: true, highlight_missing: true })
    //   sinon.spy(builder.map, 'draw_added_reactions')
    //   builder.set_added_reactions(['foo', 'bar'])
    //   assert.deepEqual(builder.map.draw_added_reactions.getCall(0).args[0], ['foo', 'bar'])
    // })

    // it('doesn\'t redraw reactions', () => {
    //   const builder = Builder(get_small_map(), get_small_model(), '', make_parent_sel(d3_body),
    //     { never_ask_before_quit: true, highlight_missing: true })
    //   sinon.spy(builder.map, 'draw_added_reactions')
    //   builder.set_added_reactions(['foo'])
    //   assert.deepEqual(builder.map.draw_added_reactions.getCall(0).args[0], ['foo'])
    //   builder.set_added_reactions(['foo', 'bar'])
    //   assert.deepEqual(builder.map.draw_added_reactions.getCall(1).args[0], ['bar'])
    // })
  })
})
