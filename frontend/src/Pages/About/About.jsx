import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// Images
import cityImage from "/src/Assets/Images/city.png";
import memberPhoto1 from "/src/Assets/Images/member-1.png";
import memberPhoto2 from "/src/Assets/Images/member-2.png";

// CSS
import "./About.css";

const About = () => {
  const [activeTab, setActiveTab] = useState("objetivos");
  const [expandedMembers, setExpandedMembers] = useState({});

  const tabs = [
    { id: "objetivos", label: "Objetivos" },
    { id: "equipe", label: "Equipe" },
    { id: "onde-somos", label: "De onde somos" },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "José Nogueira Dias",
      photo: memberPhoto1,
      summary: "Nam mollis tellus ac magna dictum, a finibus mauris iaculis. Aenean nec pulvinar lectus. Suspendisse potenti. Sed commodo aliquam lacus, vitae pharetra ligula placerat in.",
      bio: "Nam mollis tellus ac magna dictum, a finibus mauris iaculis. Aenean nec pulvinar lectus. Suspendisse potenti. Sed commodo aliquam lacus, vitae pharetra ligula placerat in. Aliquam accumsan sapien noque, sit amet pellentesque mi porta non. Cras vitae dolor sed enim aliquet, pellentesque. Nunc ac metus nec risus porta laoreet et eu tellus. Nam venenatis odio non quam congue cursus. Curabitur porttitor lacus cursus est dignissim tempus. Integer commodo mi id tellus vulputate gravida ut vitae. Curabitur porta erat sit vel venenatis euismod. Vivamus at libero vel arcu varius interdum et eu metus. Praesent imperdiet ullamcorper dolor non interdum. Donec facilisis nunc vel sapien fermentum, ac ultricies magna venenatis. Sed euismod lectus quis orci dignissim.",
    },
    {
      id: 2,
      name: "Felipe Franco Ferreira",
      photo: memberPhoto2,
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et ornet magna, nec pretium purus. Praesent euismod rhoncus arcu.",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et ornet magna, nec pretium purus. Praesent euismod rhoncus arcu. Pellentesque vestibulum a lacinia ullamcorper. Aliquam pharetra magna quis sem, non pellentesque tellus felis. Duis semper mattis lobortis vehicula. Maecenas ut turpis vel nunc ultricies aliquet urna eleifend ligula. Sed facilisis odio, eget pretium massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
    },
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

  const toggleMember = (memberId) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
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
            <div className="team-members">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member">
                  <div className="member-header">
                    <div className="member-avatar">
                      {member.photo && (
                        <img src={member.photo} alt={member.name} />
                      )}
                    </div>
                    <div className="member-name-wrapper">
                      <h3>{member.name}</h3>
                      <button
                        className="expand-button"
                        onClick={() => toggleMember(member.id)}
                      >
                        <FontAwesomeIcon
                          icon={
                            expandedMembers[member.id]
                              ? faChevronUp
                              : faChevronDown
                          }
                        />
                      </button>
                    </div>
                  </div>
                  <div className="member-bio">
                    <p>{expandedMembers[member.id] ? member.bio : member.summary}</p>
                  </div>
                </div>
              ))}
            </div>
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