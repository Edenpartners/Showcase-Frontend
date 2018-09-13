import styled from 'styled-components';
import { ListGroupItem } from 'reactstrap';

const MemberItem = styled(ListGroupItem)`
  &:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  &:last-child {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  &.active {
    background-color: #f2f3f5;
    border-color: #f2f3f5;
    color: #010228;
    font-weight: 600;
  }
  padding-top: 8px;
  padding-bottom: 8px;
  border: none;
  border-top: 1px solid rgba(220, 220, 231, 0.18);
`;

export default MemberItem;
