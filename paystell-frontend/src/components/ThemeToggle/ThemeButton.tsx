import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button';

interface ButtonThemeProps {
  theme: string;
  onClick: () => void;
}

export function ButtonTheme({ theme, onClick }: ButtonThemeProps) {
  return (
    <Button variant={'outline'} onClick={onClick}>
      {theme === 'dark' ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
      <span className="ml-2">{theme === 'dark' ? 'Turn Light Mode' : 'Turn Dark Mode'}</span>
    </Button>
  );
}
