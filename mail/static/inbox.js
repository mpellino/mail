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
          console.log(result);
      });
  }

});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // TODO:
  // document select all the  views and make them style.display = none,
  // use switch to check what button was pressed and change stile display of the appropriate id to block.
  // ,maybe it would be good to add a class to the different view to select them all at the same time and then use the id
  // to choose the appropriate  on

  //style display none to all the mail views
  const views = document.querySelectorAll("[data-view-id]")

  views.forEach(view => {
    view.style.display = 'none'
    console.log("test")
  })
  switch (mailbox) {
  case "inbox":
    document.querySelector('#emails-view').style.display = 'block';
    console.log(mailbox)
    break;
  case "sent":
    document.querySelector('#sent-view').style.display = 'block';
    console.log(mailbox)
    break;
  case "archive":
    document.querySelector('#archived-view').style.display = 'block';
    console.log(mailbox)
    break;
  default:
    document.querySelector('#emails-view').style.display = 'block';
    break;
}


  // Show the mailbox and hide other views
  //document.querySelector('#emails-view').style.display = 'block';
  //document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`}
