import { useParams } from "@remix-run/react";
import FormFiller from "~/components/FormFiller";

export default function Form() {
  const { formId } = useParams();
  
  return <FormFiller formId={formId} />;
}
