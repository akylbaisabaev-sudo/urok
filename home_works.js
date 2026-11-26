const gmailInput = document.querySelector('#gmail_input')
const gmailButton = document.querySelector('#gmail_button')
const gmailResult = document.querySelector('#gmail_result')

const gmailRegExp = /^[a-zA-Z0-9._]+@gmail\.com$/

gmailButton.onclick = () => {
    if (gmailRegExp.test(gmailInput.value)) {
        gmailResult.innerHTML = 'Всё верно'
        gmailResult.style.color = 'green'
    } else {
        gmailResult.innerHTML = 'Некорректный gmail'
        gmailResult.style.color = 'red'
    }
}

const childBlock = document.querySelector('.child_block')
const maxPosition = 449
let positionX = 0
let positionY = 0

const moveBlock = () => {
    if (positionY === 0 && positionX < maxPosition) {
        positionX++
    } else if (positionX === maxPosition && positionY < maxPosition) {
        positionY++
    } else if (positionY === maxPosition && positionX > 0) {
        positionX--
    } else if (positionX === 0 && positionY > 0) {
        positionY--
    }
    childBlock.style.left = `${positionX}px`
    childBlock.style.top = `${positionY}px`
    requestAnimationFrame(moveBlock)
}

moveBlock()

const seconds = document.querySelector('#seconds')
const startButton = document.querySelector('#start')
const stopButton = document.querySelector('#stop')
const resetButton = document.querySelector('#reset')

let count = 0
let intervalId = null

startButton.onclick = () => {
    if (intervalId !== null) return
    intervalId = setInterval(() => {
        count++
        seconds.innerHTML = count
    }, 1000)
}

stopButton.onclick = () => {
    clearInterval(intervalId)
    intervalId = null
}

resetButton.onclick = () => {
    clearInterval(intervalId)
    intervalId = null
    count = 0
    seconds.innerHTML = count
}

function delay(value, ms, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            shouldFail ? reject(new Error(`Ошибка при обработке: ${value}`)) : resolve(value)
        }, ms)
    })
}

const runChain = () => {
    console.log('--- Задача 1: цепочка .then/.catch/.finally ---')
    return delay(1, 500)
        .then((value) => {
            console.log('Шаг 1 выполнен:', value)
            return delay(value + 1, 500, true)
        })
        .then((value) => {
            console.log('Шаг 2 выполнен:', value)
            return delay(value + 1, 500)
        })
        .then((value) => {
            console.log('Шаг 3 выполнен:', value)
        })
        .catch((error) => {
            console.warn('catch перехватил:', error.message)
        })
        .finally(() => {
            console.log('finally сработал в любом случае')
        })
}

const runAsyncChain = async () => {
    console.log('--- Задача 2: async/await ---')
    try {
        const first = await delay(1, 500)
        console.log('Шаг 1 выполнен:', first)
        const second = await delay(first + 1, 500, true)
        console.log('Шаг 2 выполнен:', second)
        const third = await delay(second + 1, 500)
        console.log('Шаг 3 выполнен:', third)
    } catch (error) {
        console.warn('catch перехватил:', error.message)
    } finally {
        console.log('finally сработал в любом случае')
    }
}

const processArray = async () => {
    console.log('--- Задача 2: массив из 4 значений ---')
    const values = [10, 20, 30, 40]
    const results = []
    for (const value of values) {
        try {
            const shouldFail = Math.random() > 0.7
            const result = await delay(value, 500, shouldFail)
            results.push({value: result, error: null})
        } catch (error) {
            results.push({value, error: error.message})
        }
    }
    console.log(results)
}

const runPromiseAll = async () => {
    console.log('--- Задача 3: Promise.all ---')
    try {
        const results = await Promise.all([
            delay('A', 500),
            delay('B', 1000, true),
            delay('C', 1500),
            delay('D', 2000)
        ])
        console.log(results)
    } catch (error) {
        console.warn('Promise.all упал на первой же ошибке:', error.message)
    }
}

const runAllSettled = async () => {
    console.log('--- Задача 3: Promise.allSettled ---')
    const results = await Promise.allSettled([
        delay('A', 500),
        delay('B', 1000, true),
        delay('C', 1500),
        delay('D', 2000)
    ])
    const succeeded = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
    const failed = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason.message)
    console.log('succeeded:', succeeded)
    console.log('failed:', failed)
}

const runRace = async () => {
    console.log('--- Задача 3: Promise.race ---')
    try {
        const winner = await Promise.race([
            delay('полезный результат', 2000),
            delay('таймаут', 500, true)
        ])
        console.log('Победитель гонки:', winner)
    } catch (error) {
        console.warn('Гонку выиграла ошибка:', error.message)
    }
}

const runHomework = async () => {
    await runChain()
    await runAsyncChain()
    await processArray()
    await runPromiseAll()
    await runAllSettled()
    await runRace()
}

runHomework()

const BASE_URL = 'https://jsonplaceholder.typicode.com'
const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const validateForm = ({name, email, password, age, gender}) => {
    if (!name.trim()) return 'Введите имя'
    if (!emailRegExp.test(email)) return 'Введите корректный email'
    if (password.length < 8) return 'Пароль должен быть не короче 8 символов'
    if (age === '' || !Number.isInteger(Number(age)) || Number(age) < 1 || Number(age) > 120) {
        return 'Введите возраст от 1 до 120'
    }
    if (!gender) return 'Выберите пол'
    return ''
}

const showResult = (element, text, type) => {
    element.innerHTML = text
    element.className = `register_result ${type}`
}

const initRegisterForm = (formId, resultId, sendAsFormData) => {
    const form = document.querySelector(formId)
    const result = document.querySelector(resultId)
    const agreement = form.querySelector('[name="agreement"]')
    const submitButton = form.querySelector('button[type="submit"]')

    agreement.onchange = () => {
        submitButton.disabled = !agreement.checked
        showResult(result, '', '')
    }

    form.onsubmit = async (event) => {
        event.preventDefault()

        if (!agreement.checked) {
            showResult(result, 'Нужно согласие на обработку данных', 'error')
            return
        }

        const formData = new FormData(form)
        const values = Object.fromEntries(formData)
        const validationError = validateForm(values)
        if (validationError) {
            showResult(result, validationError, 'error')
            return
        }

        const options = sendAsFormData
            ? {method: 'POST', body: formData}
            : {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({...values, age: Number(values.age), agreement: true})
            }

        submitButton.disabled = true
        showResult(result, 'Отправка...', '')

        try {
            const response = await fetch(`${BASE_URL}/posts`, options)
            if (!response.ok) {
                throw new Error(`Ошибка сервера, статус ${response.status}`)
            }
            const data = await response.json()
            console.log(data)
            showResult(result, `Успешно! Сервер создал запись с id ${data.id}`, 'success')
            form.reset()
        } catch (error) {
            const isNetworkError = error instanceof TypeError
            showResult(result, isNetworkError ? 'Нет соединения с сервером' : error.message, 'error')
        } finally {
            submitButton.disabled = !agreement.checked
        }
    }
}

initRegisterForm('#form_json', '#result_json', false)
initRegisterForm('#form_multipart', '#result_multipart', true)
