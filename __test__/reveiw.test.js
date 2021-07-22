// import connect from "../models/index.js"
// import app from "../index.js"
// import supertest from "supertest"
// import Review from "../models/review.js"
// import User from "../models/user.js"

// const userIds = [];
// beforeAll(async () => {
//     await connect();
//     const review = await User.create({ userName: '테스트' });
//     userIds.push(user._id);
// });

// describe('test for reviews', () => {
//     app = supertest(app);
//     it('too short password', async () => {
//         const res = await app.post('/api/reviews/:shopId').send({
//             userId : 
//             password: '123',
//             passwordConfirmation: '123',
//         });
//         expect(res.status).toBe(400);
//         expect(res.text).toHaveBeenCalledWith({
//             errorMessage: '비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.',
//     });



// afterAll(async () => {
//     await User.deleteMany({ _id: userIds });
// })