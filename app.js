// global variables
const main = document.querySelector('main');
const addBtn = document.querySelector('#new');
const formWrapper = document.querySelector('.form-wrapper');
const form = document.querySelector('.contact-form');
const emptyPage = document.querySelector('.empty-page');
const contactContainer = document.querySelector('.contact-details');
const contactCard = document.querySelector('.contact-card');
const deleteWrapper = document.querySelector('.wrapper');
const modeToggler = document.querySelector('.toggler');
const modeImage = document.querySelector('.toggler img');
const searchPanel = document.querySelector('form.search');
const deletePage = document.querySelector('.delete-comp');

// // hidding the form when the cancel buttons is clicked
// main.addEventListener('click', (e) => {
//   if (e.target.classList.contains('cancel')) {
//     e.target.parentElement.parentElement.classList.add('hidden');
//   }
// });


// mode toggler
modeToggler.addEventListener('click', () => {
  // toggling between light and dark mode using the ternary operator
  main.classList.toggle('dark-theme');
  let imageSrc;
  imageSrc =
  main.className == 'dark-theme'
  ? 'images/icon-sun.svg'
  : 'images/icon-moon.svg';
  modeImage.setAttribute('src', imageSrc);
  localStorage.setItem('theme', JSON.stringify(main.className));
  localStorage.setItem('icon', JSON.stringify(imageSrc));
});


// updating the theme of the page
let theme = JSON.parse(localStorage.getItem('theme'));
let imgSrc = JSON.parse(localStorage.getItem('icon'));
main.className = theme;
modeImage.setAttribute('src', imgSrc);



// regex pattern
const pattern = {
  firstname: /^[A-Z][a-z]{0,9}$/,
  lastname: /^[A-Z][a-z]{0,9}$/,
  email: /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
  phone: /^\d{11}$/,
};



