import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please enter both username and password");
    } else if (username !== "Jeeva" || password !== "1234") {
      setError("Invalid username or password");
    } else {
      setError("");
      onLogin(username);
    }
  };

  return (
    <div style={styles.loginBackground}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={styles.loginBox} // NO changes here!
      >
        <h2 style={styles.heading}>Login to To-Do List</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input} // Original style
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input} // Original style
        />
        {error && (
          <motion.p style={styles.errorText} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error}
          </motion.p>
        )}
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </motion.div>
    </div>
  );
}

export default function TodoList() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("normal");
  const [category, setCategory] = useState("Personal");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "normal",
    category: "Personal",
    tags: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const handleLoginSuccess = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleAddTask = () => {
    if (input.trim() === "") {
      setError("Enter a valid task");
      return;
    }

    const newTask = {
      title: input,
      description,
      dueDate,
      priority,
      category,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((createdTask) => {
        setTasks([...tasks, createdTask]);
        setInput("");
        setDescription("");
        setDueDate("");
        setPriority("normal");
        setCategory("Personal");
        setTags("");
        setError("");
      })
      .catch((err) => {
        console.error("Error adding task:", err);
        setError(err.message || "Something went wrong");
      });
  };

  const handleEditClick = (task) => {
    setEditTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      tags: task.tags.join(", "),
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateTask = () => {
    const updatedTask = {
      ...editForm,
      tags: editForm.tags.split(",").map((tag) => tag.trim()),
    };

    fetch(`http://localhost:3000/tasks/${editTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTasks(tasks.map((task) => (task._id === editTaskId ? updated : task)));
        setEditTaskId(null);
      })
      .catch((err) => {
        console.error("Update failed", err);
        setError("Failed to update task");
      });
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "normal",
      category: "Personal",
      tags: "",
    });
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
      });
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;

  return (
    <div style={styles.background}>
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={styles.container}
      >
        <h1 style={styles.heading}>{username}'s To-Do List</h1>

        <div style={styles.inputContainerColumn}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Task title"
            style={styles.compactInput}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={styles.compactTextarea}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.compactInput}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={styles.compactInput}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.compactInput}
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Shopping">Shopping</option>
          </select>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            style={styles.compactInput}
          />
          {error && <p style={styles.errorText}>{error}</p>}
          <button onClick={handleAddTask} style={styles.button}>
            Add Task
          </button>
        </div>

        <ul style={styles.list}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                style={styles.listItem}
              >
                {editTaskId === task._id ? (
                  <div style={styles.editFormContainer}>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      style={styles.editInput}
                      placeholder="Title"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      style={styles.editTextarea}
                      placeholder="Description"
                    />
                    <input
                      type="date"
                      name="dueDate"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                      style={styles.editInput}
                    />
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleEditChange}
                      style={styles.editInput}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      style={styles.editInput}
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Study">Study</option>
                      <option value="Shopping">Shopping</option>
                    </select>
                    <input
                      name="tags"
                      value={editForm.tags}
                      onChange={handleEditChange}
                      style={styles.editInput}
                      placeholder="Tags (comma separated)"
                    />
                    <div style={styles.editButtonsContainer}>
                      <button onClick={handleUpdateTask} style={styles.saveButton}>
                        Save
                      </button>
                      <button onClick={handleCancelEdit} style={styles.cancelButton}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <small>Due: {task.dueDate}</small>
                    <br />
                    <small>Priority: {task.priority}</small>
                    <br />
                    <small>Category: {task.category}</small>
                    <br />
                    <small>Tags: {task.tags.join(", ")}</small>
                    <br />
                    <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
                    <br />
                    <button onClick={() => handleEditClick(task)} style={styles.button}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </div>
  );
}

const styles = {
  loginBackground: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to top left, #a18cd1, #fbc2eb)",
    padding: 20,
  },
  loginBox: {
    width: 300,
    background: "#ffffffcc",
    borderRadius: 20,
    padding: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  },
  background: {
    minHeight: "100vh",
    background: "radial-gradient(circle, #f8f9fa, #e0c3fc)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    background: "#ffffffcc",
    borderRadius: 20,
    padding: 30,
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: "1.8rem",
    color: "#4a148c",
  },
  inputContainerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },

  // Original input styles for login inputs (unchanged)
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #aaa",
    outline: "none",
    marginBottom: 10,
    width: "100%",
  },

  // Smaller inputs for Add Task form
  compactInput: {
    padding: 8,
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #aaa",
    outline: "none",
    marginBottom: 6,
    width: "100%",
    height: 36,
    boxSizing: "border-box",
  },
  compactTextarea: {
    padding: 8,
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #aaa",
    resize: "vertical",
    outline: "none",
    width: "100%",
    height: 70,
    maxHeight: 90,
    marginBottom: 6,
    boxSizing: "border-box",
  },

  button: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginRight: 8,
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: 20,
  },
  listItem: {
    background: "linear-gradient(to right, #a18cd1, #fbc2eb)",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#e91e63",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: 8,
  },
  errorText: {
    color: "#d32f2f",
    backgroundColor: "#fce4ec",
    padding: "8px",
    borderRadius: "8px",
    marginBottom: 10,
    fontSize: "0.9rem",
  },

  // Edit form styles (compact)
  editFormContainer: {
    backgroundColor: "#f3e5f5",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 3px 8px rgba(161, 140, 209, 0.4)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  editButtonsContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #6a1b9a, #8e24aa)",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    flex: 1,
  },
  cancelButton: {
    padding: "10px 18px",
    backgroundColor: "#e57373",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
    flex: 1,
  },

  editInput: {
    padding: 8,
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #aaa",
    outline: "none",
    marginBottom: 6,
    width: "100%",
    height: 36,
    boxSizing: "border-box",
  },
  editTextarea: {
    padding: 8,
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #aaa",
    resize: "vertical",
    outline: "none",
    width: "100%",
    height: 70,
    maxHeight: 90,
    marginBottom: 6,
    boxSizing: "border-box",
  },
};
