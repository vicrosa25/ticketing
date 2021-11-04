
import 'jest';

const createChatUser = jest.fn().mockReturnValue({resolve: {}});

const chatUser = jest.mock('../chatUser.ts', () => {
    return {
        createChatUser
    };
});

export default chatUser;