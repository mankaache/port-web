import { setConsoleFunction } from 'three'

/**
 * react-three-fiber's internal render loop still instantiates THREE.Clock
 * (see @react-three/fiber's Canvas store), which three.js has soft-deprecated
 * in favor of THREE.Timer as of r183. There's no stable r3f release yet that
 * has migrated off it, and we don't instantiate Clock ourselves, so there's
 * nothing in our own code to change. This filters just that one known,
 * harmless upstream warning via three's official console hook, leaving every
 * other three.js log/warn/error untouched.
 */
setConsoleFunction((type, message, ...params) => {
  if (message.includes('Clock: This module has been deprecated')) return
  console[type](message, ...params)
})
