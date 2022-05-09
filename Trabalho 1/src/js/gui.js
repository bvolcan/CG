// Inicialização de todas as variáveis utilizadas com a interface de manipulação
let cubeSelect
let linearX
let linearY
let linearZ
let rotationX
let rotationY
let rotationZ

const config = {
    // Chamada da função de adicionar novo cubo
    addNewCube: () => {
        addNewObject()
        cubeSelect = cubeSelect
            .options(objectsToDraw.map((obj, index) => index))
            .onChange(value => {
                objectsToDraw[cubeSelect.initialValue].translation = [
                    objectsToDraw[cubeSelect.initialValue].translation[0] +
                        config.linearX -
                        config.camera.position.x,
                    objectsToDraw[cubeSelect.initialValue].translation[1] +
                        config.linearY -
                        config.camera.position.y,
                    objectsToDraw[cubeSelect.initialValue].translation[2] +
                        config.linearZ -
                        config.camera.position.z +
                        100
                ]

                linearX.setValue(0)
                linearY.setValue(0)
                linearZ.setValue(0)

                objectsToDraw[cubeSelect.initialValue].rotation = [
                    objectsToDraw[cubeSelect.initialValue].rotation[0] + config.rotationX,
                    objectsToDraw[cubeSelect.initialValue].rotation[1] + config.rotationY,
                    objectsToDraw[cubeSelect.initialValue].rotation[2] + config.rotationZ
                ]

                rotationX.setValue(0)
                rotationY.setValue(0)
                rotationZ.setValue(0)

                cubeSelect.initialValue = parseInt(value)
            })
    },
    // Chamada da função de remover o último cubo adicionado
    removeLastCube: () => {
        removeLastObject()
        cubeSelect = cubeSelect.options(objectsToDraw.map((obj, index) => index))
    },
    cubeSelect: 0,
    linearX: 0,
    linearY: 0,
    linearZ: 0,
    rotateAroundObject: false,
    angleA: 0,
    angleB: 0,
    rotationX: degToRad(0),
    rotationY: degToRad(0),
    rotationZ: degToRad(0),
    scale: {
        x: 1,
        y: 1,
        z: 1
    },
    camera: {
        cameraSelect: '0',
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
// Estruturação de toda a interface de manipulação
const loadGUI = () => {
    const gui = new dat.GUI()

    const guiCamera = gui.addFolder('Camera')

    const cameraSelect = guiCamera.add(config.camera, 'cameraSelect', {
        freeCamera: 0,
        lookAt: 1
    })

    guiCamera.add(config.camera, 'zoom', 0.001, 3, 0.001)

    const guiCameraRotation = guiCamera.addFolder('Rotation')

    let angleA
    let angleB

    let cameraRotationX = guiCameraRotation.add(config.camera.rotation, 'x', -360, 360, 1)
    let cameraRotationY = guiCameraRotation.add(config.camera.rotation, 'y', -360, 360, 1)
    let cameraRotationZ = guiCameraRotation.add(config.camera.rotation, 'z', -360, 360, 1)

    let guiCameraTranslation = guiCamera.addFolder('Translation')

    let cameraX = guiCameraTranslation.add(config.camera.position, 'x', -500, 500, 1)
    let cameraY = guiCameraTranslation.add(config.camera.position, 'y', -500, 500, 1)
    let cameraZ = guiCameraTranslation.add(config.camera.position, 'z', -500, 500, 1)

    const guiCubes = gui.addFolder('Cubes')

    const guiLinearTranslation = guiCubes.addFolder('LinearTranslation')

    linearX = guiLinearTranslation.add(config, 'linearX', -100, 100, 1)
    linearY = guiLinearTranslation.add(config, 'linearY', -100, 100, 1)
    linearZ = guiLinearTranslation.add(config, 'linearZ', -100, 100, 1)

    const guiAxisRotation = guiCubes.addFolder('AxisRotation')

    rotationX = guiAxisRotation.add(config, 'rotationX', 0, 20, 0.5)
    rotationY = guiAxisRotation.add(config, 'rotationY', 0, 20, 0.5)
    rotationZ = guiAxisRotation.add(config, 'rotationZ', 0, 20, 0.5)

    const guiScaling = guiCubes.addFolder('Scaling')

    guiScaling.add(config.scale, 'x', 0, 20, 0.01)
    guiScaling.add(config.scale, 'y', 0, 20, 0.01)
    guiScaling.add(config.scale, 'z', 0, 20, 0.01)

    guiCubes.add(config, 'addNewCube')
    guiCubes.add(config, 'removeLastCube')
    cubeSelect = guiCubes.add(
        config,
        'cubeSelect',
        objectsToDraw.map((obj, index) => index)
    )

    // Função para troca de câmeras
    ;(() => {
        cameraSelect.onChange(value => {
            if (value == 1) {
                cameraX.setValue(0)
                cameraY.setValue(0)
                cameraZ.setValue(100)

                cameraRotationX.setValue(0)
                cameraRotationY.setValue(0)
                cameraRotationZ.setValue(0)
                angleA = guiCameraRotation.add(config, 'angleA', -360, 360, 1)
                angleB = guiCameraRotation.add(config, 'angleB', -89, 89, 1)

                cameraRotationX.remove()
                cameraRotationY.remove()
                cameraRotationZ.remove()
                guiCamera.removeFolder(guiCameraTranslation)
            } else {
                guiCameraTranslation = guiCamera.addFolder('Translation')
                cameraX = guiCameraTranslation.add(config.camera.position, 'x', -500, 500, 1)
                cameraY = guiCameraTranslation.add(config.camera.position, 'y', -500, 500, 1)
                cameraZ = guiCameraTranslation.add(config.camera.position, 'z', -500, 500, 1)
                cameraX.setValue(0)
                cameraY.setValue(0)
                cameraZ.setValue(100)

                angleA.setValue(0)
                angleB.setValue(0)

                cameraRotationX = guiCameraRotation.add(config.camera.rotation, 'x', -360, 360, 1)
                cameraRotationY = guiCameraRotation.add(config.camera.rotation, 'y', -360, 360, 1)
                cameraRotationZ = guiCameraRotation.add(config.camera.rotation, 'z', -360, 360, 1)

                angleA.remove()
                angleB.remove()
            }
        })
    })()
}
