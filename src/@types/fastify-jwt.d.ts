import '@fastify/jwt';

// This command "merges" our definition with the original library's types.
declare module '@fastify/jwt' {
  // This is the interface for the object that gets attached to `request.user`
  // after a successful `jwtVerify()`.
  interface FastifyJWT {
    user: {
      sub: string;
      username: string;
    }
  }
}