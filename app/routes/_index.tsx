import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { ArrowRightIcon } from "lucide-react";
import { FormSchema } from "~/types/form"; 

export default function Index() {
  const [forms, setForms] = useState<FormSchema[]>([]);

  useEffect(() => {
    const storedForms = localStorage.getItem("form_builder_forms");
    if (storedForms) {
      try {
        const parsed = JSON.parse(storedForms) as FormSchema[];
        setForms(parsed);
      } catch (e) {
        console.error("Failed to parse forms from localStorage", e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800 px-6">
      <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
          🧩 Welcome to Form Builder
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
          Choose an action to get started:
        </p>

        <ul className="space-y-4 mb-6">
          <li>
            <Link
              to="/builder"
              className="flex items-center justify-between p-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg transition-all"
            >
              <span className="font-medium">🔧 Go to Form Builder</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-3">📋 Your Saved Forms</h2>

        {forms.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">No forms found in local storage.</p>
        ) : (
          <ul className="space-y-4">
            {forms.map((form) => (
              <li key={form.id} className="space-y-2">
                <div className="font-semibold text-lg text-zinc-800 dark:text-zinc-100">
                  {form.title}
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/form/${form.id}`}
                    className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200 rounded-md"
                  >
                    📝 Fill Form
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/responses/${form.id}`}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-md"
                  >
                    📊 View Responses
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
