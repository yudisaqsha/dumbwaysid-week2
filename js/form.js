function sendMail(event){
    event.preventDefault();
        const nameData = document.getElementById("name").value;
        const emailData = document.getElementById("email").value;
        const numberData = document.getElementById("number").value;
        const subjectData = document.getElementById("subject").value;
        const msgData = document.getElementById("message").value;
    
    console.log(nameData);
    console.log(emailData);
    console.log(numberData);
    console.log(subjectData);
    console.log(msgData);

    const a = document.createElement('a');
    a.href = 'mailto:'+emailData+'?subject='+subjectData+'&body='+msgData;
    a.click();
}

