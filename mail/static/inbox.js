document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');

  // get the form

    const recipient = document.querySelector("#compose-recipients")
    const subject = document.querySelector("#compose-subject")
    const body = document.querySelector("#compose-body")

  document.querySelector('form').onsubmit = function(event){

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
      recipients: recipient.value,
      subject: subject.value,
      body: body.value
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          //console.log(result);
      });
  }

});

function compose_email() {
  console.log("compose_email")
  // Show compose view and hide other views
  const views = document.querySelectorAll("[data-view-id]")
  views.forEach(view => {
    view.style.display = 'none'
    console.log("test_none")
  })
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // document select all the  views and make them style.display = none,
  // use switch to check what button was pressed and change stile display of the appropriate id to block.
  // ,maybe it would be good to add a class to the different view to select them all at the same time and then use the id
  // to choose the appropriate  on

  //style display none to all the mail views
  const views = document.querySelectorAll("[data-view-id]")

  views.forEach(view => {
    view.style.display = 'none'
    console.log("view_deleted")
  })
  switch (mailbox) {
  case "inbox":
    document.querySelector('#emails-view').style.display = 'block';
    //console.log(mailbox);
    break;
  case "sent":
    document.querySelector('#sent-view').style.display = 'block';
    //console.log(mailbox)
    get_emails()
    break;
  case "archive":
    document.querySelector('#archived-view').style.display = 'block';
    //console.log(mailbox)
    break;
  default:
    document.querySelector('#emails-view').style.display = 'block';
    break;
}


  // Show the mailbox and hide other views
  //document.querySelector('#emails-view').style.display = 'block';
  //document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h2>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h2>`}


//Function to get the emails from the server
function get_emails(){
  fetch('/emails/sent')
  .then(response => response.json())
  .then(emails => {
      const email_list = document.querySelector('#sent-view')
      while (email_list.hasChildNodes()) {
        email_list.removeChild(email_list.firstChild);
        console.log("deleting child")
      }
      //make a loop to display the emails
        emails.forEach(email => {
          const email_div = document.createElement('div')
          email_div.classList.add('email-container')
          const email_subject = document.createElement('h3')
          email_subject.innerHTML = email.subject
          const email_sender = document.createElement('p')
          email_sender.innerHTML = `FROM: ${email.sender}`
          const email_timestamp = document.createElement('p')
          email_timestamp.innerHTML = `TIMESTAMP: ${email.timestamp}`
          const email_id = document.createElement('p')
          email_id.innerHTML = `email_Id: ${email.id}`

          email_div.appendChild(email_sender)
          email_div.appendChild(email_subject)
          email_div.appendChild(email_timestamp)
          email_div.appendChild(email_id)

          document.querySelector('#sent-view').append(email_div)

          // Add click event listener to email div
          email_div.addEventListener('click', () => getEmailContent(email.id))

        })
  });
}

function getEmailContent(emailId) {
  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      // Display email content
      console.log(email);
    })
    .catch(error => console.log(error));
}