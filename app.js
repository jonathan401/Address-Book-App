// global variables
const main = document.querySelector('main');
const addBtn = document.querySelector('#new');
const formWrapper = document.querySelector('.form-wrapper');
const form = document.querySelector('.contact-form');
const emptyPage = document.querySelector('.empty-page');
const contactContainer = document.querySelector('.contact-details');

// hidding the form when the cancel buttons is clicked
main.addEventListener('click', e => {
  if (e.target.classList.contains('cancel')) {
    e.target.parentElement.parentElement.classList.add('hidden');
  }
});

// regex pattern
const pattern = {
  firstname: /^[A-Z][a-z]{0,9}$/,
  lastname: /^[A-Z][a-z]{0,9}$/,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
  phone: /^\d{11}$/,
};

// creating a function to show the appropriate form (add or edit)
const showForm = (headerText, buttonText) => {
    const html = `
    <h1>${headerText}</h1>
    <span class="fas fa-times cancel"></span>
    <div class="form-group">
      <label>Firstname</label>
      <input type="text" class="form-control" name="firstname" required>
      <p>Must not be more than 10 characters and must be capitalized</p>
    </div>
    <div class="form-group">
      <label>Lastname</label>
      <input type="text" class="form-control" name="lastname" required>
      <p>Must not be more than 10 characters and must be capitalized</p>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" class="form-control" name="email" required>
      <p>Must be a valid email e.g yourdomain@gmail.com</p>
    </div>
    <div class="form-group">
      <label>Phone</label>
      <input type="number" class="form-control" name="phone" required>
      <p>Must be an 11 digit number</p>
    </div>
    <input type="submit" value="${buttonText}" class="btn btn-primary">
    <input type="button" value="Cancel" class="btn btn-primary cancel">
    `;
    form.innerHTML = html;
};

// showing the form when the add button is clicked
addBtn.addEventListener('click', () => {
    if (formWrapper.classList.contains('hidden')) {
        formWrapper.classList.remove('hidden');
      }
    showForm('Add Contact', 'Save');
});

// function definitions


// validate function
const validateInputs = (inputField, regex) => {
  if (!regex.test(inputField.value)) {
    inputField.classList.add('invalid');
  } else {
    inputField.classList.remove('invalid');
  }
};

// contact class
class Contact {
  constructor(firstname, lastname, email, phone) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
  }
}

// function to create new contact
const createContact = () => {
    let contact = new Contact(
        getInputs()[0].value,
        getInputs()[1].value,
        getInputs()[2].value,
        getInputs()[3].value
      );
      return contact;
};


// function to generate template for contact
const generateTemp = (contactInfo, show) => {
    if(show) {
        const html = `
          <li class="container">
            <div class="contact">
              <div class="contact-image">
                <span class="fas fa-user"></span>
              </div>
              <p>${contactInfo.firstname}</p>
              <p>${contactInfo.lastname}</p>
            </div>
            <div class="arrow"><i class="fas fa-long-arrow-alt-right"></i></div>
        </li>
        `;  
        contactContainer.innerHTML += html;
    } else {
        html = contactInfo;
        return contactInfo;
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
  getInputs().forEach((input) => {
    validateInputs(input, pattern[input.attributes.name.value]);
    if (!input.classList.contains('invalid')) {
      validInputs.push(input);
    }
    if (validInputs.length == getInputs().length) {
      // the form has been validated
      /* when the form has been validated, data is extracted from the input fields and an instance of the
      contact class is created with the values from the form and is passed into the generateTemp function
      which generates a little contact box from the object passed into it as an argument */
      generateTemp(createContact(), true);
      if(!emptyPage.classList.contains('hidden')) {
          emptyPage.classList.add('hidden');
      }
      formWrapper.classList.add('hidden');
    }
  });
});


