import { useState, useEffect } from "react";

// Firebase
import { db } from "/src/Services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

// Font Awesome Icon's
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faUser } from "@fortawesome/free-solid-svg-icons";

// Images
import cityImage from "/src/Assets/Images/city.png";

// CSS
import "./About.css";

const About = () => {
  const [activeTab, setActiveTab] = useState("objetivos");
  const [expandedMembers, setExpandedMembers] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  const tabs = [
    { id: "objetivos", label: "Objetivos" },
    { id: "equipe", label: "Equipe" },
    { id: "onde-somos", label: "De onde somos" },
  ];

  const objectives = [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et ornet magna, nec pretium purus. Praesent euismod rhoncus arcu. Pellentesque vestibulum a lacinia ullamcorper. Aliquam pharetra magna quis sem, non pellentesque tellus felfeus. Duis semper mattis lobortis vehicula. Maecenas ut turpis vel nunc ultricles aliquet urna eleifend ligula. sed facilisis odio, eget pretium massa.",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et ornet magna, nec pretium purus. Praesent euismod rhoncus arcu. Pellentesque vestibulum a lacinia ullamcorper. Aliquam pharetra magna quis sem, non pellentesque tellus felfeus. Duis semper mattis lobortis vehicula. Maecenas ut turpis vel nunc ultricles aliquet urna eleifend ligula. sed facilisis odio, eget pretium massa.",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et ornet magna, nec pretium purus. Praesent euismod rhoncus arcu. Pellentesque vestibulum a lacinia ullamcorper. Aliquam pharetra magna quis sem, non pellentesque tellus felfeus. Duis semper mattis lobortis vehicula. Maecenas ut turpis vel nunc ultricles aliquet urna eleifend ligula. sed facilisis odio, eget pretium massa.",
    },
  ];

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoadingTeam(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("role", "in", ["admin", "editor"]),
          where("profileVisible", "==", true)
        );

        const querySnapshot = await getDocs(q);
        const members = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          members.push({
            id: doc.id,
            name: data.name || "Sem nome",
            photo: data.photoURL || null,
            role: data.role,
            bio: data.description || "Este membro ainda não adicionou uma descrição.",
          });
        });

        // Ordena por cargo e por nome
        members.sort((a, b) => {
          if (a.role === "admin" && b.role !== "admin") return -1;
          if (a.role !== "admin" && b.role === "admin") return 1;
          return a.name.localeCompare(b.name);
        });

        setTeamMembers(members);
      } catch (error) {
        console.error("Erro ao buscar membros da equipe:", error);
      } finally {
        setLoadingTeam(false);
      }
    };

    if (activeTab === "equipe") {
      fetchTeamMembers();
    }
  }, [activeTab]);

  const toggleMember = (memberId) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return <span className="role-badge admin">Administrador</span>;
    }
    if (role === "editor") {
      return <span className="role-badge editor">Editor</span>;
    }
    return null;
  };

  const getBioPreview = (bio, maxChars = 150) => {
    if (!bio) return "Este membro ainda não adicionou uma descrição.";
    if (bio.length <= maxChars) return bio;
    return bio.substring(0, maxChars) + "...";
  };

  const shouldShowExpandButton = (bio, maxChars = 150) => {
    return bio && bio.length > maxChars;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "objetivos":
        return (
          <div className="about-content">
            <h2>Nossos Objetivos</h2>
            <div className="objectives-list">
              {objectives.map((obj, index) => (
                <p key={index}>{obj.text}</p>
              ))}
            </div>
          </div>
        );

      case "equipe":
        return (
          <div className="about-content">
            <h2>Equipe</h2>
            {loadingTeam ? (
              <div className="loading-team">
                <p>Carregando membros da equipe...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="no-team-members">
                <p>Nenhum membro da equipe disponível no momento.</p>
              </div>
            ) : (
              <div className="team-members">
                {teamMembers.map((member) => (
                  <div key={member.id} className="team-member">
                    <div className="member-header">
                      <div className="member-avatar">
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                        )}
                      </div>
                      <div className="member-info-section">
                        <div className="member-name-wrapper">
                          <div className="member-info">
                            <h3>{member.name}</h3>
                            {getRoleBadge(member.role)}
                          </div>
                          {shouldShowExpandButton(member.bio) && (
                            <button
                              className="expand-button"
                              onClick={() => toggleMember(member.id)}
                              aria-label={
                                expandedMembers[member.id]
                                  ? "Mostrar menos"
                                  : "Mostrar mais"
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  expandedMembers[member.id]
                                    ? faChevronUp
                                    : faChevronDown
                                }
                              />
                            </button>
                          )}
                        </div>
                        <div className="member-bio">
                          <p>
                            {expandedMembers[member.id]
                              ? member.bio
                              : getBioPreview(member.bio)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "onde-somos":
        return (
          <div className="about-content">
            <h2>De onde somos</h2>
            <div className="location-image">
              <img src={cityImage} alt="Rio Pomba" />
            </div>
            <div className="location-info">
              <div className="location-item">
                <strong>Estado:</strong>
                <p>Minas Gerais - MG</p>
              </div>
              <div className="location-item">
                <strong>Cidade:</strong>
                <p>Rio Pomba</p>
              </div>
              <div className="location-item">
                <strong>Endereço:</strong>
                <p>Rua ..., Bairro ..., N°</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="about-container">
      <div className="about-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="about-main">{renderContent()}</div>
    </div>
  );
};

export default About;