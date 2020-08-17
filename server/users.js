const users = [];

const addUser = ({id, name, room}) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room == room && user.name === name
  );

  if (existingUser) {
    return {
      error: "Username is alreday taken.",
    };
  }

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    
    return user.id === id;
  });

  console.log("Users", users);
  console.log(id, index);

  if (index !== -1) {
    const user = users.splice(index, 1)[0];
    console.log("Here", user);
    return user;
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom }