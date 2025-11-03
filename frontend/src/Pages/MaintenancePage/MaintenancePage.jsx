import './MaintenancePage.css';

const MaintenancePage = ({ type = 'maintenance' }) => {
  const messages = {
    maintenance: {
      code: '503',
      title: 'Site em Manutenção',
      description: 'Estamos realizando melhorias. Voltaremos em breve.'
    },
    disabled: {
      code: '503',
      title: 'Site Temporariamente Indisponível',
      description: 'O site está desativado no momento. Tente novamente mais tarde.'
    }
  };

  const message = messages[type] || messages.maintenance;

  return (
    <div className="maintenance-container">
      <h1 className="maintenance-code">{message.code}</h1>
      <h2 className="maintenance-title">{message.title}</h2>
      <p className="maintenance-description">{message.description}</p>
    </div>
  );
};

export default MaintenancePage;