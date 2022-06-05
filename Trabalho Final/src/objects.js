const createFloor = () => {
    const pos = { x: 0, y: -1, z: 0 }
    const scale = { x: 100, y: 2, z: 100 }

    const blockPlane = new THREE.Mesh(
        new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({ color: 0xf9c834 })
    )
    blockPlane.position.set(pos.x, pos.y, pos.z)
    blockPlane.scale.set(scale.x, scale.y, scale.z)
    blockPlane.castShadow = true
    blockPlane.receiveShadow = true
    scene.add(blockPlane)

    blockPlane.userData.isGround = true

    return blockPlane
}

const createBox = color => {
    const scale = { x: 6, y: 6, z: 6 }
    const pos = { x: rand(-47.5, 47.5), y: scale.y / 2, z: rand(-47.5, 47.5) }

    const box = new THREE.Mesh(
        new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({ color: color, transparent: true, opacity: 0.5 })
    )
    box.position.set(pos.x, pos.y, pos.z)
    box.scale.set(scale.x, scale.y, scale.z)
    box.castShadow = true
    box.receiveShadow = true
    scene.add(box)

    box.oldPosition = box.position
    box.userData.draggable = true
    box.userData.name = 'BOX'
    box.userData.isGround = false
    box.userData.color = color

    box.BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    box.BB.setFromObject(box)

    return box
}

const createSphere = color => {
    const radius = 2
    const pos = { x: rand(-47.5, 47.5), y: radius, z: rand(-47.5, 47.5) }

    const sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({
            color: color
        })
    )
    sphere.position.set(pos.x, pos.y, pos.z)
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)

    sphere.oldPosition = sphere.position
    sphere.userData.draggable = true
    sphere.userData.name = 'SPHERE'
    sphere.userData.isGround = false
    sphere.userData.color = color

    sphere.BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    sphere.BB.setFromObject(sphere)

    return sphere
}

const addObjects = (objects = 5) => {
    for (let index = 0; index < objects; index++) {
        const matchingColor = Math.random() * 0xffffff
        createSphere(matchingColor)
        createBox(matchingColor)
    }
}

const removeObjects = objects => {
    objects.forEach(object => {
        object.geometry.dispose()
        object.material.dispose()
        scene.remove(object)
    })
}
