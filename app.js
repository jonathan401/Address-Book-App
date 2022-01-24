// global variables
const main = document.querySelector('main');
const addBtn = document.querySelector('#new');
const formWrapper = document.querySelector('.form-wrapper');
const form = document.querySelector('.contact-form');

// hidding the form when the cancel buttons is clicked
main.addEventListener('click', e => {
    if(e.target.classList.contains('cancel')) {
        e.target.parentElement.parentElement.classList.add('hidden');
    }
});

// regex pattern
const pattern = {
    firstname: /^[A-Z][a-z]{0,9}$/,
    lastname: /^[A-Z][a-z]{0,9}$/,
    email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
    phone: /^\d{11}$/
};

// showing the form when the add  buttons is clicked
addBtn.addEventListener('click', () => {
    if(formWrapper.classList.contains('hidden')) {
        formWrapper.classList.remove('hidden');
    }
});

// function definitions

// validate function
const validateInputs = (inputField, regex) => {
    if(!regex.test(inputField.value)) {
        inputField.classList.add('invalid');
    } else {
        inputField.classList.remove('invalid');
    }
};

// function to get a reference to all the input fields
const getInputs = () => {
    const inputs = document.querySelectorAll('.contact-form .form-control');
    return inputs;
};

form.addEventListener('submit', e => {
    e.preventDefault();
    let validInputs = [];
    /* the way this part works is that when the form is submitted, the getInputs which gets a reference to
    all the input fields is looped through and if any of the input dosen't have a class of invalid, the 
    input is added to the validInputs array which stores inputs that are valid. when this is done i check to 
    see if the length of the validInputs array is equal to that of the getInputs array, if it is, it means
    all the input fields passed their, respective regex patterns */ 
    getInputs().forEach(input => {
        validateInputs(input, pattern[input.attributes.name.value]);
        if(!input.classList.contains('invalid')) {
            validInputs.push(input);
        }
    });
    if(validInputs.length == getInputs().length) {
        console.log('done');
    }
});