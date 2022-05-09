const cubeUniforms = {
    u_colorMult: [1, 0.5, 0.5, 1],
    u_matrix: m4.identity()
}

objectConfig = {
    linearX: 0,
    linearY: 0,
    linearZ: 0
}

objectsToDraw = [
    {
        translation: [objectConfig.linearX, objectConfig.linearY, objectConfig.linearZ],
        rotation: [degToRad(20), degToRad(20), degToRad(0)],
        uniforms: cubeUniforms
    }
]

// Criação de novos cubos
const addNewObject = (translate = [0, 0, 0]) => {
    objectsToDraw.push({
        translation: [
            translate[0] + rand(-100, 100),
            translate[1] + rand(-100, 100),
            translate[2] + rand(-150, -50)
        ],
        rotation: [degToRad(20), degToRad(20), degToRad(0)],
        uniforms: cubeUniforms
    })
}

const removeLastObject = () => objectsToDraw.pop()
