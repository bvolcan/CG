const { gl, meshProgramInfo } = initializeWorld()

const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20)

const cubeVAO = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, cubeBufferInfo)

const cubeUniforms = {
    u_colorMult: [1, 0.5, 0.5, 1],
    u_matrix: m4.identity()
}

const computeMatrix = (viewProjectionMatrix, translation, rotation, scale) => {
    let matrix = m4.translate(viewProjectionMatrix, translation[0], translation[1], translation[2])

    matrix = m4.scale(matrix, scale[0], scale[1], scale[2])

    matrix = m4.xRotate(matrix, rotation[0])
    matrix = m4.yRotate(matrix, rotation[1])
    matrix = m4.zRotate(matrix, rotation[2])

    return matrix
}

const computeCameraMatrix = (
    position,
    target,
    isLookingAt,
    isAroundObject,
    lookAroundAngles,
    cameraSelect
) => {
    const cameraTarget = isLookingAt ? target : [0, 0, 0]
    const up = [0, 1, 0]

    let cameraMatrix = isAroundObject
        ? [
              Math.sin(degToRad(lookAroundAngles[0])) *
                  Math.cos(degToRad(lookAroundAngles[1])) *
                  100,
              Math.sin(degToRad(lookAroundAngles[0])) *
                  Math.sin(degToRad(lookAroundAngles[1])) *
                  100,
              Math.cos(degToRad(lookAroundAngles[0])) * 100
          ]
        : position

    cameraMatrix = m4.lookAt(cameraMatrix, cameraTarget, up)
    if (!isAroundObject && !isLookingAt) {
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
        // [config.camera.position.x, config.camera.position.y, config.camera.position.z],
        [config.linearX, config.linearY, config.linearZ + 100],
        [config.linearX, config.linearY, config.linearZ],
        config.lookAt,
        config.rotateAroundObject,
        [config.angleA, config.angleB],
        config.camera.cameraSelect
    )

    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(cameraMatrix)

    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix)

    gl.useProgram(meshProgramInfo.program)

    // ------ Draw the cube --------

    // Setup all the needed attributes.
    gl.bindVertexArray(cubeVAO)

    cubeUniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        [config.linearX, config.linearY, config.linearZ],
        [config.rotationX, config.rotationY, config.rotationZ],
        [config.scale.x, config.scale.y, config.scale.z]
    )

    // Set the uniforms we just computed
    twgl.setUniforms(meshProgramInfo, cubeUniforms)

    twgl.drawBufferInfo(gl, cubeBufferInfo)
    requestAnimationFrame(render)
}
