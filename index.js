class GemPuzzle {
    constructor() {
        this.head = null
        this.widthDes = document.documentElement.clientWidth
        this.itemCount = '4'           //size default
        this.elSize = 100
        this.mainConteiner = null
        this.buttonsConteiner = null
        this.infoConteiner = null
        this.puzzleConteiner = null
        this.settingsConteiner = null
        this.settingFrameSize = null
        this.settingOtherSize = null
        this.soundButton = null
        this.sound = true
        this.buttonPlay = null
        this.buttonStop = null
        this.buttonSave = null
        this.frameSize = null
        this.select = null
        this.buttonResults = null
        this.pausa = false
        this.begin = true
        this.stepCount = null
        this.step = 0

        this.count = null
        this.time = null
        this.gameTime = {               //game time
            minutes: 0,
            seconds: 0,
        }
        this.seconds = 0
        this.minutes = 0
        this.timeoutID = null

        this.puzzleItems = []          //html elements
        this.numbers = []
        this.empty = {
            value: 0,
            top: 0,
            left: 0,
        }
        this.isLoadSavedGame = false
        this.lastSh = null

        this.resultsStor = localStorage.getItem("gameTopResult")
        this.results = JSON.parse(localStorage.getItem("gameTopResult")) || []
    }


    crEl(tagName) {
        return document.createElement(tagName)
    }

    init() {
        if (!document.getElementById('myCss')) {
            this.head = document.getElementsByTagName('head')[0]
            let style = document.createElement('link')
            style.id = 'myCss'
            style.rel = 'stylesheet'
            style.type = 'text/css'
            style.href = 'styles/style.css'
            this.head.appendChild(style)
        }
        let mainConteiner = this.crEl("main")
        mainConteiner.classList.add("main-conteiner")
        this.mainConteiner = mainConteiner
        document.body.append(this.mainConteiner)

        let buttonsConteiner = this.crEl("div")
        buttonsConteiner.classList.add("buttons-conteiner")
        this.buttonsConteiner = buttonsConteiner
        this.mainConteiner.append(this.buttonsConteiner)

        let infoConteiner = this.crEl("div")
        infoConteiner.classList.add("info-conteiner")
        this.infoConteiner = infoConteiner
        this.mainConteiner.append(this.infoConteiner)

        let puzzleConteiner = this.crEl("div")
        puzzleConteiner.classList.add("puzzle-conteiner")
        this.puzzleConteiner = puzzleConteiner
        this.puzzleConteiner.style.width = `${this.elSize * this.itemCount}px`
        this.puzzleConteiner.style.height = `${this.elSize * this.itemCount}px`
        this.mainConteiner.append(this.puzzleConteiner)

        let settingsConteiner = this.crEl("div")
        settingsConteiner.classList.add("settings-conteiner")
        this.settingsConteiner = settingsConteiner
        this.mainConteiner.append(this.settingsConteiner)

        let soundButton = this.crEl("button")
        soundButton.classList.add("game-button", "sound-button")
        soundButton.setAttribute("type", "button")
        this.soundButton = soundButton
        this.soundButton.style.backgroundImage = "url(assets/images/volume-up-svgrepo-com.svg)"
        this.buttonsConteiner.append(soundButton)

        let buttonPlay = this.crEl("button")
        buttonPlay.classList.add("game-button", "start-game-button")
        buttonPlay.setAttribute("type", "button")
        this.buttonPlay = buttonPlay
        this.buttonPlay.innerHTML = "Shuffle and start"
        this.buttonsConteiner.append(buttonPlay)

        let buttonStop = this.crEl("button")
        buttonStop.classList.add("game-button", "stop-game-button")
        buttonStop.setAttribute("type", "button")
        this.buttonStop = buttonStop
        this.buttonStop.innerHTML = "Stop"
        this.buttonsConteiner.append(buttonStop)

        let buttonSave = this.crEl("button")
        buttonSave.classList.add("game-button", "save-game-button")
        buttonSave.setAttribute("type", "button")
        this.buttonSave = buttonSave
        this.buttonSave.innerHTML = "Save"
        this.buttonsConteiner.append(buttonSave)

        let buttonResults = this.crEl("button")
        buttonResults.classList.add("game-button", "results-game-button")
        buttonResults.setAttribute("type", "button")
        this.buttonResults = buttonResults
        this.buttonResults.innerHTML = "Results"
        this.buttonsConteiner.append(buttonResults)

        let stepCount = document.createElement("p")
        stepCount.classList.add("step-count")
        stepCount.innerText = "Moves: " + this.step
        this.stepCount = stepCount
        this.infoConteiner.append(stepCount)

        let time = this.crEl("p")
        time.classList.add("time")
        time.innerText = `Time: `
        this.time = time
        let timeConteiner = this.crEl('span')
        timeConteiner.innerText = `00:00`
        this.time.append(timeConteiner);
        this.infoConteiner.append(time)

        let settingFrameSize = this.crEl("div")
        settingFrameSize.classList.add("setting-frame")
        this.settingFrameSize = settingFrameSize
        this.settingsConteiner.append(this.settingFrameSize)
        let frameSize = this.crEl("p")
        frameSize.classList.add("frame-size")
        frameSize.innerText = `Frame size: ${this.itemCount}x${this.itemCount}`
        this.frameSize = frameSize
        this.settingFrameSize.append(frameSize)

        let settingOtherSize = this.crEl("div")
        settingOtherSize.classList.add("setting-frame")
        this.settingOtherSize = settingOtherSize
        this.settingsConteiner.append(this.settingOtherSize)

        let otherSize = this.crEl("p")
        otherSize.classList.add("other-size")
        otherSize.innerText = `Order size:`
        this.settingOtherSize.append(otherSize)
        let selectSize = this.crEl("select")
        this.select = selectSize
        this.settingOtherSize.append(this.select)

        if (localStorage.getItem("gemPuzzle")) {
            this.isLoadSavedGame = true
            this.buttonSave.innerHTML = `delete save <br />and new game`
            this.buttonSave.style.fontSize = '0.6rem'
            let localStor = JSON.parse(localStorage.getItem("gemPuzzle"))
            this.itemCount = localStor.itemCount
            this.empty = localStor.empty
            this.puzzleConteiner.style.width = `${this.elSize * this.itemCount}px`
            this.puzzleConteiner.style.height = `${this.elSize * this.itemCount}px`
            this.frameSize.innerText = `Frame size: ${this.itemCount}x${this.itemCount}`

            this.gameTime = localStor.gameTime
            this.minutes = localStor.gameTime.minutes
            this.seconds = localStor.gameTime.seconds
            this.seconds = this.seconds === 0 ? "0" + this.seconds : this.seconds
            this.minutes = this.minutes < 10 ? "0" + this.gameTime.minutes : this.gameTime.minutes
            this.time.lastChild.innerHTML = `${this.minutes}:${this.seconds}`

            this.puzzleItems = localStor.puzzleItems

            this.step = localStor.step
            this.stepCount.innerText = "Moves: " + this.step
        }

        this.start()

        for (let i = 3; i <= 8; i++) {
            let option = document.createElement("option")
            if (i == this.itemCount) option.setAttribute('selected', 'true');
            option.setAttribute("value", `${i}`)
            option.innerText = `${i}x${i}`
            this.select.append(option)
        }

        selectSize.addEventListener('change', (e) => {
            if (localStorage.getItem("gemPuzzle")) {
                let isDelSav = confirm("При смене размера удаляются сохранения. Удалить сохранения и продолжить?");
                if (isDelSav) {
                    this.isLoadSavedGame = false
                    this.itemCount = e.target.value
                    this.clear()
                    this.clearTime()
                    this.createGameEl(this.itemCount)
                    this.pausa = true
                    this.begin = false
                    // localStorage.clear()
                    localStorage.removeItem("gemPuzzle")
                    this.buttonSave.innerHTML = `save`
                    this.buttonSave.style.fontSize = '1rem'
                    alert('Savings deleted!')
                } //else { return }
            } else {
                this.isLoadSavedGame = false
                this.itemCount = e.target.value
                this.clear()
                this.clearTime()
                this.createGameEl(this.itemCount)
                this.pausa = true
                this.begin = false
                // localStorage.clear()
                localStorage.removeItem("gemPuzzle")
                this.buttonSave.innerHTML = `save`
                this.buttonSave.style.fontSize = '1rem'
            }
        })
        this.toggleSound()
    }

    resize(itemCount) {
        let size = this.widthDes / itemCount * 0.9
        size < 100 ? this.elSize = size : this.elSize = 100
    }

    start() {
        this.buttonPlay.addEventListener('click', () => {
            if (localStorage.getItem("gemPuzzle")) {
                localStorage.removeItem("gemPuzzle")
                this.stopTime()
                this.clearTime()
                this.buttonStop.classList.remove('stop-btn-toggle')
                while (this.puzzleConteiner.firstChild) {
                    this.puzzleConteiner.removeChild(this.puzzleConteiner.firstChild)
                }
                this.createGameEl(this.itemCount)
                this.buttonSave.innerHTML = `save`
                this.buttonSave.style.fontSize = '1rem'
                this.isLoadSavedGame = false
                this.begin = true
                this.clear()
                this.createGameEl(this.itemCount)
            } else {
                this.begin = true
                this.pausa = false
                this.clear()
                this.clearTime()
                this.createGameEl(this.itemCount)
                this.buttonStop.classList.remove('stop-btn-toggle')
            }

        })

        this.buttonStop.addEventListener('click', () => {
            this.begin = false
            if (!this.buttonStop.classList.contains('stop-btn-toggle')) this.buttonStop.classList.add('stop-btn-toggle')
            this.pausa = true
            this.stopTime()
        })

        this.buttonSave.addEventListener('click', () => {


            if (this.isLoadSavedGame) {
                alert('Savings deleted!')
                localStorage.removeItem("gemPuzzle")
                // localStorage.clear()
                this.stopTime()
                while (this.puzzleConteiner.firstChild) {
                    this.puzzleConteiner.removeChild(this.puzzleConteiner.firstChild)
                }
                this.createGameEl(this.itemCount)
                this.buttonSave.innerHTML = `save`
                this.buttonSave.style.fontSize = '1rem'
                this.isLoadSavedGame = false
                this.begin = true
            } else {
                this.saveGame(this.puzzleItems, this.gameTime, this.step, this.itemCount, this.empty)
                this.isLoadSavedGame = false
                this.begin = false
            }
        })

        this.buttonResults.addEventListener('click', this.showResults)

        this.createGameEl(this.itemCount)
    }
    showResults() {
        const results = JSON.parse(localStorage.getItem('gameTopResult')) || [];
        const resultStr = results.map(result => {
            return `Time: ${result.gameTime}  Moves: ${result.stepCount} \n`
        })
        alert('*** BEST RESULTS ***\n'.concat(resultStr.join('')))
    }

    clear() {
        this.stopTime()
        this.frameSize.innerText = `Frame size: ${this.itemCount}x${this.itemCount}`
        this.puzzleItems.length = 0

        this.pausa = false
        this.buttonStop.classList.remove('stop-btn-toggle')

        this.numbers.length = 0

        this.step = 0
        this.stepCount.innerHTML = "Moves: " + this.step

        while (this.puzzleConteiner.firstChild) {
            this.puzzleConteiner.removeChild(this.puzzleConteiner.firstChild)
        }
    }

    createGameEl(itemCount) {

        this.resize(itemCount)

        this.puzzleConteiner.style.width = `${this.elSize * this.itemCount}px`
        this.puzzleConteiner.style.height = `${this.elSize * this.itemCount}px`
        let valsCount = itemCount ** 2

        if (this.isLoadSavedGame) {
            this.numbers = this.puzzleItems.map(el => el)

            for (let i = 0; i < this.numbers.length; i++) {
                const el = this.crEl('div')
                el.classList.add('item')
                el.innerText = this.puzzleItems[i].value

                const left = this.puzzleItems[i].left
                const top = this.puzzleItems[i].top

                if (this.puzzleItems[i].value === 0) {
                    this.empty = {
                        value: this.empty.value,
                        left: this.empty.left,
                        top: this.empty.top,
                    }
                    el.style.display = 'none'
                }

                el.style.left = `${left * this.elSize}px`
                el.style.top = `${top * this.elSize}px`
                el.style.width = `${this.elSize}px`
                el.style.height = `${this.elSize}px`

                this.puzzleConteiner.append(el)
                el.addEventListener('click', () => {
                    this.move(i, el)
                    if (this.pausa) {
                        this.pausa = false
                        this.buttonStop.classList.remove('stop-btn-toggle')
                        this.setTime()
                    }
                })
            }
        } else {
            
            let tempArr = [...Array(valsCount).keys()].sort(() => Math.random() - 0.5)
            const solvable = a =>{
                for (var kD = 0, i = 1, len = a.length - 1; i < len; i++) {
                    for (var j = i - 1; j >= 0; j--) {
                        if (a[j] > a[i]) {
                            kD++;
                        }
                    }
                }
                return !(kD % 2)
            }
           
            while (!solvable(tempArr)) {
                console.log('нерешаемый')
                tempArr = tempArr.sort(() => Math.random() - 0.5)
            }

            if (solvable(tempArr)) {
                console.log('решаемый')
                this.numbers = tempArr}

            for (let i = 0; i < valsCount; i++) {
                const el = this.crEl('div')
                el.classList.add('item')
                el.innerText = this.numbers[i]

                const left = i % this.itemCount
                const top = (i - left) / this.itemCount

                if (this.numbers[i] === 0) {
                    this.empty = {
                        value: 0,
                        top,
                        left,
                    }
                    el.style.display = 'none'
                }

                this.puzzleItems.push({
                    value: this.numbers[i],
                    left,
                    top,
                    el,
                })

                el.style.left = `${left * this.elSize}px`
                el.style.top = `${top * this.elSize}px`
                el.style.width = `${this.elSize}px`
                el.style.height = `${this.elSize}px`

                this.puzzleConteiner.append(el)


                el.addEventListener('click', () => {
                    this.move(i, el)
                    if (this.pausa) {
                        this.pausa = false
                        this.buttonStop.classList.remove('stop-btn-toggle')
                        this.setTime()
                    }
                })
            }
        }
        //this.drop()
    }

    soundCheck() {
        if (this.sound == true) {
            let sound = new Audio("assets/sounds/rubiks_cube.mp3")
            sound.play()
        }
    }

    drop() {
        this.puzzleItems.forEach(elem => {
            const leftDiff = Math.abs(this.empty.left - elem.left)
            const topDiff = Math.abs(this.empty.top - elem.top)
            const sum = leftDiff + topDiff

            if (sum === 1 && elem.value !== 0) {
                elem.el.draggable = true
            } else {
                elem.el.draggable = false
            }

            elem.el.addEventListener(`dragstart`, (evt) => {
                evt.target.classList.add(`selected`)
                evt.target.style.opacity = '.5'
            })
            elem.el.addEventListener(`dragend`, (evt) => {
                evt.target.style.opacity = '1'
            })
            elem.el.addEventListener(`dragover`, (evt) => {
                evt.preventDefault()
                console.log(this.empty)
                evt.target.append(elem.el)

                // const activeElement = this.puzzleConteiner.querySelector(`.selected`)
                // const currentElement = evt.target
                // const isMoveable = activeElement !== currentElement &&
                //     currentElement.classList.contains(`.item`)
                // elem.style.left = `${this.empty.left * this.elSize}px`
                // elem.style.top = `${this.empty.top * this.elSize}px`

            })
        })
        
    }

    move(index, elem) {
        const cell = this.puzzleItems[index]

        const leftDiff = Math.abs(this.empty.left - cell.left)
        const topDiff = Math.abs(this.empty.top - cell.top)

        if (leftDiff + topDiff > 1) {
            // this.drop()
            return
        } else {
            this.soundCheck()
            this.setStepCount()
            if (this.begin) {
                this.setTime()
                this.begin = false
            }

            elem.style.left = `${this.empty.left * this.elSize}px`
            elem.style.top = `${this.empty.top * this.elSize}px`
            const emtyLeft = this.empty.left
            const emtyTop = this.empty.top
            this.empty.left = cell.left
            this.empty.top = cell.top
            cell.left = emtyLeft
            cell.top = emtyTop

            this.isFinished()
            // this.drop()
        }
    }

    isFinished() {
        let finish = this.puzzleItems.filter(f => f.value !== 0).every(cell => {
            return cell.value === cell.top * this.itemCount + cell.left + 1 //+1 если к началу
        })

        if (finish) {
            alert(`Ура! Вы решили головоломку за ${this.time.lastChild.innerHTML} и ${this.step} ходов!`)
            let gameTopResult = localStorage.getItem("gameTopResult")
            if (this.resultsStor) {
                this.results = JSON.parse(gameTopResult)
            }

            let result = this.results.length

            this.results.push({ gameTime: this.time.lastChild.innerHTML, stepCount: this.step })
            this.results.sort((a, b) => a.stepCount - b.stepCount)

            localStorage.setItem("gameTopResult", JSON.stringify(this.results))
            localStorage.removeItem("gemPuzzle")

            this.clear()
            this.clearTime()
            // this.isLoadSavedGame = false
            // this.pausa = true
            // this.begin = false
            this.stopTime()
            while (this.puzzleConteiner.firstChild) {
                this.puzzleConteiner.removeChild(this.puzzleConteiner.firstChild)
            }
            this.buttonSave.innerHTML = `save`
            this.buttonSave.style.fontSize = '1rem'
            this.isLoadSavedGame = false
            this.begin = true
            this.createGameEl(this.itemCount)
        }
    }

    toggleSound() {
        this.soundButton.addEventListener("click", () => {
            this.sound = !this.sound
            if (this.sound) {
                this.soundButton.style.backgroundImage = "url(assets/images/volume-up-svgrepo-com.svg)"
            } else {
                this.soundButton.style.backgroundImage = "url(assets/images/volume-off-svgrepo-com.svg)"
            }
        })
    }

    setTime() {
        this.count = this.gameTime.seconds || 0
        this.seconds = this.gameTime.seconds || 0
        this.minutes = this.gameTime.minutes || 0
        this.timeoutID = setInterval(() => {
            if (this.count >= 59) this.gameTime.minutes++
            this.count++
            this.seconds = this.count < 10 ? "0" + this.count : this.count
            this.gameTime.seconds = this.seconds
            this.minutes = this.gameTime.minutes < 10 ? "0" + this.gameTime.minutes : this.gameTime.minutes
            if (this.count > 59) {
                this.count = 0
                this.seconds = "0" + this.count
            }
            this.time.lastChild.innerHTML = `${this.minutes}:${this.seconds}`
        }, 1000)
    }

    stopTime() {
        return clearTimeout(this.timeoutID)
    }

    clearTime() {
        this.count = 0
        this.time.lastChild.innerHTML = `00:00`
        this.gameTime = {
            minutes: 0,
            seconds: 0,
        }
    }

    setStepCount() {
        this.step++
        this.stepCount.innerHTML = "Moves: " + this.step
    }

    saveGame(puzzleItems, gameTime, step, itemCount, empty) {
        puzzleItems.map(el => {
            if (el.value === 0) {
                el.left = empty.left
                el.top = empty.top
            }
        })
        // localStorage.clear()
        localStorage.removeItem("gemPuzzle")
        let savedGame = {
            puzzleItems,
            gameTime,
            step,
            itemCount,
            empty,
        }
        localStorage.setItem("gemPuzzle", JSON.stringify(savedGame))
        alert('The game is saved!')
    }
}

new GemPuzzle().init()



