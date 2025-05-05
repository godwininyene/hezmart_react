import { redirect } from "react-router-dom";

export async function requireAuth(request, requiredRole = null) {
    const pathname = new URL(request.url).pathname;
    const activeUser = JSON.parse(localStorage.getItem("user"));
    // 1. Check if user is logged in
    if (!activeUser) {
        const response = redirect(`/login?message=You must login first&redirectTo=${pathname}`);
        return response;
    }
    
    // 2. If role is specified, check if user has the required role
    if (requiredRole && activeUser.role !== requiredRole) {
        // Option 1: Redirect to login with message
        return redirect(`/login?message=Unauthorized access&redirectTo=${pathname}`);
        // Option 2: Redirect to not-found page (recommended)
        return redirect(`/not-found`);
        // Option 3: Throw error that can be caught by errorElement
        // throw new Response("Forbidden", { status: 403 });
    }
    // 3. Return user data if needed by the loader
    return { user: activeUser };
}