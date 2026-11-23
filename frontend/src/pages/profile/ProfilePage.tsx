import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { MapPin, Pencil, UserRound, X } from "lucide-react";
import api from "../../lib/api";
import { useToast } from "../../components/ui/Toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

interface UserLocation {
  state: string;
  district: string;
  area_name: string;
  pincode: string;
}

interface ProfileUser {
  id: number;
  username: string;
  email: string;
  phone_number?: string | null;
  role: string;
  created_at?: string;
  location?: UserLocation | null;
  state?: string | null;
  district?: string | null;
  area_name?: string | null;
  pincode?: string | null;
}

const userUpdatedEvent = "dog-territory:user-updated";

function readUser(): ProfileUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as ProfileUser) : null;
  } catch {
    return null;
  }
}

function getLocation(user: ProfileUser): UserLocation | null {
  if (user.location) return user.location;
  if (user.state && user.district && user.area_name && user.pincode) {
    return {
      state: user.state,
      district: user.district,
      area_name: user.area_name,
      pincode: user.pincode,
    };
  }
  return null;
}

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    user: "Community Member",
    volunteer: "Community Volunteer",
    veterinarian: "Veterinarian",
    admin: "Administrator",
  };
  return labels[role.toLowerCase()] ?? role;
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(readUser);
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileUsername, setProfileUsername] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const location = user ? getLocation(user) : null;

  useEffect(() => {
    const syncUser = () => setUser(readUser());
    window.addEventListener("storage", syncUser);
    window.addEventListener(userUpdatedEvent, syncUser);
    window.addEventListener("focus", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(userUpdatedEvent, syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      const existingUser = readUser();
      if (!existingUser) return;
      try {
        const response = await api.get<ProfileUser>("/users/me");
        if (!active) return;
        const latestUser = readUser();
        if (!latestUser || latestUser.id !== existingUser.id) return;
        const hydratedUser = { ...latestUser, ...response.data };
        localStorage.setItem("user", JSON.stringify(hydratedUser));
        setUser(hydratedUser);
        window.dispatchEvent(new Event(userUpdatedEvent));
      } catch {
        // Keep the signed-in user's cached account visible if the profile request is unavailable.
      }
    }
    void loadProfile();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!editingLocation) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) setEditingLocation(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("location-onboarding-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("location-onboarding-open");
    };
  }, [editingLocation, saving]);

  async function saveLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || saving) return;
    const form = new FormData(event.currentTarget);
    const updatedLocation: UserLocation = {
      state: String(form.get("state") ?? "").trim(),
      district: String(form.get("district") ?? "").trim(),
      area_name: String(form.get("area_name") ?? "").trim(),
      pincode: String(form.get("pincode") ?? "").trim(),
    };
    if (!updatedLocation.state || !updatedLocation.district || !updatedLocation.area_name) {
      showToast("error", "Please complete all location fields.");
      return;
    }
    if (!/^\d{6}$/.test(updatedLocation.pincode)) {
      showToast("error", "PIN code must contain exactly six digits.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.patch("/users/me/location", updatedLocation);
      const data = response.data as { location?: UserLocation } | UserLocation;
      const savedLocation = "location" in data && data.location ? data.location : data as UserLocation;
      if (!savedLocation || typeof savedLocation !== "object" || !savedLocation.state) {
        throw new Error("The server did not return the saved location. Please try again.");
      }
      const latestUser = readUser();
      if (!latestUser || latestUser.id !== user.id) {
        throw new Error("Your session changed. Please sign in again and retry.");
      }
      const updatedUser = { ...latestUser, location: savedLocation };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event(userUpdatedEvent));
      setEditingLocation(false);
      showToast("success", "Your location has been saved.");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (typeof error.response?.data?.detail === "string" ? error.response.data.detail : "We couldn't save your location. Please try again.")
        : error instanceof Error ? error.message : "We couldn't save your location. Please try again.";
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || saving) return;
    const username = profileUsername.trim();
    const compactPhone = profilePhone.replace(/[\s()-]/g, "");
    if (!username) {
      showToast("error", "Username cannot be blank.");
      return;
    }
    if (compactPhone && !/^(?:\+91)?[6-9]\d{9}$/.test(compactPhone)) {
      showToast("error", "Enter a valid 10 digit Indian mobile number.");
      return;
    }

    setSaving(true);
    try {
      const digits = compactPhone.replace(/\D/g, "");
      const phoneNumber = compactPhone ? `+91${digits.slice(-10)}` : null;
      const response = await api.patch<ProfileUser>("/users/me", { username, phone_number: phoneNumber });
      const latestUser = readUser();
      if (!latestUser || latestUser.id !== user.id) {
        throw new Error("Your session changed. Please sign in again and retry.");
      }
      const updatedUser = { ...latestUser, ...response.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event(userUpdatedEvent));
      setEditingProfile(false);
      showToast("success", "Your profile has been saved.");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (typeof error.response?.data?.detail === "string" ? error.response.data.detail : "We couldn't save your profile. Please try again.")
        : error instanceof Error ? error.message : "We couldn't save your profile. Please try again.";
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  }

  const initials = user?.username.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[1.5px] text-indigo-500">YOUR ACCOUNT</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Your account information and community details.</p>
      </div>

      {!user ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <UserRound className="mx-auto mb-3 text-slate-400" size={30} />
          <h2 className="font-semibold text-slate-900">Profile information unavailable</h2>
          <p className="mt-2 text-sm text-slate-500">Please sign in again to view your account details.</p>
        </section>
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-24 bg-gradient-to-r from-indigo-100 via-violet-50 to-teal-50" />
            <div className="flex flex-wrap items-center gap-4 px-5 pb-5 sm:px-7">
              <div className="-mt-8 grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-indigo-100 text-xl font-bold text-indigo-700">{initials}</div>
              <div className="min-w-0 flex-1 pt-3">
                <h2 className="truncate text-lg font-bold text-slate-900">{user.username}</h2>
                <p className="truncate text-sm text-slate-500">{user.email}</p>
              </div>
              <span className="mt-3 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">{roleLabel(user.role)}</span>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="font-bold text-slate-900">Personal information</h2>
                <p className="mt-1 text-sm text-slate-500">Details associated with your Dog Territory account.</p>
              </div>
              <dl className="divide-y divide-slate-100">
                <div className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-slate-500">Username</dt><dd className="flex items-center gap-3 text-right text-sm font-semibold text-slate-800">{user.username}<button type="button" className="text-indigo-600 hover:text-indigo-800" onClick={() => { setProfileUsername(user.username); setProfilePhone(user.phone_number ?? ""); setEditingProfile(true); }}>Edit</button></dd></div>
                <div className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-slate-500">Email address</dt><dd className="break-all text-right text-sm font-semibold text-slate-800">{user.email}</dd></div>
                <div className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-slate-500">Phone number</dt><dd className="flex items-center gap-3 text-right text-sm text-slate-800"><span className={user.phone_number ? "font-semibold" : "text-slate-400"}>{user.phone_number ?? "Not provided"}</span><button type="button" className="font-semibold text-indigo-600 hover:text-indigo-800" onClick={() => { setProfileUsername(user.username); setProfilePhone(user.phone_number ?? ""); setEditingProfile(true); }}>Edit</button></dd></div>
                <div className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-slate-500">Role</dt><dd className="text-right text-sm font-semibold text-slate-800">{roleLabel(user.role)}</dd></div>
                {user.created_at && <div className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-slate-500">Member since</dt><dd className="text-right text-sm font-semibold text-slate-800">{new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</dd></div>}
              </dl>
              <p className="mt-3 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">You can update your username and phone number at any time.</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div><h2 className="font-bold text-slate-900">Location information</h2><p className="mt-1 text-sm text-slate-500">Your area helps connect you with nearby dogs and community care.</p></div>
                <MapPin className="shrink-0 text-indigo-500" size={21} />
              </div>
              {location ? (
                <dl className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                  <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">State</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-800">{location.state}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">District</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-800">{location.district}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Area name</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-800">{location.area_name}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">PIN code</dt><dd className="mt-1 text-sm font-semibold text-slate-800">{location.pincode}</dd></div>
                </dl>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center">
                  <MapPin className="mx-auto text-slate-400" size={26} />
                  <p className="mt-3 text-sm font-semibold text-slate-800">You haven't added your location yet</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Add your area to help us connect you with nearby community care.</p>
                </div>
              )}
              <Button type="button" className="mt-4 w-full justify-center sm:w-auto" onClick={() => setEditingLocation(true)}>
                {location ? <><Pencil size={15} /> Edit location</> : <><MapPin size={15} /> Add location</>}
              </Button>
            </section>
          </div>
        </>
      )}

      {editingLocation && user && (
        <div className="location-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditingLocation(false); }}>
          <section className="location-modal" role="dialog" aria-modal="true" aria-labelledby="profile-location-title" aria-describedby="profile-location-description">
            <div className="location-modal-heading">
              <span className="location-modal-icon" aria-hidden="true"><MapPin size={22} /></span>
              <span className="location-modal-kicker">YOUR COMMUNITY</span>
              <h2 id="profile-location-title">{location ? "Edit your location" : "Add your location"}</h2>
              <p id="profile-location-description">Your area helps us connect you with nearby dogs and community care.</p>
            </div>
            <form className="location-modal-form" onSubmit={saveLocation}>
              <Input label="State" name="state" autoComplete="address-level1" required maxLength={100} defaultValue={location?.state ?? ""} />
              <Input label="District" name="district" autoComplete="address-level2" required maxLength={100} defaultValue={location?.district ?? ""} />
              <Input label="Area name" name="area_name" autoComplete="address-line1" required maxLength={150} defaultValue={location?.area_name ?? ""} />
              <Input label="PIN code" name="pincode" inputMode="numeric" autoComplete="postal-code" required maxLength={6} pattern="[0-9]{6}" title="Enter exactly six digits" hint="Enter your six digit postal PIN code." defaultValue={location?.pincode ?? ""} />
              <div className="location-modal-actions">
                <Button type="submit" className="location-save-button" disabled={saving}>{saving ? "Saving…" : "Save location"}</Button>
                <Button type="button" variant="secondary" className="location-skip-button" onClick={() => setEditingLocation(false)} disabled={saving}><X size={14} /> Cancel</Button>
              </div>
            </form>
          </section>
        </div>
      )}

      {editingProfile && user && (
        <div className="location-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditingProfile(false); }}>
          <section className="location-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
            <div className="location-modal-heading">
              <span className="location-modal-icon" aria-hidden="true"><Pencil size={20} /></span>
              <span className="location-modal-kicker">YOUR ACCOUNT</span>
              <h2 id="profile-edit-title">Edit your profile</h2>
              <p>Update the username and phone number on your account.</p>
            </div>
            <form className="location-modal-form" onSubmit={saveProfile}>
              <Input label="Username" name="username" required minLength={1} maxLength={100} value={profileUsername} onChange={(event) => setProfileUsername(event.target.value)} autoComplete="name" />
              <Input label="Phone number" name="phone_number" type="tel" maxLength={20} value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} autoComplete="tel" placeholder="98765 43210" hint="Enter a valid 10 digit Indian mobile number. Leave blank to remove it." />
              <div className="location-modal-actions">
                <Button type="submit" className="location-save-button" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
                <Button type="button" variant="secondary" className="location-skip-button" onClick={() => setEditingProfile(false)} disabled={saving}><X size={14} /> Cancel</Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
