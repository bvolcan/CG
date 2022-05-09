// Graus para radianos
const degToRad = d => (d * Math.PI) / 180
// Radianos para graus
const radToDeg = r => (r * 180) / Math.PI
// Gerador de número aleatório
const rand = (min, max) => {
    if (max === undefined) {
        max = min
        min = 0
    }
    return Math.random() * (max - min) + min
}
