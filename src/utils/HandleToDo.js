import React from "react";
import { useState, useEffect } from "react";
import ToDo from "../components/ToDo";

const HandleToDo = () => {
  const [toDo, setToDo] = useState([]);
  const [text, setText] = useState("");
  const [isupdating, setIsUpdating] = useState(false);
  const [toDoId, setToDoId] = useState("");

  const BASE_URL = "https://todo-app-mongodb-backend.onrender.com";
  // const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const getAllToDo = async () => {
      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        setToDo(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllToDo();
  }, []);

  //add todo and save to db
  const addToDo = async (text, setText, setToDo) => {
    try {
      const response = await fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      setText("");
      setToDo((prev) => [data, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  //update todo and save to db
  const updateToDo = async (toDoId, text, setText, setToDo, setIsUpdating) => {
    try {
      const response = await fetch(`${BASE_URL}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: toDoId, text }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseData = await response.text();
      console.log("Server respone data: ", responseData);

      const data = JSON.parse(responseData);

      setToDo((prev) =>
        prev.map((item) => (item._id === toDoId ? data : item))
      );
      console.log("Updated state: ", toDo);
      setText("");
      setIsUpdating(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  //delete todo from db
  const deleteToDo = async (_id) => {
    try {
      const response = await fetch(`${BASE_URL}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      setToDo((prev) => prev.filter((item) => item._id !== _id));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  //update handler
  const updateMode = (_id, text) => {
    setIsUpdating(true);
    setToDoId(_id);
    setText(text);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>
          <strong>TODO LIST BY COLIN</strong>
        </h1>
        <div className="top">
          <input
            type="text"
            placeholder="Add a todo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div
            className="add"
            onClick={() =>
              isupdating
                ? updateToDo(toDoId, text, setText, setToDo, setIsUpdating)
                : addToDo(text, setText, setToDo)
            }
          >
            {isupdating ? "Update" : "Add"}
          </div>
        </div>
        <div className="list">
          {toDo.map((item, index) => (
            <ToDo
              key={index}
              id={item._id}
              text={item.text}
              updatemode={() => updateMode(item._id, item.text)}
              deleteToDo={() => deleteToDo({ _id: item._id, setToDo })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandleToDo;
