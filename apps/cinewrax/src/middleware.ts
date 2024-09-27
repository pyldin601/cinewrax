import { NextMiddleware, NextResponse } from "next/server";
import { initSessionId } from "./utils/session";

export const middleware: NextMiddleware = (request) => {
  const response = NextResponse.next();

  initSessionId(request, response);

  return response;
};
