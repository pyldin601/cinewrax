import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the sessionId, transcodingId and fileId from NextApiRequest
  // Generate and pre-sign a file upload URL
  // Respond with a file upload URL
}
