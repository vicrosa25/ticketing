import request from "supertest";
import { app } from "../../app";
import { User} from '../../models/user';


it('returns a user', async () => {
    // 1. Create a user
    const user = new User();
    user.email = 'test@test.com';
    user.password = 'password';
    await user.save();

    // 2. Macke the request
    const response = await request(app)
        .get("/api/users/1")
        .expect(200);

    // 3. Assertion
    expect(response.body.email).toEqual(user.email);
});


it("returns a 404 if the user is not found", async () => {
    await request(app).get("/api/tickets/1").send().expect(404);
});