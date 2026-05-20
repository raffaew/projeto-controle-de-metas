import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {

  interface Session {
    backendToken: string;
    backendId: string;
  }

  interface User {
    backendToken?: string;
    backendId?: string;
  }
}

declare module "next-auth/jwt" {

  interface JWT {
    backendToken?: string;
    backendId?: string;
  }
}