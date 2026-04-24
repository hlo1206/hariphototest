import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { supabase, PHOTO_BUCKET } from "@/lib/supabase";
import { useCategories, useSubcategories, usePhotos } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Star, StarOff, Plus, LogOut, Upload } from "lucide-react";
import type { AspectRatio } from "@/lib/types";

const SESSION_KEY = "frames_admin_session";

function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState("hariom");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: rpcErr } = await supabase.rpc("verify_admin", {
      p_username: username.trim(),
      p_password: password,
    });
    setLoading(false);
    if (rpcErr) {
      setError(rpcErr.message);
      return;
    }
    if (data !== true) {
      setError("Invalid username or password.");
      return;
    }
    localStorage.setItem(SESSION_KEY, username.trim());
    onLoggedIn();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-sm bg-secondary/30 border border-border p-8"
      >
        <h1 className="font-serif text-3xl mb-2">Admin Sign In</h1>
        <p className="text-sm text-muted-foreground mb-8 font-light">
          Manage your portfolio collections.
        </p>

        <label className="block mb-4">
          <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Username
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full px-4 py-3 bg-background border border-border focus:border-primary outline-none"
          />
        </label>

        <label className="block mb-6">
          <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-3 bg-background border border-border focus:border-primary outline-none"
          />
        </label>

        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-foreground text-background uppercase tracking-widest text-sm hover:bg-primary transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </motion.form>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const qc = useQueryClient();
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();
  const { data: photos = [] } = usePhotos();

  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubCatId, setNewSubCatId] = useState("");

  const [uploadCatId, setUploadCatId] = useState("");
  const [uploadSubId, setUploadSubId] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadAspect, setUploadAspect] = useState<AspectRatio>("portrait");
  const [uploadFeatured, setUploadFeatured] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["subcategories"] });
    qc.invalidateQueries({ queryKey: ["photos"] });
  };

  const subsForUpload = subcategories.filter(
    (s) => s.category_id === uploadCatId,
  );

  const addCategory = async () => {
    if (!newCatSlug || !newCatName) return;
    setBusy(true);
    const { error } = await supabase
      .from("categories")
      .insert({ slug: newCatSlug.toLowerCase().trim(), name: newCatName.trim() });
    setBusy(false);
    if (error) return setMsg(error.message);
    setNewCatSlug("");
    setNewCatName("");
    setMsg("Category added.");
    refresh();
  };

  const addSubcategory = async () => {
    if (!newSubCatId || !newSubName) return;
    setBusy(true);
    const { error } = await supabase
      .from("subcategories")
      .insert({ category_id: newSubCatId, name: newSubName.trim() });
    setBusy(false);
    if (error) return setMsg(error.message);
    setNewSubName("");
    setMsg("Sub-category added.");
    refresh();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its photos?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return setMsg(error.message);
    refresh();
  };

  const deleteSubcategory = async (id: string) => {
    if (!confirm("Delete this sub-category? Photos will keep the parent category.")) return;
    const { error } = await supabase.from("subcategories").delete().eq("id", id);
    if (error) return setMsg(error.message);
    refresh();
  };

  const uploadPhoto = async () => {
    if (!uploadCatId || !uploadFile) {
      setMsg("Choose a category and a photo.");
      return;
    }
    setBusy(true);
    setMsg("Uploading…");
    const ext = uploadFile.name.split(".").pop() ?? "jpg";
    const path = `${uploadCatId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, uploadFile, { contentType: uploadFile.type });
    if (upErr) {
      setBusy(false);
      return setMsg(upErr.message);
    }
    const { error: dbErr } = await supabase.from("photos").insert({
      category_id: uploadCatId,
      subcategory_id: uploadSubId || null,
      title: uploadTitle || null,
      storage_path: path,
      aspect_ratio: uploadAspect,
      is_featured: uploadFeatured,
    });
    setBusy(false);
    if (dbErr) return setMsg(dbErr.message);
    setMsg("Photo added.");
    setUploadTitle("");
    setUploadFile(null);
    setUploadFeatured(false);
    if (fileRef.current) fileRef.current.value = "";
    refresh();
  };

  const deletePhoto = async (id: string, storagePath: string) => {
    if (!confirm("Delete this photo permanently?")) return;
    await supabase.storage.from(PHOTO_BUCKET).remove([storagePath]);
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) return setMsg(error.message);
    refresh();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("photos")
      .update({ is_featured: !current })
      .eq("id", id);
    if (error) return setMsg(error.message);
    refresh();
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
            Admin
          </p>
          <h1 className="font-serif text-4xl md:text-5xl">Dashboard</h1>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-2 border border-border text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {msg && (
        <div className="mb-8 p-3 border border-border bg-secondary/40 text-sm">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Add Category */}
        <section className="bg-secondary/30 border border-border p-6">
          <h2 className="font-serif text-2xl mb-6">Add Category</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="URL slug (e.g. weddings)"
              value={newCatSlug}
              onChange={(e) => setNewCatSlug(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Display name (e.g. Weddings)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border outline-none focus:border-primary"
            />
            <button
              onClick={addCategory}
              disabled={busy}
              className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background uppercase text-sm tracking-wider hover:bg-primary transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <ul className="mt-6 divide-y divide-border">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5">
                <span>
                  <span className="font-medium">{c.name}</span>{" "}
                  <span className="text-xs text-muted-foreground">/c/{c.slug}</span>
                </span>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive"
                  aria-label="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Add Subcategory */}
        <section className="bg-secondary/30 border border-border p-6">
          <h2 className="font-serif text-2xl mb-6">Add Sub-Category</h2>
          <div className="space-y-3">
            <select
              value={newSubCatId}
              onChange={(e) => setNewSubCatId(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border outline-none focus:border-primary"
            >
              <option value="">Choose parent category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Sub-category name (e.g. Baner)"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border outline-none focus:border-primary"
            />
            <button
              onClick={addSubcategory}
              disabled={busy}
              className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background uppercase text-sm tracking-wider hover:bg-primary transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <ul className="mt-6 divide-y divide-border">
            {subcategories.map((s) => {
              const cat = categories.find((c) => c.id === s.category_id);
              return (
                <li key={s.id} className="flex items-center justify-between py-2.5">
                  <span>
                    <span className="font-medium">{s.name}</span>{" "}
                    <span className="text-xs text-muted-foreground">
                      under {cat?.name}
                    </span>
                  </span>
                  <button
                    onClick={() => deleteSubcategory(s.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive"
                    aria-label="Delete sub-category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Upload Photo */}
      <section className="bg-secondary/30 border border-border p-6 mb-16">
        <h2 className="font-serif text-2xl mb-6">Upload Photo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={uploadCatId}
            onChange={(e) => {
              setUploadCatId(e.target.value);
              setUploadSubId("");
            }}
            className="px-4 py-2.5 bg-background border border-border outline-none focus:border-primary"
          >
            <option value="">Choose category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={uploadSubId}
            onChange={(e) => setUploadSubId(e.target.value)}
            disabled={subsForUpload.length === 0}
            className="px-4 py-2.5 bg-background border border-border outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="">No sub-category</option>
            {subsForUpload.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Title (optional)"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className="px-4 py-2.5 bg-background border border-border outline-none focus:border-primary"
          />
          <select
            value={uploadAspect}
            onChange={(e) => setUploadAspect(e.target.value as AspectRatio)}
            className="px-4 py-2.5 bg-background border border-border outline-none focus:border-primary"
          >
            <option value="portrait">Portrait (3:4)</option>
            <option value="landscape">Landscape (4:3)</option>
            <option value="square">Square (1:1)</option>
          </select>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            className="px-4 py-2.5 bg-background border border-border outline-none focus:border-primary file:mr-4 file:py-1.5 file:px-3 file:border-0 file:bg-foreground file:text-background file:uppercase file:text-xs file:tracking-wider"
          />
          <label className="flex items-center gap-3 px-4 py-2.5">
            <input
              type="checkbox"
              checked={uploadFeatured}
              onChange={(e) => setUploadFeatured(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Show on home page (Featured)</span>
          </label>
        </div>
        <button
          onClick={uploadPhoto}
          disabled={busy}
          className="mt-4 flex items-center gap-2 px-5 py-3 bg-foreground text-background uppercase text-sm tracking-wider hover:bg-primary transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
      </section>

      {/* Existing Photos */}
      <section>
        <h2 className="font-serif text-2xl mb-6">All Photos ({photos.length})</h2>
        {photos.length === 0 ? (
          <p className="text-muted-foreground font-light">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((p) => (
              <div
                key={p.id}
                className="relative group bg-muted aspect-square overflow-hidden"
              >
                <img
                  src={p.src}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                {p.isFeatured && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1">
                    <Star className="w-3 h-3" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-white text-center">
                  <p className="text-xs">{p.category}</p>
                  {p.subCategory && (
                    <p className="text-xs opacity-70">{p.subCategory}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => toggleFeatured(p.id, p.isFeatured)}
                      className="p-2 bg-white/10 hover:bg-white/20"
                      aria-label="Toggle featured"
                      title={p.isFeatured ? "Remove from featured" : "Add to featured"}
                    >
                      {p.isFeatured ? (
                        <StarOff className="w-4 h-4" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deletePhoto(p.id, p.storagePath)}
                      className="p-2 bg-white/10 hover:bg-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          <StarOff className="inline w-3 h-3 mr-1" />
          Tip: hover any photo to feature it on the home page or remove it.
        </p>
      </section>
    </div>
  );
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem(SESSION_KEY));
    setLoaded(true);
  }, []);

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  };

  if (!loaded) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
          Loading…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {loggedIn ? (
        <Dashboard onSignOut={signOut} />
      ) : (
        <LoginForm onLoggedIn={() => setLoggedIn(true)} />
      )}
    </Layout>
  );
}
