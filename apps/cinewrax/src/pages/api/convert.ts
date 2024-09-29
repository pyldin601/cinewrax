import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the sessionId, transcodingId and encodingParams from NextApiRequest
  // Check that encoding params are valid
  // For each file related to the transcodingId:
  //   Check that the file exists
  //   Generate and pre-sign URL to read the source file
  //   Generate and pre-sign URL to save the destination file
  //   Send convert request to transcoding manager
}
