// src/components/Notifications.js
import styled from 'styled-components';

const Notification = styled.div`
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  margin: 10px 0;
`;

export default function Notifications() {
  return (
    <div>
      <Notification>
        This is a notification message.
      </Notification>
    </div>
  );
}