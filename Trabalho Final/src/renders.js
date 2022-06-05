// CAMERA
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500)
camera.position.set(-35, 70, 100)
camera.lookAt(new THREE.Vector3(0, 0, 0))

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

// WINDOW RESIZE HANDLING
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize)

// SCENE
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfd1e5)

// CONTROLS
const cameraControls = new THREE.OrbitControls(camera, renderer.domElement)
cameraControls.enablePan = false
cameraControls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
}

// ambient light
const hemiLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(hemiLight)

//Add directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(-30, 50, -30)
scene.add(dirLight)
dirLight.castShadow = true
dirLight.shadow.mapSize.width = 2048
dirLight.shadow.mapSize.height = 2048
dirLight.shadow.camera.left = -70
dirLight.shadow.camera.right = 70
dirLight.shadow.camera.top = 70
dirLight.shadow.camera.bottom = -70

const raycaster = new THREE.Raycaster() // create once
const clickMouse = new THREE.Vector2() // create once
const moveMouse = new THREE.Vector2() // create once
const timer = new THREE.Clock()
let currentLevel = 1
let sceneObjects
let draggable
let isClicked = false
let mousePosition

const intersect = pos => {
    raycaster.setFromCamera(pos, camera)
    return raycaster.intersectObjects(scene.children)
}

window.addEventListener('mousedown', event => {
    if (event.button === 0) isClicked = true
})

window.addEventListener('mouseup', event => {
    if (event.button === 0) isClicked = false
})

window.addEventListener('mousemove', event => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})

const objectMovement = () => {
    mousePosition = intersect(moveMouse).find(obj => obj.object.id === floor.id)

    for (object of sceneObjects) {
        if (object.geometry.type === 'BoxGeometry' && object.userData.isGround === false) {
            object.BB.copy(object.geometry.boundingBox).applyMatrix4(object.matrixWorld)
        }

        const objectPositionReference = {
            x: object.position.x - mousePosition?.point.x,
            z: object.position.z - mousePosition?.point.z
        }

        const mouseRelativeAngle = Math.atan2(objectPositionReference.x, objectPositionReference.z)

        if (object.userData.name === 'SPHERE') {
            if (object.position.x >= 47.5) {
                object.position.x -= 1
            }
            if (object.position.x <= -47.5) {
                object.position.x += 1
            }
            if (object.position.z >= 47.5) {
                object.position.z -= 1
            }
            if (object.position.z <= -47.5) {
                object.position.z += 1
            }
        }

        if (
            isClicked &&
            object.userData.name === 'SPHERE' &&
            Math.abs(objectPositionReference.x) < 7 &&
            Math.abs(objectPositionReference.z) < 7
        ) {
            if (mouseRelativeAngle === 90 || mouseRelativeAngle === -90) {
                object.position.x +=
                    0.5 * object.position.x < 0
                        ? -Math.sin(-mouseRelativeAngle)
                        : Math.sin(-mouseRelativeAngle)
                object.position.z += 0.5 * Math.cos(-mouseRelativeAngle)

                if (checkCollision(object)) {
                    object.position.x -=
                        2 * object.position.x < 0
                            ? -Math.sin(-mouseRelativeAngle)
                            : Math.sin(-mouseRelativeAngle)
                    object.position.z -= 2 * Math.cos(-mouseRelativeAngle)
                }
            } else if (mouseRelativeAngle > 0) {
                object.position.x += 0.5 * -Math.sin(mouseRelativeAngle - Math.PI)
                object.position.z +=
                    0.5 * object.position.z < 0
                        ? -Math.cos(mouseRelativeAngle - Math.PI)
                        : -Math.cos(mouseRelativeAngle + Math.PI)

                if (checkCollision(object)) {
                    object.position.x -= 2 * -Math.sin(mouseRelativeAngle - Math.PI)
                    object.position.z -=
                        2 * object.position.z < 0
                            ? -Math.cos(mouseRelativeAngle - Math.PI)
                            : -Math.cos(mouseRelativeAngle + Math.PI)
                }
            } else {
                object.position.x += 0.5 * -Math.sin(mouseRelativeAngle + Math.PI)
                object.position.z +=
                    0.5 * object.position.z < 0
                        ? -Math.cos(mouseRelativeAngle + Math.PI)
                        : -Math.cos(mouseRelativeAngle - Math.PI)

                if (checkCollision(object)) {
                    object.position.x -= 2 * -Math.sin(mouseRelativeAngle + Math.PI)
                    object.position.z -=
                        2 * object.position.z < 0
                            ? -Math.cos(mouseRelativeAngle + Math.PI)
                            : -Math.cos(mouseRelativeAngle - Math.PI)
                }
            }
        }
    }
}

const checkCollision = object => {
    object.BB.copy(object.geometry.boundingBox).applyMatrix4(object.matrixWorld)
    const collided = sceneObjects.find(obj =>
        object.id === obj.id || obj.userData.isGround === true
            ? false
            : object.BB.intersectsBox(obj.BB)
    )

    if (collided) {
        const contains = checkIfContains(object)
        if (contains) removeObjects([contains, object])
        if (collided.userData.name === 'BOX') return false
        return collided
    }

    return false
}

const checkIfContains = object => {
    const boxes = scene.children.filter(child => child.userData.name === 'BOX')

    const boxContaining = boxes.find(
        box => box.BB.containsBox(object.BB) && box.userData.color === object.userData.color
    )

    return boxContaining
}

const animate = () => {
    showTimer()
    sceneObjects = scene.children.filter(child => child.userData.isGround === false)
    if (sceneObjects.length === 0) {
        currentLevel++
        if (currentLevel > 5) endGame()
        addObjects(currentLevel)
    }
    objectMovement()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

const floor = createFloor()
addObjects(currentLevel)
