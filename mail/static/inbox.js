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
        body: body.value,
        read: "false"
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
  //console.log("compose_email")
  // Show compose view and hide other views
  const views = document.querySelectorAll("[data-view-id]")
  views.forEach(view => {
    view.style.display = 'none'
    //console.log("test_none")
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
    //console.log("view_deleted")
  })
  switch (mailbox) {
      case "inbox":
    document.querySelector('#emails-view').style.display = 'block';
    //console.log("mailbox:" , mailbox);
    get_emails("inbox")
    break;
  case "sent":
    document.querySelector('#sent-view').style.display = 'block';
    //console.log("mailbox:" , mailbox)
    get_emails("sent")
    break;
  case "archive":
    document.querySelector('#archived-view').style.display = 'block';
    get_emails("archive")
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
function get_emails(mailbox){
    //console.log(mailbox)
    if (mailbox == "sent") {
        const view = "#sent-view"
        //console.log("mailbox sent get emails in loop")
          fetch('/emails/sent')
          .then(response => response.json())
          .then(emails => {
              const email_list = document.querySelector('#sent-view')
              while (email_list.hasChildNodes()) {
                email_list.removeChild(email_list.firstChild);
                 //console.log("deleting child")
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

                  // if email.read is true add gray background to email div
                    if (email.read) {
                        email_div.style.backgroundColor = 'gray'
                        //console.log(email.read)
                    } else {
                      email_div.style.backgroundColor = 'white'
                    }
                  // Add click event listener to email subject
                  email_subject.addEventListener('click', () => getEmailContent(view,email.id))

                })
          });
    } if (mailbox === "inbox") {
        //console.log("mailbox inbox get emails in loop")
        const view = "#emails-view"
        fetch('/emails/inbox')
          .then(response => response.json())
          .then(emails => {
              const email_list = document.querySelector('#emails-view')
              while (email_list.hasChildNodes()) {
                email_list.removeChild(email_list.firstChild);
                // console.log("deleting child")
              }
              //console.log(emails)
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

                  // add a button to archive the email
                    const archive_button = document.createElement('button')
                    archive_button.innerHTML = "Archive"
                    archive_button.addEventListener('click', () => SwitcharchiveEmail(email.id))

                  // add reply button
                  const reply_button = document.createElement('button')
                  reply_button.innerHTML = "reply"
                  reply_button.addEventListener('click', () => replyToEmail(email.id))

                  email_div.appendChild(email_sender)
                  email_div.appendChild(email_subject)
                  email_div.appendChild(email_timestamp)
                  email_div.appendChild(email_id)
                  email_div.appendChild(archive_button)
                    email_div.appendChild(reply_button)



                  document.querySelector('#emails-view').append(email_div)

                  // if email.read is true add gray background to email div
                    if (email.read == true) {
                        email_div.style.backgroundColor = 'gray'
                        console.log(email.read)
                    } else {
                      email_div.style.backgroundColor = 'white'
                    }
                  // Add click event listener to email email_subject
                  email_subject.addEventListener('click', () => getEmailContent(view,email.id))

                })
          });
    } else if (mailbox === "archive") {
        //const view = "#archived-view"
  console.log("mailbox archive get emails in loop")
  fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
        const email_list = document.querySelector('#archived-view')
        while (email_list.hasChildNodes()) {
          email_list.removeChild(email_list.firstChild);
          //console.log("deleting child")
        }
        console.log(emails)
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
          // add a button to archive the email
          const archive_button = document.createElement('button')
          archive_button.innerHTML = "un-archive"
          archive_button.addEventListener('click', () => SwitcharchiveEmail(email.id))

          email_div.appendChild(email_sender)
          email_div.appendChild(email_subject)
          email_div.appendChild(email_timestamp)
          email_div.appendChild(email_id)
          email_div.appendChild(archive_button)

          document.querySelector('#archived-view').append(email_div)

          // if email.read is true add gray background to email div
          if (email.read == true) {
              email_div.style.backgroundColor = 'gray'
              console.log(email.read)
          } else {
            email_div.style.backgroundColor = 'white'
          }
          // Add click event listener to email div
          email_div.addEventListener('click', () => getEmailContent(email.id))
        })
    });
    }
}

