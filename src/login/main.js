function Validator(options) {
    let formElement = document.querySelector(options.form)
    let selectorRules = {}
    if (formElement) {
        function invalid(inputElement, rule) {
            let errorElement = inputElement.parentElement.querySelector('.form-message')
            let errorMessage

            let rules = selectorRules[rule.selector]
            for (let i = 0; i < rules.length; ++i) {
                errorMessage = rules[i](inputElement.value)
                if (errorMessage) {
                    break
                }
            }

            if (errorMessage) {
                errorElement.innerText = errorMessage
                errorElement.parentElement.classList.add('invalid')
            } else {
                errorElement.innerText = ''
                errorElement.parentElement.classList.remove('invalid')
            }

            //? input handled
            inputElement.oninput = function () {
                errorElement.innerText = ''
                errorElement.parentElement.classList.remove('invalid')
            }
            return !errorMessage
        }

        let arrayRules = options.rules
        //? handled submit
        formElement.onsubmit = function (e) {
            e.preventDefault()

            var isFormValid = true

            for (let rule of arrayRules) {
                let inputElement = document.querySelector(rule.selector)
                let isValid = invalid(inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            }

            if (isFormValid) {
                //? submit with javascript
                if (typeof options.submit === 'function') {
                    let enableInput = document.querySelectorAll('[name]:not([content])')
                    //? nodeList convert to array
                    var formValue = Array.from(enableInput).reduce(function (values, input) {
                        return (values[input.name] = input.value) && values
                    }, {})
                    notification()
                    navigation()
                    options.submit(formValue)
                }
                //? submit with HTML
                else {
                    formElement.submit()
                }
            }
        }

        for (let rule of arrayRules) {
            //? Handle the case where there are many overlapping rules

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            let inputElement = document.querySelector(rule.selector)
            //? blur handled
            inputElement.onblur = function () {
                invalid(inputElement, rule)
            }
        }
    }
}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui long nhap truong nay!'
        },
    }
}

Validator.isUsername = function (selector, getConfirmValue) {
    return {
        selector: selector,
        test: function (value) {
            return value.toLowerCase().trim() === getConfirmValue() ? undefined : 'Username khong dung!'
        },
    }
}

Validator.isPassword = function (selector, getConfirmValue) {
    return {
        selector: selector,
        test: function (value) {
            return value.toLowerCase().trim() === getConfirmValue() ? undefined : 'Password khong dung!'
        },
    }
}
