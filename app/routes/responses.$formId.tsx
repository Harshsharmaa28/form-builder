import { useParams } from "@remix-run/react";
import ResponseViewer from "~/components/ResponseViewer";

export default function Responses() {
  const { formId } = useParams();
  return <ResponseViewer formId={formId} />;
}