const showForm = (headerText, buttonText, id) => {
  if (formWrapper.classList.contains('hidden')) {
    formWrapper.classList.remove('hidden');
  }

  form.setAttribute('id', id);

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
    <input type="submit" value="${buttonText}" class="btn btn-primary update">
    <input type="button" value="Cancel" class="btn btn-primary cancel">
    `;
  form.innerHTML = html;
  form.addEventListener('click', (e) => {
    if (e.target.classList.contains('cancel')) {
      formWrapper.classList.add('hidden');
    }
  });
};

// function to filter the contacts
searchPanel.addEventListener('keyup', e => {
  e.preventDefault();
  const value = searchPanel.filterField.value.trim();
  getContacts().forEach(contact => {
    if(!contact.textContent.toLowerCase().includes(value.toLowerCase())) {
      contact.classList.add('hidden');
    } else {
      contact.classList.remove('hidden');
    }
  });
});

// function to prevent the page from reloading when the filter form is submitted
searchPanel.addEventListener('submit', e => {
  e.preventDefault();
})

// adding an event listener to the form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let validInputs = [];

  let idValue = form.getAttribute('id');
  /* what i did here is that so as to know which form is being submitted, i get add an id of 'add' to
  the form if an edit form is shown and an id of 'edit' if the edit form is show.
  i then get all the input fields and test them against their regex pattern if the field is valid, i add that 
  input field to an array and when the array is the same length as the length of all the inputs, 
  i check if the form has an id of 'add' (which if true means that the form is an add form since i am using
    the same form to edit and add contacts in order to keep my code dry)  i then generate a template from the 
    input fields and add them to the container. if the form does not have an id of add, i first of all generate
    a template from the input fields, i then get the second to the last element because that will be the old 
    contact that is to be updated and then i remove it. this is possible because whenever a new contact is 
    added to the contact list and the form has an id other than add, the edited contact is always the second
    to the last element in the ul container i access it using the getContact function which gets all the 
    containers.*/

  getInputs().forEach((input) => {
    validateInputs(input, pattern[input.attributes.name.value]);
    if (!input.classList.contains('invalid')) {
      validInputs.push(input);
    }

    if (validInputs.length == getInputs().length) {
      if (idValue === 'add') {
        generateTemp(createContact()); // generate template from the input fields
        updateStorage();
        if (!emptyPage.classList.contains('hidden')) {
          emptyPage.classList.add('hidden');
        }
      } else {
        generateTemp(createContact());
        let edited = getContacts().length - 2; // remove the second to the last element
        getContacts()[edited].remove();
        updateStorage();
      }
      formWrapper.classList.add('hidden');
    }
  });
});


// showing the form when the add button is clicked
addBtn.addEventListener('click', () => {
  showForm('Add Contact', 'Save', 'add');
});

// function definitions
// function to update the local storage with the contact data
const updateStorage = () => {
  /* i created an empty array and then call the getTodos function which gets all the todos that are present 
  in the html and then convert all of them to JSON string and store them in the user's local storage using the 
  key 'todos' as the key */
  const contactArr = [];
  getContacts().forEach(contact => {
    // tried to extract the details from every one of the contacts
    let firstname = contact.children[0].children[1].textContent; 
    let lastname = contact.children[0].children[2].textContent;
    let email = contact.children[0].children[3].textContent; 
    let phone = contact.children[0].children[4].textContent;
    const info = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone
    }
    contactArr.push(info);
  });

  const contactContent = JSON.stringify(contactArr);
  localStorage.setItem('contacts', contactContent);
};

// updating the page with the data gotten from local storage
const updateUI = () => {
  const stored = JSON.parse(localStorage.getItem('contacts'));
  stored.forEach(contactDetails => {
    if(!emptyPage.classList.contains('hidden')); {
      emptyPage.classList.add('hidden');
    }
    generateTemp(contactDetails);
  });
};




// validate function
const validateInputs = (inputField, regex) => {
  if (!regex.test(inputField.value)) {
    inputField.classList.add('invalid');
  } else {
    inputField.classList.remove('invalid');
  }
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

// function to show the delete component
const showDeleteComp = (item, removeable) => {
  if (deleteWrapper.classList.contains('hidden')) {
    deleteWrapper.classList.remove('hidden');
  }

  const html = `
  <h2>Confirm Deletion</h2>
  <p>Do you really want to remove <span>${item}</span> from your contacts?</p>
  <button class="btn btn-tertiary cancel">Cancel</button>
  <button class="btn btn-danger delete">Delete</button>
  `;
  deletePage.innerHTML = html;
  deletePage.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
      removeable.remove();
      if(!getContacts().length) {
        if(emptyPage.classList.contains('hidden')) {
          emptyPage.classList.remove('hidden');
        }
      }
      updateStorage()
      deleteWrapper.classList.add('hidden');
    }
    if (e.target.classList.contains('cancel')) {
      deleteWrapper.classList.add('hidden');
    }
  });
  /* when the delete button is clicked, a little box is shown to confirm the user's action to delete a contact
  if this is true, the parent of the delete button is removed */
};

// function to get all the contacts in the contact field
const getContacts = () => {
  let allContacts = document.querySelectorAll('.contact-details li');
  return allContacts;
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

// function to get a reference to all the input fields
const getInputs = () => {
  const inputs = document.querySelectorAll('.contact-form .form-control');
  return inputs;
};

// function to display contact card when a contact is clicked on
contactContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('container')) {
    /* this is the only way i could think of to get the firstname, lastname, email and 
    phone number form the contact */
    let parent = e.target;
    // i prepopulated the form with the current contact's details
    let firstname = parent.children[0].children[1].textContent; //extract the firstname from the html
    let lastname = parent.children[0].children[2].textContent; //extract the lastname from the html
    let email = parent.children[0].children[3].textContent; //extract the email from the html
    let phone = parent.children[0].children[4].textContent; //extract the phone from the html
    /* when the edit button is clicked, then the form should be shown with the input fields prepopulated with
       text of the field that is to be updated and when form is submitted, then the parent of the edit should
       be updated with the value from the input field */
    contactCard.addEventListener('click', (e) => {
      if (e.target.classList.contains('update')) {
        contactCard.classList.add('hidden');
        showForm(`Edit ${firstname}`, 'Update', 'edit');
        getInputs()[0].value = `${firstname}`;
        getInputs()[1].value = `${lastname}`;
        getInputs()[2].value = `${email}`;
        getInputs()[3].value = `${phone}`;
      }
      // extracting the new values from the form

      if (e.target.classList.contains('delete')) {
        showDeleteComp(firstname, parent);
        contactCard.classList.add('hidden');
      }

      if (e.target.classList.contains('cancel')) {
        contactCard.classList.add('hidden');
      }
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
        <span class="fas fa-envelope"></span>
      </div>
    </div>
    <div class="text-group">
      <h3>Phone</h3>
      <div class="info">
        <p>${phone}</p>
        <span class="fas fa-phone"></span>
      </div>
    </div>
  </div>
  <div class="buttons">
    <span class="btn btn-primary update">Edit</span>
    <span class="btn btn-primary cancel">Cancel</span>
    <span class="btn btn-danger delete">Delete</span>
  </div>
  `;
    contactCard.innerHTML = html;
    if (contactCard.classList.contains('hidden')) {
      contactCard.classList.remove('hidden');
    }
  }
});

updateUI();

