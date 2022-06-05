const startGame = () => {
    document.getElementById('background').style.display = 'none'
    document.getElementById('startMenu').style.display = 'none'
    timer.start()
    document.getElementById('timer').style.display = 'flex'
}

const endGame = () => {
    currentLevel = 1

    document.getElementById('timer').style.display = 'none'
    document.getElementById('background').style.display = 'flex'
    document.getElementById('endMenu').style.display = 'flex'
    document.getElementById('finalTime').innerHTML = `Seu tempo final foi de ${Math.trunc(
        timer.getElapsedTime()
    )} segundos`
}

const restartGame = () => {
    document.getElementById('endMenu').style.display = 'none'
    document.getElementById('startMenu').style.display = 'flex'
}

const showTimer = () => {
    if (document.getElementById('timer'))
        document.getElementById('timer').innerHTML = `Tempo: ${Math.trunc(timer.getElapsedTime())}s`
}
