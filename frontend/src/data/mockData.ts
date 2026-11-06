export interface DogRecord {
  id: number; code: string; age: number; color: string; description: string; sterilized: boolean | null;
  status: string; vaccinationStatus: string; state: string; district: string; area: string; pincode: string;
  image: string; latitude: number; longitude: number;
}

export interface ReportRecord {
  id: number; type: string; description: string; latitude: number; longitude: number;
  status: string; date: string; image: string;
}

export interface VolunteerRecord {
  id: number; username: string; email: string; phoneNumber: string; serviceArea: string;
  availability: string; approvalStatus: string; joined: string; avatar: string;
}

const dogImage = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
export const dogs: DogRecord[] = [
  { id: 1, code: "DT-560001-014", age: 3, color: "Golden brown", description: "Friendly neighborhood dog, often seen near the park entrance.", sterilized: true, status: "active", vaccinationStatus: "vaccinated", state: "Karnataka", district: "Bengaluru Urban", area: "Indiranagar", pincode: "560001", image: dogImage("photo-1552053831-71594a27632d"), latitude: 12.9716, longitude: 77.5946 },
  { id: 2, code: "DT-560002-008", age: 5, color: "Black and tan", description: "Calm and familiar with local residents.", sterilized: false, status: "active", vaccinationStatus: "due", state: "Karnataka", district: "Bengaluru Urban", area: "Koramangala", pincode: "560002", image: dogImage("photo-1543466835-00a7907e9de1"), latitude: 12.9352, longitude: 77.6245 },
  { id: 3, code: "DT-560003-021", age: 2, color: "White and brown", description: "Young dog spotted around the community garden.", sterilized: true, status: "under-care", vaccinationStatus: "vaccinated", state: "Karnataka", district: "Bengaluru Urban", area: "Jayanagar", pincode: "560003", image: dogImage("photo-1583337130417-3346a1be7dee"), latitude: 12.925, longitude: 77.5838 },
  { id: 4, code: "DT-560004-006", age: 7, color: "Cream", description: "Senior dog that rests near the market in the afternoon.", sterilized: true, status: "active", vaccinationStatus: "vaccinated", state: "Karnataka", district: "Bengaluru Urban", area: "Malleshwaram", pincode: "560004", image: dogImage("photo-1516734212186-a967f81ad0d7"), latitude: 13.0035, longitude: 77.5644 },
  { id: 5, code: "DT-560005-019", age: 1, color: "Dark brown", description: "Playful young dog seen near the bus stop.", sterilized: false, status: "active", vaccinationStatus: "pending", state: "Karnataka", district: "Bengaluru Urban", area: "Basavanagudi", pincode: "560005", image: dogImage("photo-1548199973-03cce0bbc87b"), latitude: 12.942, longitude: 77.569 },
  { id: 6, code: "DT-560006-003", age: 4, color: "Grey and white", description: "Usually stays close to the small tea shop.", sterilized: true, status: "under-care", vaccinationStatus: "vaccinated", state: "Karnataka", district: "Bengaluru Urban", area: "Rajajinagar", pincode: "560006", image: dogImage("photo-1530281700549-e82e7bf110d6"), latitude: 13.0108, longitude: 77.553 },
];

const reportImage = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
export const reports: ReportRecord[] = [
  { id: 1, type: "Dog sighting", description: "Friendly brown dog seen near the park entrance. Appears healthy and comfortable around people.", latitude: 12.9716, longitude: 77.5946, status: "reviewed", date: "2026-10-28", image: reportImage("photo-1552053831-71594a27632d") },
  { id: 2, type: "Medical concern", description: "A dog with a visible limp near the market. Could use a welfare check.", latitude: 12.9352, longitude: 77.6245, status: "pending", date: "2026-10-26", image: reportImage("photo-1543466835-00a7907e9de1") },
  { id: 3, type: "Lost dog", description: "Small white and brown dog looking lost near the community garden.", latitude: 12.925, longitude: 77.5838, status: "in-progress", date: "2026-10-24", image: reportImage("photo-1583337130417-3346a1be7dee") },
  { id: 4, type: "Dog sighting", description: "Two dogs resting in the shade beside the bus stop.", latitude: 12.942, longitude: 77.569, status: "reviewed", date: "2026-10-20", image: reportImage("photo-1548199973-03cce0bbc87b") },
];

export const volunteers: VolunteerRecord[] = [
  { id: 1, username: "Ananya Rao", email: "ananya.rao@example.com", phoneNumber: "+91 98765 43210", serviceArea: "Indiranagar", availability: "Weekends · mornings", approvalStatus: "approved", joined: "2025-08-14", avatar: "AR" },
  { id: 2, username: "Kiran Mehta", email: "kiran.mehta@example.com", phoneNumber: "+91 98123 45670", serviceArea: "Koramangala", availability: "Weekday evenings", approvalStatus: "approved", joined: "2025-10-02", avatar: "KM" },
  { id: 3, username: "Meera Nair", email: "meera.nair@example.com", phoneNumber: "+91 99887 76655", serviceArea: "Jayanagar", availability: "Flexible", approvalStatus: "pending", joined: "2026-01-19", avatar: "MN" },
  { id: 4, username: "Arjun Das", email: "arjun.das@example.com", phoneNumber: "+91 98450 12345", serviceArea: "Malleshwaram", availability: "Weekends", approvalStatus: "approved", joined: "2026-03-08", avatar: "AD" },
];

export const profile = { username: "Ananya Rao", email: "ananya.rao@example.com", role: "Volunteer", createdAt: "August 14, 2025", avatar: "AR" };
