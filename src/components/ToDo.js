import React from "react";
import { BiEdit } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";

const ToDo = ({ text, updatemode, deleteToDo, id }) => {
  return (
    <div className="todo" key={id}>
      <div className="text">{text}</div>
      <div className="icons">
        <BiEdit className="edit" onClick={updatemode} />
        <TiDelete className="delete" onClick={deleteToDo} />
      </div>
    </div>
  );
};

export default ToDo;
