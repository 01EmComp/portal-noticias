import { useState, useEffect } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "/src/Services/firebaseConfig";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

// Components
import UserItem from "./UsersItem/UsersItem";

// Css
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Não foi possível carregar os usuários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por role
    if (roleFilter === "admin") {
      filtered = filtered.filter((user) => user.role === "admin");
    } else if (roleFilter === "editor") {
      filtered = filtered.filter((user) => user.role === "editor");
    } else if (roleFilter === "user") {
      filtered = filtered.filter(
        (user) => user.role !== "admin" && user.role !== "editor"
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Lógica de paginação
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="users-list-container">
        <div className="users-loading">
          <div className="loading-spinner"></div>
          <p className="users-message">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-list-container">
        <div className="users-error">
          <p className="users-error-message">{error}</p>
          <button onClick={fetchUsers} className="users-retry-button">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      <div className="users-header">
        <div className="users-info">
          <h2>Gerenciar Usuários</h2>
          <p className="users-count">
            Total: <strong>{filteredUsers.length}</strong> usuário(s)
            {filteredUsers.length !== users.length && (
              <span className="filtered-info">
                {" "}
                (de {users.length} no total)
              </span>
            )}
          </p>
        </div>

        <div className="users-list-refresh" onClick={fetchUsers}>
          <FontAwesomeIcon
            icon={faRotateRight}
            className="icon"
            style={{ fontSize: "18px" }}
          />
        </div>

        {/* Botão de filtro */}
        <button
          onClick={toggleFilters}
          className={`filter-toggle-button ${showFilters ? "active" : ""}`}
          title="Filtros"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
            <circle cx="8" cy="6" r="2" fill="currentColor"></circle>
            <circle cx="16" cy="12" r="2" fill="currentColor"></circle>
            <circle cx="12" cy="18" r="2" fill="currentColor"></circle>
          </svg>
          Filtros
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="users-filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="search">Buscar:</label>
              <input
                id="search"
                type="text"
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="role">Cargo:</label>
              <select
                id="role"
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="filter-select"
              >
                <option value="all">Todos</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">Usuário</option>
              </select>
            </div>
          </div>

          {(searchTerm || roleFilter !== "all") && (
            <button onClick={clearFilters} className="clear-filters-button">
              Limpar Filtros
            </button>
          )}
        </div>
      )}

      {/* Lista de usuários */}
      {filteredUsers.length === 0 ? (
        <div className="users-empty">
          <p className="users-message">
            {searchTerm || roleFilter !== "all"
              ? "Nenhum usuário encontrado com os filtros aplicados."
              : "Nenhum usuário encontrado."}
          </p>
        </div>
      ) : (
        <>
          <div className="users-list-wrapper">
            <div className="users-list-header">
              <div className="header-item header-name">Nome</div>
              <div className="header-item header-email">E-mail</div>
              <div className="header-item header-actions">Visualizar</div>
            </div>

            {/* Lista de usuários */}
            <div className="users-list">
              {currentUsers.map((user) => (
                <UserItem
                  key={user.id}
                  id={user.id}
                  name={user.name || "Nome não informado"}
                  email={user.email || "Email não informado"}
                  phone={user.phone || "Telefone não informado"}
                  role={user.role}
                />
              ))}
            </div>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ← Anterior
              </button>

              <div className="pagination-numbers">
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => paginate(1)}
                      className="pagination-number"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                  </>
                )}

                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-number ${
                      currentPage === number ? "active" : ""
                    }`}
                  >
                    {number}
                  </button>
                ))}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                    <button
                      onClick={() => paginate(totalPages)}
                      className="pagination-number"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Próxima →
              </button>
            </div>
          )}

          {/* Informação da página atual */}
          <div className="pagination-info">
            Mostrando {indexOfFirstUser + 1} a{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} de{" "}
            {filteredUsers.length} usuário(s)
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
