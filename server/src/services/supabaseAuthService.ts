import { IAuthService, AuthUser } from "../interfaces/IAuthService";
import { createClient, SupabaseClient } from "@supabase/supabase-client";

export class SupabaseAuthService implements IAuthService {
    private supabase: SupabaseClient;

    constructor() {
        const url = process.env.SUPABASE_URL || "";
        const key = process.env.SUPABASE_ANON_KEY || "";
        this.supabase = createClient(url, key);
    }
    
    async validateToken(token: string): Promise<AuthUser | null> {
        return null;
    }
}
