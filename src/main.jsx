import React from 'react';
import './style.css'; // Импорт стилей

function Options() {
  const optionsData = [
    {
      background: 'https://raw.githubusercontent.com/Programith/Images/main/background_01.jpg',
      icon: 'fas fa-walking',
      main: 'Ultricies',
      sub: 'Elit ut aliquam purus sit',
    },
    // Другие объекты с данными для опций...
  ];

  const handleOptionClick = (index) => {
    // Обработчик клика по опции
    console.log(`Clicked option ${index}`);
    // Добавьте здесь логику для выделения активной опции
  };

  return (
    <div className="options">
      {optionsData.map((option, index) => (
        <div
          key={index}
          className={`option${index === 0 ? ' active' : ''}`} // Добавляем класс active для первой опции
          style={{ '--optionBackground': `url(${option.background})` }}
          onClick={() => handleOptionClick(index)}
        >
          <div className="label">
            <div className="icon">
              <i className={option.icon}></i>
            </div>
            <div className="info">
              <div className="main">{option.main}</div>
              <div className="sub">{option.sub}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Options;