import type { SceneKey } from "@/lib/sections";
import type { RoomComponent } from "./kit";
import AiDeskRoom from "./AiDeskRoom";
import EcgRoom from "./EcgRoom";
import IcuRoom from "./IcuRoom";
import IvRoom from "./IvRoom";
import LabRoom from "./LabRoom";
import LibraryRoom from "./LibraryRoom";
import PharmacyRoom from "./PharmacyRoom";
import StationRoom from "./StationRoom";
import TriageRoom from "./TriageRoom";

/** Rooms drawn on the Home hospital map. */
export const HOSPITAL_ROOMS: Partial<Record<SceneKey, RoomComponent>> = {
  pharmacy: PharmacyRoom,
  lab: LabRoom,
  ecg: EcgRoom,
  icu: IcuRoom,
  triage: TriageRoom,
  station: StationRoom,
  library: LibraryRoom,
  iv: IvRoom,
  ai: AiDeskRoom,
};
