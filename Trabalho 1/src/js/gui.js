const config = {
    lookAt: false,
    linearX: 0,
    linearY: 0,
    linearZ: 0,
    rotateAroundObject: false,
    angleA: 0,
    angleB: 0,
    rotationX: degToRad(20),
    rotationY: degToRad(20),
    rotationZ: degToRad(0),
    scale: {
        x: 1,
        y: 1,
        z: 1
    },
    camera: {
        cameraSelect: 0,
        position: {
            x: 0,
            y: 0,
            z: 100,
            enableLookAt: true
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        zoom: degToRad(60)
    }
}

const loadGUI = () => {
    const gui = new dat.GUI()

    const guiLinearTranslation = gui.addFolder('LinearTranslation')

    guiLinearTranslation.add(config, 'linearX', -100, 100, 1)
    guiLinearTranslation.add(config, 'linearY', -100, 100, 1)
    guiLinearTranslation.add(config, 'linearZ', -100, 100, 1)

    const guiLookAround = gui.addFolder('LookAroundObject')

    guiLookAround.add(config, 'rotateAroundObject')
    guiLookAround.add(config, 'angleA', -360, 360, 1)
    guiLookAround.add(config, 'angleB', -89, 89, 1)

    const guiAxisRotation = gui.addFolder('AxisRotation')

    guiAxisRotation.add(config, 'rotationX', 0, 20, 0.5)
    guiAxisRotation.add(config, 'rotationY', 0, 20, 0.5)
    guiAxisRotation.add(config, 'rotationZ', 0, 20, 0.5)

    gui.add(config, 'lookAt')

    const guiScaling = gui.addFolder('Scaling')

    guiScaling.add(config.scale, 'x', 0, 20, 0.01)
    guiScaling.add(config.scale, 'y', 0, 20, 0.01)
    guiScaling.add(config.scale, 'z', 0, 20, 0.01)

    const guiCamera = gui.addFolder('Camera')

    guiCamera.add(config.camera, 'cameraSelect', { freeCamera: 0, lookAt: 1, lookAround: 2 })

    guiCamera.add(config.camera, 'zoom', 0.001, 3, 0.001)

    const guiCameraTranslation = guiCamera.addFolder('Translation')

    guiCameraTranslation.add(config.camera.position, 'x', -500, 500, 1)
    guiCameraTranslation.add(config.camera.position, 'y', -500, 500, 1)
    guiCameraTranslation.add(config.camera.position, 'z', -500, 500, 1)

    const guiCameraRotation = guiCamera.addFolder('Rotation')

    guiCameraRotation.add(config.camera.rotation, 'x', -360, 360, 1)
    guiCameraRotation.add(config.camera.rotation, 'y', -360, 360, 1)
    guiCameraRotation.add(config.camera.rotation, 'z', -360, 360, 1)
}
