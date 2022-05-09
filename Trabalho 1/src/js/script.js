const { gl, meshProgramInfo } = initializeWorld()

const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20)

const cubeVAO = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, cubeBufferInfo)

// Manipulação da posição dos cubos
const computeMatrix = (objectIndex, viewProjectionMatrix, translation, rotation, scale) => {
    let matrix = m4.translate(
        viewProjectionMatrix,

        config.camera.cameraSelect == 0
            ? objectIndex == config.cubeSelect
                ? translation[0] - config.camera.position.x + config.linearX
                : translation[0] - config.camera.position.x
            : objectIndex == config.cubeSelect
            ? translation[0] + config.linearX
            : translation[0],
        config.camera.cameraSelect == 0
            ? objectIndex == config.cubeSelect
                ? translation[1] - config.camera.position.y + config.linearY
                : translation[1] - config.camera.position.y
            : objectIndex == config.cubeSelect
            ? translation[1] + config.linearY
            : translation[1],
        config.camera.cameraSelect == 0
            ? objectIndex == config.cubeSelect
                ? translation[2] - config.camera.position.z + config.linearZ + 100
                : translation[2] - config.camera.position.z + 100
            : objectIndex == config.cubeSelect
            ? translation[2] + config.linearZ
            : translation[2]
    )

    // Escala
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2])

    // Rotação
    matrix = m4.xRotate(
        matrix,
        objectIndex == config.cubeSelect ? rotation[0] + config.rotationX : rotation[0]
    )
    matrix = m4.yRotate(
        matrix,
        objectIndex == config.cubeSelect ? rotation[1] + config.rotationY : rotation[1]
    )
    matrix = m4.zRotate(
        matrix,
        objectIndex == config.cubeSelect ? rotation[2] + config.rotationZ : rotation[2]
    )

    return matrix
}

// Alterações de camera
const computeCameraMatrix = (target, cameraType, lookAroundAngles) => {
    const cameraTarget =
        cameraType == 1
            ? [
                  objectsToDraw[config.cubeSelect].translation[0] + config.linearX,
                  objectsToDraw[config.cubeSelect].translation[1] + config.linearY,
                  objectsToDraw[config.cubeSelect].translation[2] + config.linearZ
              ]
            : [0, 0, 0]
    const up = [0, 1, 0]

    let cameraMatrix =
        cameraType == 1
            ? [
                  Math.sin(degToRad(lookAroundAngles[0])) *
                      Math.cos(degToRad(lookAroundAngles[1])) *
                      100,
                  Math.sin(degToRad(lookAroundAngles[0])) *
                      Math.sin(degToRad(lookAroundAngles[1])) *
                      100,
                  Math.cos(degToRad(lookAroundAngles[0])) * 100
              ]
            : [0, 0, 100]

    cameraMatrix = m4.lookAt(cameraMatrix, cameraTarget, up)
    if (!cameraType != 1) {
        cameraMatrix = m4.xRotate(cameraMatrix, degToRad(config.camera.rotation.x))
        cameraMatrix = m4.yRotate(cameraMatrix, degToRad(config.camera.rotation.y))
        cameraMatrix = m4.zRotate(cameraMatrix, degToRad(config.camera.rotation.z))
    }

    return cameraMatrix
}

const render = () => {
    twgl.resizeCanvasToDisplaySize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)

    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
    const projectionMatrix = m4.perspective(config.camera.zoom, aspect, 1, 2000)

    // Compute the camera's matrix using look at.
    const cameraMatrix = computeCameraMatrix(
        [config.linearX, config.linearY, config.linearZ],
        config.camera.cameraSelect,
        [config.angleA, config.angleB]
    )

    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(cameraMatrix)

    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

    // Utilização de laço para manipular cada um dos cubos criados
    objectsToDraw.forEach((object, index) => {
        object.uniforms.u_matrix = computeMatrix(
            index,
            viewProjectionMatrix,
            [object.translation[0], object.translation[1], object.translation[2]],
            [object.rotation[0], object.rotation[1], object.rotation[2]],
            [config.scale.x, config.scale.y, config.scale.z]
        )

        gl.useProgram(meshProgramInfo.program)
        gl.bindVertexArray(cubeVAO)

        twgl.setUniforms(meshProgramInfo, cubeUniforms)
        twgl.drawBufferInfo(gl, cubeBufferInfo)
    })

    requestAnimationFrame(render)
}
