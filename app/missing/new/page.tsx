import { createMissingPet } from '@/app/actions';

export default function NewMissingPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-park">Report a Missing Pet</h1>
      <form action={createMissingPet} className="frame-card space-y-3">
        <label className="block text-sm">Photo<input required name="photo" type="file" accept="image/*" className="mt-1 w-full" /></label>
        <label className="block text-sm">Species<select required name="species" className="mt-1 w-full rounded border p-2"><option>DOG</option><option>CAT</option><option>OTHER</option></select></label>
        <label className="block text-sm">Name<input name="name" className="mt-1 w-full rounded border p-2" /></label>
        <label className="block text-sm">Description<textarea name="description" required className="mt-1 w-full rounded border p-2" /></label>
        <label className="block text-sm">Contact info<input name="contactInfo" required className="mt-1 w-full rounded border p-2" /></label>
        <button className="rounded bg-park px-4 py-2 text-white">Publish missing pet</button>
      </form>
    </div>
  );
}
