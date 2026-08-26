import { getLookupData } from "@/lib/api/lookups";
import { MobileForm } from "@/components/admin/MobileForm";

export const revalidate = 0;

export default async function NewMobilePage() {
  let lookupData;
  let errorOccurred = false;

  try {
    lookupData = await getLookupData();
  } catch (err) {
    console.log(err);

    errorOccurred = true;
  }

  if (errorOccurred || !lookupData) {
    return (
      <div className="bg-red-950 border border-red-800 p-6 rounded text-red-300 max-w-2xl">
        <h2 className="font-bold text-lg mb-1">Backend Connection Required</h2>
        <p className="text-sm text-red-200">
          Could not fetch lookup data from Spring Boot endpoint at{" "}
          <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">
            http://localhost:8080/api
          </code>
          .
        </p>
        <p className="text-xs text-red-400 mt-2">
          Ensure your Spring Boot backend service is running to populate brands,
          specifications, and stores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Add New Mobile Device
        </h1>
        <p className="text-sm text-slate-400">
          Fill out core details, technical specs, pricing variants, and image
          gallery.
        </p>
      </div>

      <MobileForm lookupData={lookupData} />
    </div>
  );
}
