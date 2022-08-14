/**
 * Helpers to enable Immutable compatibility *without* bringing in
 * the 'immutable' package as a dependency.
 */

/**
 * Check if an object is immutable by checking if it has a key specific
 * to the immutable library.
 *
 * @param  {any} object
 * @return {boolean}
 */
export function isImmutable (object) {
  return !!(
    object &&
    typeof object.hasOwnProperty === 'function' &&
    // eslint-disable-next-line no-prototype-builtins
    (object.hasOwnProperty('__ownerID') || // Immutable.Map
      // eslint-disable-next-line no-prototype-builtins
      (object._map && object._map.hasOwnProperty('__ownerID')))
  ) // Immutable.Record
}
