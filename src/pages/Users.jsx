import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import "../pages/user.css";

const Users = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const postMutation = useMutation({
    mutationFn: (body) => api.post("/users", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: (body) => api.put(`/users/${body.id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: "", name: "", age: "" });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData);
    postMutation.mutate(body, {
      onSuccess: () => {
        e.target.reset();
      },
    });
  };

  const handleEdit = (user) => {
    setCurrentUser({ id: user.id, name: user.name, age: user.age });
    setIsModalOpen(true);
  };

  const handleModalChange = (e) => {
    setCurrentUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    editMutation.mutate(currentUser);
  };

  return (
    <div className="container">
      <h2>User</h2>

      <form onSubmit={handleSubmit} className="form">
        <input name="name" type="text" placeholder="Full name" required />
        <input name="age" type="number" placeholder="Age" required />
        <button type="submit">Submit</button>
      </form>

      <div className="blog-grid">
        {data?.data?.map((user) => (
          <div key={user.id} className="card">
            <img src={user.avatar} alt={user.name} className="card-img" />
            <div className="card-body">
              <h3 className="card-title">{user.name}</h3>
              <p className="card-subtitle">{user.age} yosh</p>
              <div className="card-buttons">
                <button className="edit-btn" onClick={() => handleEdit(user)}>
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Tahrirlash</h3>
            <form onSubmit={handleModalSubmit} className="modal-form">
              <input
                type="text"
                name="name"
                value={currentUser.name}
                onChange={handleModalChange}
                placeholder="Ismi"
                required
              />
              <input
                type="number"
                name="age"
                value={currentUser.age}
                onChange={handleModalChange}
                placeholder="Yoshi"
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  💾 Saqlash
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  ❌ Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