function getEmailContent(view, emailId) {

  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      // delete all elements in the email view
        const email_list = document.querySelector(view)
        while (email_list.hasChildNodes()) {
          email_list.removeChild(email_list.firstChild);
          //console.log("deleting child 2")
        }
        if (email.read == false) {
            change_read_status(emailId)
            //console.log("email.read is false")
        }
        //console.log(email.read)

        // create a div to display the email content
        const email_div = document.createElement('div')
        email_div.classList.add('email-container')
        const email_subject = document.createElement('h3')
        email_subject.innerHTML = email.subject
        const email_sender = document.createElement('p')
        email_sender.innerHTML = `FROM: ${email.sender}`
        const email_timestamp = document.createElement('p')
        email_timestamp.innerHTML = `TIMESTAMP: ${email.timestamp}`
        const email_body = document.createElement('p')
        email_body.innerHTML = `BODY: ${email.body}`
        const email_id = document.createElement('p')
        email_id.innerHTML = `email_Id: ${email.id}`
        const email_recipients = document.createElement('p')
        email_recipients.innerHTML = `RECIPIENTS: ${email.recipients}`
        const email_read = document.createElement('p')
        email_read.innerHTML = `READ: ${email.read}`
        const email_archived = document.createElement('p')
        email_archived.innerHTML = `ARCHIVED: ${email.archived}`
        //const email_reply = document.createElement('button')
        //email_reply.innerHTML = `REPLY`




        email_div.appendChild(email_sender)
        email_div.appendChild(email_subject)
        email_div.appendChild(email_timestamp)
        email_div.appendChild(email_body)
        email_div.appendChild(email_id)
        email_div.appendChild(email_recipients)
        email_div.appendChild(email_read)
        email_div.appendChild(email_archived)
        //email_div.appendChild(email_reply)
        document.querySelector(view).append(email_div)

    })
    .catch(error => console.log(error));
};

function change_read_status(emailId) {
    fetch(`/emails/${emailId}`, {
        method: 'PUT',
        body: JSON.stringify( {
        read: true })
    })
    .then(response => response.json())
    .catch(error => console.log(error));
}

function SwitcharchiveEmail(emailId) {
    fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
        if (email.archived == false) {
            archiveEmail(emailId)

        } else {
            unarchiveEmail(emailId)

        }
    })
}

function archiveEmail(emailId) {
    fetch(`/emails/${emailId}`, {
        method: 'PUT',
        body: JSON.stringify( {
        archived: true })
    })
    .then(response => {
        console.log(response)
        load_mailbox("inbxox")
    })
    .catch(error => console.log(error));

}

function unarchiveEmail(emailId) {
    fetch(`/emails/${emailId}`, {
        method: 'PUT',
        body: JSON.stringify( {
        archived: false })
    })
    .then(response => {
        console.log(response)
        load_mailbox("inbox")
    })
    .catch(error => console.log(error));

}

function replyToEmail(emailId) {
    //  go to compose view, pre-fill the form
    //  with the recipient field  set to whoever sent the original email.
    //  Pre-fill the subject line. If the original email had a subject line of foo, the new subject
    //  line should be Re: foo. (If the subject line already begins with Re: , no need to add it again.)
    //  Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:
    //  " followed by the original text of the email.

    fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
        console.log(email)

        // load compose view
        const views = document.querySelectorAll("[data-view-id]")
          views.forEach(view => {
            view.style.display = 'none'
            //console.log("test_none")
          })

        // show the compose view
          document.querySelector('#compose-view').style.display = 'block';

        // use ternary operator to check if email.subject starts with Re:
            const subject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;

        // pre-fill the form
          document.querySelector('#compose-recipients').value = email.sender;
          document.querySelector('#compose-subject').value = subject ;
          document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`;

    })
}