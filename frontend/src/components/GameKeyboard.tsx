export const GameKeyboard = () => {
    const keyboardRows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];
  
    return (
      <div className="keyboard">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => {
              const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
              
              return (
                <button
                  key={key}
                  className={`keyboard-key ${isSpecialKey ? 'wide' : ''}`}
                  onClick={() => {}}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };