import react from 'react';
import styles from '../searchBar.module.css';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {DynamicFontAwesomeIcon} from '@/components';

type SearchButtonProps = {
    onClick: (event?: React.MouseEvent<HTMLDivElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};

const SearchButton: React.FC<SearchButtonProps> = ({ onClick, onKeyDown }) => {
    return (
        <div 
            className={styles.searchIconContainer}
            onClick={onClick}
            onKeyDown={onKeyDown}
            tabIndex={0}
        >
            <DynamicFontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
        </div>
    );
};

export default SearchButton;
