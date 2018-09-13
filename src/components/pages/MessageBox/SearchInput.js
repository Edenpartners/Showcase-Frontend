import styled from 'styled-components';

const SearchInput = styled.input`
  width: 100%;
  height: 34px;
  border-radius: 4px;
  background-color: #f0f0f0;
  border: 1px solid #f2f3f5;
  padding: 14px;
  font-size: 14px;
  outline: none;
  margin: 0 20px 0 20px;
  &::placeholder {
    color: #637097;
  }
`;

export default SearchInput;
