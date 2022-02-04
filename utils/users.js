const users = [];
const usersG = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function userJoinG(id, username, room) {
  const user = { id, username, room };

  usersG.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}


function getCurrentUserG(id) {
  return usersG.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function userLeaveG(id) {
  const index = usersG.findIndex(user => user.id === id);

  if (index !== -1) {
    return usersG.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function getRoomUsersG(room) {
  return usersG.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  userJoinG,
  getCurrentUser,
  getCurrentUserG,
  userLeave,
  userLeaveG,
  getRoomUsers,
  getRoomUsersG
};
