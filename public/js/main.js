const chatForm = document.getElementById('chat-form');
const chatFormG = document.getElementById('chat-form-g');
const chatFormI = document.getElementById('chat-form-im');
const chatFormGI = document.getElementById('chat-form-g-im');
const chatFormP = document.getElementById('chat-form-p-u');
const chatFormPI = document.getElementById('chat-form-p-im');
const chatMessages = document.querySelector('.chat-messages');
const chatMessagesG = document.querySelector('.chat-messages-g');
const chatMessagesP = document.querySelector('.chat-messages-p-u');
const wrongP = document.querySelector('.wrong');
const roomName = document.getElementById('room-name');
const chatW = document.getElementById('chatW');
const userList = document.getElementById('users');
const userListG = document.getElementById('users-g');
const priUser = document.getElementById('chat-form-p');
const priUserG = document.getElementById('chat-form-g-p');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
var pri=''
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Get global room and users
socket.on('roomUsersG', ({ room, users }) => {
  outputUsersG(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Image from server
socket.on('messageI', (message) => {
  console.log(message);
  outputMessageI(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Global Message from Server
socket.on('messageG', (message) => {
  console.log(message);
  outputMessageG(message);

  // Scroll down
  chatMessagesG.scrollTop = chatMessagesG.scrollHeight;
});


//Global Image from Server
socket.on('messageGI', (message) => {
  console.log(message);
  outputMessageGI(message);

  // Scroll down
  chatMessagesG.scrollTop = chatMessagesG.scrollHeight;
});

//Private Message from Server

socket.on('messageP',(msg)=>{
  pri=msg.username
  console.log(pri)
  outputMessageP(msg)
  chatMessagesP.scrollTop = chatMessagesP.scrollHeight;
})

socket.on('messageIni', (msg)=>{
  outputUName(msg.username)
  outputMessageP(msg)
})

socket.on('messagePI', (message) => {
  console.log(message);
  outputMessagePI(message);

  // Scroll down
  chatMessagesP.scrollTop = chatMessagesP.scrollHeight;
});

socket.on('wrongUser', (message) => {
  console.log(message);
  alert(message)

});



// Room Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


// Global message submit
chatFormG.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessageG', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


//Converting image file to base64
const convertBase64=(file)=>{
  return new Promise((resolve,reject)=>{
    const fileReader=new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      resolve(fileReader.result);
    }
    
    fileReader.onerror=(err)=>{
      reject(err);
    }
  })
}

//Room image submit
chatFormI.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.image.files[0];
  const base64 = await convertBase64(msg)
  console.log(base64.toString())


  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessageI', base64.toString());

});


//Global image submit
chatFormGI.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.image.files[0];
  const base64 = await convertBase64(msg)
  console.log(base64.toString())


  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessageGI', base64.toString());

});

chatFormP.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }
  console.log(pri)
  // Emit message to server
  socket.emit('chatMessageP', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

chatFormPI.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.image.files[0];
  const base64 = await convertBase64(msg)
  console.log(base64.toString())


  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessagePI', base64.toString());

});


//initiate private chat
priUser.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.pri.value;
  console.log(msg)
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  socket.emit('priInitiate', msg);

  // Clear input
  e.target.elements.pri.value = '';
  e.target.elements.pri.focus();
});


//initiate private chat from global
priUserG.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.priG.value;
  console.log(msg)
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  socket.emit('priInitiateG', msg);

  // Clear input
  e.target.elements.priG.value = '';
  e.target.elements.priG.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}
function outputMessageG(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages-g').appendChild(div);
}

function outputMessageI(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('img');
  para.classList.add('image');
  para.setAttribute("src", message.text)
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function outputMessageGI(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('img');
  para.classList.add('image');
  para.setAttribute("src", message.text)
  div.appendChild(para);
  document.querySelector('.chat-messages-g').appendChild(div);
}

function outputMessageP(message) {
  console.log(message)
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages-p-u').appendChild(div);
}

function outputMessagePI(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('img');
  para.classList.add('image');
  para.setAttribute("src", message.text)
  div.appendChild(para);
  document.querySelector('.chat-messages-p-u').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUName(user) {
  console.log(user)
  chatW.innerText = user;
}



// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    const un = user.username;
    li.value = un
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

function outputUsersG(users) {
  userListG.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.value = user.username
    li.innerText = user.username;
    userListG.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
