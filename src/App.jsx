import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabase-client";

function App() {
  const [todoList, setTodoList] = useState([]); // Stores the list of todos
  const [newTodo, setNewTodo] = useState(""); // Stores the new todo input
  const [newDose, setNewDose] = useState(""); // Stores the new todo input
  const [newQuantity, setNewQuantity] = useState(""); // Stores the new todo input
  const [newPharmacy, setNewPharmacy] = useState(""); // Stores the new todo input
  const [newPrice, setNewPrice] = useState(""); // Stores the new todo input
  const [newExpiry, setNewExpiry] = useState(""); // Stores the new todo input

  // Fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch todos from the database
  const fetchTodos = async () => {
    const { data, error } = await supabase.from("TodoList").select("*");
    if (error) {
      console.error("Error fetching todos: ", error);
    } else {
      setTodoList(data || []); // Set the fetched data or fallback to an empty array
    }
  };

  // Function to add a new todo to the database
  const addTodo = async () => {
    if (!newTodo.trim() || !newDose) { // Validate both name and dose
      alert("Todo name and dose cannot be empty!");
      return;
    }

    const newTodoData = {
      name: newTodo,
      dose: newDose,
      quantity: newQuantity,
      pharmacy: newPharmacy,
      price: newPrice,
      expiry: newExpiry,
      isCompleted: false,
    };

    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData]) // Insert the todo with all fields
      .select("*")           // Ensure Supabase returns the inserted row(s)
      .single();             // Expect a single row

    if (error) {
      console.error("Error adding todo: ", error);
    } else if (data) {
      setTodoList((prev) => [...prev, data]); // Add the new todo to the current list
      setNewTodo("");   // Clear the todo name input
      setNewDose("");   // Clear the dose input
      setNewQuantity("");
      setNewPharmacy("");
      setNewPrice("");
      setNewExpiry("");
    }
  };

  // Function to toggle the completion status of a task
  /*
  const completeTask = async (id, isCompleted) => {
    const { error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task: ", error);
    } else {
      // Update the task's completion status in the state
      setTodoList((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
        )
      );
    }
  };
  */

  // Function to delete a task from the database
  const deleteTask = async (id) => {
    const { error } = await supabase
      .from("TodoList")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task: ", error);
    } else {
      // Remove the task from the state
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      <h1>OpenGaza Database</h1>
      <div>
        <input
          type="text"
          placeholder="Chemical Name..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Dosage..."
          value={newDose}
          onChange={(e) => setNewDose(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Quantity..."
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Pharmacy Name..."
          value={newPharmacy}
          onChange={(e) => setNewPharmacy(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Price..."
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Expiry Date..."
          value={newExpiry}
          onChange={(e) => setNewExpiry(e.target.value)}
        />
      </div>

      <div>
        <button onClick={addTodo}>Add Medication</button>
      </div>

      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Chemical Name</th>
            <th>Dosage</th>
            <th>Quantity</th>
            <th>Pharmacy</th>
            <th>Price</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todoList.length > 0 ? (
            todoList.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.name}</td>
                <td>{todo.dose}</td>
                <td>{todo.quantity}</td>
                <td>{todo.pharmacy}</td>
                <td>{todo.price}</td>
                <td>{todo.expiry}</td>
                <td>

                  <button onClick={() => deleteTask(todo.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No tasks found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;