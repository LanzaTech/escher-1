/**
 * BiggIndex is a 2 level index
 * The first index is a bigg_id, the second is an escherId
 * One reaction or metabolite can occur multiple tiems on the map.
 * Each of these occurrences share on bigg_id, but have different escherId
 */
export class BiggIndex {
  constructor() {
    this.index = new Map()
  }

  /**
   * Adds item to index. Will silently overwrite already existing items.
   * @param {*} bigg_id 
   * @param {*} escherId 
   * @param {*} data 
   */
  insert(bigg_id, escerId, escherNode) {
    if (!bigg_id || !escerId) {
      throw new Error('Keys should be truthy values.')
    }
    const biggBucket = this.index.get(bigg_id) || new Map()
    this.index.set(bigg_id, biggBucket.set(escerId, escherNode))
  }

  /**
   * Removes the items saved under bigg_id, escerId.
   * @param {*} bigg_id 
   * @param {*} escherId 
   */
  remove(bigg_id, escherId) {
    const biggBucket = this.index.get(bigg_id)
    if (biggBucket) {
      biggBucket.delete(escherId)
      if (!biggBucket.size) {
        this.index.delete(bigg_id)
      }
    }
  }

  /**
   * returns item for bigg_id, escherId.
   * 'escherId' is an optional argument, if not present, an element
   * with the passed bigg_id is returned. If there's no match, `undefined` is returned.
   * @param {*} bigg_id 
   * @param {*} escherId 
   */
  get(bigg_id, escherId) {
    const biggBucket = this.index.get(bigg_id)
    if (biggBucket && biggBucket.size) {
      return escherId !== undefined ? biggBucket.get(escherId)
        : biggBucket.values().next().value
    }
  }

  getAll(bigg_id) {
    const bucket = this.index.get(bigg_id)
    return bucket ? Array.from(bucket.values()) : []
  }

  keys() {
    return Array.from(this.index.keys());
  }

  /**
   * returns one item with the passed bigg_id, and returns it with the
   * corresponding escherId. If there's no match, `undefined` is returned.
   * @param {*} bigg_id 
   */
  getOneWithId(bigg_id) {
    const biggBucket = this.index.get(bigg_id)
    if (biggBucket && biggBucket.size) {
      const entries = Array.from(biggBucket.entries())
      entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      const [[escherId, escherNode]] = entries
      return {escherId, escherNode}
    }
  }

  /**
   * Utility function, checks if the item saved under bigg_id, escherId
   * is not null.
   * @param {*} bigg_id 
   * @param {*} escherId 
   */
  has(bigg_id, escherId) {
    return !!this.get(bigg_id, escherId)
  }
}
