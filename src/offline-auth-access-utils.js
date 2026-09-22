export function hasTrustedOfflineSession({
  online=true,
  explicitlySignedOut=false,
  knownSignedIn=false,
  androidShell=false,
  androidStoredAuth=false
}={}){
  if(online!==false || explicitlySignedOut) return false;
  return !!(knownSignedIn || (androidShell && androidStoredAuth));
}
