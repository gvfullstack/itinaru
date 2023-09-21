import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import firebaseAdmin from "../../../firebaseAdmin";

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const userCredential = await firebaseAdmin
            .auth()
            .getUserByEmail(email);
          // Here, validate the password according to your authentication logic
          // For example, you might hash the password and compare it to the stored hash

          if (isPasswordValid) {
            return { email };
          } else {
            throw new Error("Invalid password");
          }
        } catch (error) {
          throw new Error("User not found");
        }
      },
    }),
  ],
});
