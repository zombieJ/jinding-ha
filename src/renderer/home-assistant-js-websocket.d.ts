declare module 'home-assistant-js-websocket' {
  export interface Auth {}

  export type getAuth = (info?: { hassUrl?: string }) => Auth;

  // HashCode: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMGQ0OTg4Y2RmNWM0NmMwOWMxY2ExMDU4YWJiZmFkYiIsImlhdCI6MTc1ODAzNzY3MywiZXhwIjoyMDczMzk3NjczfQ.Y1YPIotO4CbLt7rJ7tHAaP9fCxIEGH9NoL0_1XRzyXo
}
