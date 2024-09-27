import { getSessionId } from "../../utils/session";
import { ConvertForm } from "./components/ConvertForm/ConvertForm";

export default function Convert() {
  const sessionId = getSessionId();

  return <ConvertForm sessionId={sessionId} />;
}
