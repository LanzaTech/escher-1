const BiggIndex = require('../BiggIndex').BiggIndex
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const assert = require('chai').assert

describe('BiggIndex', () => {
  let biggIndex

  beforeEach(() => {
    biggIndex = new BiggIndex()
  })

  it('can add new item', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    assert.deepEqual(biggIndex.get(543, 'b534'), {foo: 5, bar: 6})
  })

  it('should throw if the biggId is falsy', () => {
    assert.throws(biggIndex.insert.bind(null, '', 293, {foo: 5, bar: 6}), 'Keys should be truthy values.')
  })

  it('should throw if the escher_id is falsy', () => {
    assert.throws(biggIndex.insert.bind(null, 'b23', null, {foo: 5, bar: 6}), 'Keys should be truthy values.')
  })

  it('can hold multiple items in the same bucket', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    biggIndex.insert(543, 'b928', {foo: 8, bar: 10})
    assert.deepEqual(biggIndex.get(543, 'b534'), {foo: 5, bar: 6})
    assert.deepEqual(biggIndex.get(543, 'b928'), {foo: 8, bar: 10})
  })

  it('returns an added item if no escher id was specified', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    biggIndex.insert(543, 'b928', {foo: 8, bar: 10})
    try {
      assert.deepEqual(biggIndex.get(543), {foo: 5, bar: 6})
    } catch (e) {
      assert.deepEqual(biggIndex.get(543), {foo: 8, bar: 10})
    }
  })

  it('can tell if element exists', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    assert.isTrue(biggIndex.has(543, 'b534'))
    assert.isTrue(biggIndex.has(543))
    assert.isFalse(biggIndex.has(543, 'b782'))
  })

  it('works with multiple buckets', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    biggIndex.insert(872, 'b129', {foo: 8, bar: 2})
    assert.isTrue(biggIndex.has(543))
    assert.isTrue(biggIndex.has(872))
  })

  it('can remove item', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    assert.isTrue(biggIndex.has(543))
    biggIndex.remove(543, 'b534')
    assert.isFalse(biggIndex.has(543))
  })

  it('it safely removes an element', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    biggIndex.insert(543, 'b129', {foo: 8, bar: 2})
    assert.isTrue(biggIndex.has(543))

    biggIndex.remove(543, 'b534')

    assert.isTrue(biggIndex.has(543))
    assert.isTrue(biggIndex.has(543, 'b129'))
  })

  it('doesn\'t fail when attempting removing a missing entry', () => {
    biggIndex.remove(543, 'b534')
  })

  it('returns false for has if element was deleted', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    biggIndex.remove(543, 'b534')
    assert.isFalse(biggIndex.has(543))
  })

  it('returns one with EscherId', () => {
    biggIndex.insert(543, 'b534', {foo: 5, bar: 6})
    assert.deepEqual(biggIndex.getOneWithId(543), {escherId: 'b534', escherNode: {foo: 5, bar: 6}})
  })

  it('doesn\'t fail when bigg id is missing', () => {
    assert.equal(biggIndex.getOneWithId(543), null)
  })
})
