import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import api from "../../lib/api";
import { useToast } from "./Toast";
import Button from "./Button";
import Input from "./Input";
import "./LocationOnboarding.css";

interface UserLocation {
  state: string;
  district: string;
  area_name: string;
  pincode: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  location?: UserLocation | null;
  state?: string | null;
  district?: string | null;
  area_name?: string | null;
  pincode?: string | null;
}

function normalizeUser(user: User): User {
  if (user.location || !user.state || !user.district || !user.area_name || !user.pincode) {
    return user;
  }
  const { state, district, area_name, pincode, ...profile } = user;
  return { ...profile, location: { state, district, area_name, pincode } };
}

const dismissalKey = (userId: number) => `location-onboarding-dismissed:${userId}`;

function hasLocation(user: User): boolean {
  const location = user.location ?? user;
  return Boolean(location.pincode?.trim());
}

function readUser(): User | null {
  try {
    const stored = localStorage.getItem("user");
    return stored ? normalizeUser(JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export default function LocationOnboarding() {
  const [user, setUser] = useState<User | null>(readUser);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const syncUser = () => setUser(readUser());
    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  useEffect(() => {
    if (!user || user.role !== "user" || hasLocation(user)) {
      setOpen(false);
      return;
    }
    setOpen(sessionStorage.getItem(dismissalKey(user.id)) !== "true");
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const location: UserLocation = {
      state: String(values.get("state") ?? "").trim(),
      district: String(values.get("district") ?? "").trim(),
      area_name: String(values.get("area_name") ?? "").trim(),
      pincode: String(values.get("pincode") ?? "").trim(),
    };

    if (!location.state) location.state = "";
    if (!location.district) location.district = "";
    if (!location.area_name) location.area_name = "";

    if (!/^\d{6}$/.test(location.pincode)) {
      showToast("error", "PIN code must contain exactly six digits.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.patch("/users/me/location", location);
      const returnedLocation = response.data?.location ?? response.data;
      if (!returnedLocation || typeof returnedLocation !== "object" || !returnedLocation.pincode) {
        throw new Error("The server did not return the saved location. Please try again.");
      }

      const latestUser = readUser();
      if (!latestUser || latestUser.id !== user?.id) {
        throw new Error("Your session changed. Please sign in again and retry.");
      }
      const updatedUser = normalizeUser({ ...latestUser, location: returnedLocation as UserLocation });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOpen(false);
      showToast("success", "Your location has been saved.");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : "We couldn't save your location. Please try again.")
        : error instanceof Error
          ? error.message
          : "We couldn't save your location. Please try again.";
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  }

  function skipForNow() {
    if (!user) return;
    sessionStorage.setItem(dismissalKey(user.id), "true");
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) skipForNow();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("location-onboarding-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("location-onboarding-open");
    };
  }, [open, saving, user]);

  if (!open) return null;

  return (
    <div className="location-modal-backdrop">
      <section className="location-modal" role="dialog" aria-modal="true" aria-labelledby="location-modal-title" aria-describedby="location-modal-description">
        <div className="location-modal-heading">
          <span className="location-modal-icon" aria-hidden="true">⌖</span>
          <span className="location-modal-kicker">HELP YOUR COMMUNITY</span>
          <h2 id="location-modal-title">Add your location</h2>
          <p id="location-modal-description">Your area helps us connect you with nearby dogs and community care.</p>
        </div>

        <form className="location-modal-form" onSubmit={handleSubmit}>
          <Input label="State" name="state" autoComplete="address-level1" maxLength={100} />
          <Input label="District" name="district" autoComplete="address-level2" maxLength={100} />
          <Input label="Area name" name="area_name" autoComplete="address-line1" maxLength={150} />
          <Input label="PIN code" name="pincode" inputMode="numeric" autoComplete="postal-code" required maxLength={6} pattern="[0-9]{6}" title="Enter exactly six digits" hint="PIN code is required to discover nearby dogs. Other location details are optional." />
          <div className="location-modal-actions">
            <Button type="submit" className="location-save-button" disabled={saving}>
              {saving ? "Saving…" : "Save location"}
            </Button>
            <Button type="button" variant="secondary" className="location-skip-button" onClick={skipForNow} disabled={saving}>
              Skip for now
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
