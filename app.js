// global variables
const main = document.querySelector('main');
const addBtn = document.querySelector('#new');
const formWrapper = document.querySelector('.form-wrapper');
const form = document.querySelector('.contact-form');
const emptyPage = document.querySelector('.empty-page');
const contactContainer = document.querySelector('.contact-details');
const contactCard = document.querySelector('.contact-card');

// hidding the form when the cancel buttons is clicked
main.addEventListener('click', (e) => {
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
  if (formWrapper.classList.contains('hidden')) {
    formWrapper.classList.remove('hidden');
  }
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
const generateTemp = (contactInfo) => {
  let html = `
    <li class="container">
      <div class="contact">
        <div class="contact-image">
          <span class="fas fa-user"></span>
        </div>
            <p>${contactInfo.firstname}</p>
            <p>${contactInfo.lastname}</p>
            <p class="hidden">${contactInfo.email}</p>
            <p class="hidden">${contactInfo.phone}</p>
      </div>
          <div class="arrow"><i class="fas fa-long-arrow-alt-right"></i></div>
    </li>
        `;
  contactContainer.innerHTML += html;
};

// function to get a reference to all the input fields
const getInputs = () => {
  const inputs = document.querySelectorAll('.contact-form .form-control');
  return inputs;
};

// adding an event listener to edit
// contactCard.addEventListener('click', (e) => {
//   if(e.target.classList.contains('update')) {
//     showForm('Edit Contact', 'update');
//   }
// });

// function to display contact card when a contact is clicked on
contactContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('container')) {
    /* this is the only way i could think of to get the firstname, lastname, email and 
    phone number form the contact */
    let parent = e.target;
    // i prepopulated the form with the current contact's details
    let firstname = e.target.children[0].children[1].textContent;
    let lastname = e.target.children[0].children[2].textContent;
    let email = e.target.children[0].children[3].textContent;
    let phone = e.target.children[0].children[4].textContent;
    /* when the edit button is clicked, then the form should be shown with the input fields prepopulated with
       text of the field that is to be updated and when form is submitted, then the parent of the edit should
       be updated with the value from the input field */
    contactCard.addEventListener('click', (e) => {
      if (e.target.classList.contains('update')) {
        showForm(`Edit ${firstname}`, 'update');
        getInputs()[0].value = `${firstname}`;
        getInputs()[1].value = `${lastname}`;
        getInputs()[2].value = `${email}`;
        getInputs()[3].value = `${phone}`;
      }
      if(e.target.classList.contains('delete')) {
        // e.target.parentElement.parentElement.remove();
        console.log(parent);
        parent.remove();
      }
      contactCard.classList.add('hidden');
    });


    // updating the contact card
    const html = `
    <span class="fas fa-times cancel"></span>
    <div class="card-image">
      <img src="images/illustration-hero.svg">
    </div>
    <div class="card-text">
      <header>
        <h2>${firstname} ${lastname}</h2>
      </header>
      <div class="text-group">
        <h3>Email</h3>
        <div class="info">
          <p>${email}</p>
          <span class="fas fa-mail"></span>
        </div>
      </div>
      <div class="text-group">
        <h3>Phone</h3>
        <div class="info">
          <p>${phone}</p>
          <span class="fas fa-mail"></span>
        </div>
      </div>
    </div>
    <div class="buttons">
      <span class="btn btn-primary update">Edit</span>
      <span class="btn btn-primary delete">Delete</span>
      <span class="btn btn-primary cancel">Cancel</span>
    </div>
    `;
    if (contactCard.classList.contains('hidden')) {
      contactCard.classList.remove('hidden');
    }
    contactCard.innerHTML = html;
  }
});

form.addEventListener('submit', (e) => {
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
      generateTemp(createContact());
      if (!emptyPage.classList.contains('hidden')) {
        emptyPage.classList.add('hidden');
      }
      formWrapper.classList.add('hidden');
    }
  });
});
