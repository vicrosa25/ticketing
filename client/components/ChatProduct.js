import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import styled from "styled-components";

const ChatEngineWrapper = dynamic(() =>
  import("react-chat-engine").then((module) => module.ChatEngineWrapper)
);

const Socket = dynamic(() =>
  import("react-chat-engine").then((module) => module.Socket)
);

const ChatFeed = dynamic(() =>
  import("react-chat-engine").then((module) => module.ChatFeed)
);

const ChatProduct = ({ seller, buyer, title }) => {
  const [chat, setChat] = useState(null);

  useEffect(async () => {
    // Create the chat
    const { data } = await axios.put(
      "https://api.chatengine.io/chats/",
      {
        usernames: [`${buyer.email}`],
        title: `${title}`,
        is_direct_chat: true,
      },
      {
        headers: {
          "Project-ID": "b101a0f1-1d18-464d-bd72-1c6914e77bae",
          "User-Name": `${seller.email}`,
          "User-Secret": `${seller.email}`,
        },
      }
    );
    setChat(data);

    // return async () => {
    //   const response = await axios.get(
    //     `https://api.chatengine.io/chats/${chat.id}/messages/`,
    //     {
    //       headers: {
    //         "Project-ID": "b101a0f1-1d18-464d-bd72-1c6914e77bae",
    //         "User-Name": `${buyer.email}`,
    //         "User-Secret": `${buyer.email}`,
    //       },
    //     }
    //   );
    //   console.log(response.data);
    //   const message = response.data.last_message;
    //   if (messages.text === "") {
    //     try {
    //       await axios.delete(`https://api.chatengine.io/chats/${chat.id}/`, {
    //         headers: {
    //           "Project-ID": "b101a0f1-1d18-464d-bd72-1c6914e77bae",
    //           "User-Name": `${buyer.email}`,
    //           "User-Secret": `${buyer.email}`,
    //         },
    //       });
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // };
  }, []);

  if (chat === null) return <div />;
  return (
    <ChatWindow>
      <ChatEngineWrapper>
        <Socket
          projectID={"b101a0f1-1d18-464d-bd72-1c6914e77bae"}
          userName={buyer.email}
          userSecret={buyer.email}
        />
        <ChatFeed activeChat={chat.id} />
      </ChatEngineWrapper>
    </ChatWindow>
  );
};

const ChatWindow = styled.div`
  // Position
  position: "fixed";
  bottom: "116px";
  right: "24px";
  // Size
  width: "420px";
  height: "530px";
  max-width: "calc(100% - 48px)";
  max-height: "calc(100% - 48px)";
  background-color: "white";
  // Border
  border-radius: "12px";
  border: 2px solid red;
  overflow: "hidden";
  // Shadow
  box-shadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)";
`;

export default ChatProduct;
