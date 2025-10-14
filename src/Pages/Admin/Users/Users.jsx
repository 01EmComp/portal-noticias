// Components
import UserItem from "./UsersItem/UsersItem";

// Css
import "./Users.css";

const Users = () => {
  return (
    <div className="users-list-container">
      <UserItem name={"Nome do usuário"} email={"Email do usuário"} />
      <UserItem
        name={"Guilherme Bernardino Reis"}
        email={"guilhermeb.reis112@gmail.com"}
      />
      <UserItem
        name={"Guilherme Bernardino Reis"}
        email={"guilhermeb.reis112@gmail.com"}
      />
    </div>
  );
};

export default Users;
