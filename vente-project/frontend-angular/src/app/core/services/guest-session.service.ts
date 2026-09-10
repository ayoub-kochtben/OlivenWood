// src/app/core/services/guest-session.service.ts
import { Injectable } from '@angular/core';

const GUEST_KEY = 'guest_session_id';

@Injectable({ providedIn: 'root' })
export class GuestSessionService {

  getSessionId(): string {
    let id = localStorage.getItem(GUEST_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(GUEST_KEY, id);
    }
    return id;
  }

  clear(): void {
    localStorage.removeItem(GUEST_KEY);
  }
}