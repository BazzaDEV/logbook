import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});

export default async function Page() {
  return (
    <div>
      <h1 className="text-6xl tracking-tighter font-semibold neutral-500">
        Test Page
      </h1>
      <Editor />
    </div>
  );
}
