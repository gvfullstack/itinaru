import React from 'react';
import styles from '../searchBar.module.css'

type SearchInputProps = {
    inputValue: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ inputValue, onChange }) => {
    return (
        <input
            type="text"
            value={inputValue}
            onChange={onChange}
            placeholder="Search..."
            className={styles.searchInput}
        />
    );
};

export default SearchInput;