import { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import buildClient from "../../helper/build-client";
import AuthContext from "../../contexts/AuthContext";
import styled from "styled-components";

const ChatEngine = dynamic(() =>
  import("react-chat-engine").then((module) => module.ChatEngine)
);

const MessageFormSocial = dynamic(() =>
  import("react-chat-engine").then((module) => module.MessageFormSocial)
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (typeof document !== null) {
      setShowChat(true);
    }
  });

  if (showChat === null) return <div />;
  if (!user) return <div />;

  return (
    <ChatWindow>
      <ChatEngine
        projectID={"b101a0f1-1d18-464d-bd72-1c6914e77bae"}
        userName={user.email}
        userSecret={user.email}
        renderNewMessageForm={() => <MessageFormSocial />}
      />
    </ChatWindow>
  );
};

const ChatWindow = styled.div`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
`;

export async function getServerSideProps({ req }) {
  const client = buildClient(req);
  const { data } = await client.get("/api/users/currentuser");
  const user = data.currentUser;

  const { data: chats } = await axios.get("https://api.chatengine.io/chats/", {
    headers: {
      "Project-ID": "b101a0f1-1d18-464d-bd72-1c6914e77bae",
      "User-Name": user.email,
      "User-Secret": user.email,
    },
  });
  if (chats.length > 0) {
    for (const chat of chats) {
      if (chat.last_message.text === "" && chat.admin.username === user.email)
        await axios.delete(`https://api.chatengine.io/chats/${chat.id}/`, {
          headers: {
            "Project-ID": "b101a0f1-1d18-464d-bd72-1c6914e77bae",
            "User-Name": user.email,
            "User-Secret": user.email,
          },
        });
    }
  }
  return {
    props: {},
  };
}

export default Dashboard;
