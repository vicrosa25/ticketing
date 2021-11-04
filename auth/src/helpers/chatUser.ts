import axios from "axios";

export async function createChatUser(email: string): Promise<void> {
    if(!process.env.CHAT_KEY) {
      throw new Error('CHAT_KEY is undefine');
    }
    await axios.put('https://api.chatengine.io/users/', {
          username: email,
          secret: email,
        },
        {headers: {"Private-Key": process.env.CHAT_KEY}}
      );
  }