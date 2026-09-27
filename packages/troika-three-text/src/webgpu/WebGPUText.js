import { DoubleSide, IntType } from 'three'
import { Text } from "../Text.js";
import { createTextDerivedNodeMaterial } from './TextDerivedNodeMaterial.js'
import { MeshBasicNodeMaterial } from "three/webgpu";

const defaultMaterialWebGPU = /*#__PURE__*/ new MeshBasicNodeMaterial({
  color: 0xffffff,
  side: DoubleSide,
  transparent: true
})

/**
 * @class WebGPUText
 *
 * Variant of the Text class that uses materials compatible with THREE.WebGPURenderer.
 */
class WebGPUText extends Text {

  constructor() {
    super()
    // The TSL shader reads the glyph index as an integer; rebuild the (still empty) attribute
    // with that binding before anything renders.
    this.geometry.glyphIndexGpuType = IntType
    this.geometry.updateGlyphs(new Float32Array(), new Uint16Array(), [], [], new Uint8Array())
    // updateGlyphs opens the draw range; like GlyphsGeometry, draw nothing until the first sync.
    this.geometry.setDrawRange(0, 0)
  }

  /**
   * Create the text derived material from the base material. Can be overridden to use a custom
   * derived material.
   */
  createDerivedMaterial(baseMaterial) {
    return createTextDerivedNodeMaterial(baseMaterial)
  }

  // Handler for automatically wrapping the base material with our upgrades. We do the wrapping
  // lazily on _read_ rather than write to avoid unnecessary wrapping on transient values.
  get material() {
    // use a node material as default
    this._baseMaterial || this._defaultMaterial || (this._defaultMaterial = defaultMaterialWebGPU.clone())
    return super.material
  }
  set material(baseMaterial) {
    super.material = baseMaterial
  }
}


export {
  WebGPUText
}
