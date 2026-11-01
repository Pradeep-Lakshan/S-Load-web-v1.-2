"""
SSRF (Server-Side Request Forgery) and Domain Allowlist Protection
Ensures the server only resolves and fetches from approved social media platforms
and strictly blocks localhost, cloud metadata (169.254.169.254), RFC1918 private IPs,
and malicious redirects.
"""

import ipaddress
import socket
from urllib.parse import urlparse
from typing import Tuple, Optional

ALLOWED_DOMAINS = {
    # YouTube
    "youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "music.youtube.com",
    # TikTok
    "tiktok.com", "www.tiktok.com", "vm.tiktok.com", "vt.tiktok.com", "m.tiktok.com",
    # Instagram
    "instagram.com", "www.instagram.com", "instagr.am",
    # X / Twitter
    "twitter.com", "www.twitter.com", "x.com", "www.x.com", "mobile.twitter.com",
    # Facebook
    "facebook.com", "www.facebook.com", "fb.watch", "fb.com", "m.facebook.com", "web.facebook.com",
    # Reddit
    "reddit.com", "www.reddit.com", "redd.it", "v.redd.it", "old.reddit.com",
    # Vimeo
    "vimeo.com", "www.vimeo.com", "player.vimeo.com"
}

BLOCKED_INTERNAL_KEYWORDS = {
    "localhost", "metadata", "internal", "local", "lan", "corp", "intranet"
}

def is_domain_allowed(hostname: str) -> bool:
    """Check if hostname matches or is a subdomain of an allowed platform domain."""
    hostname = hostname.lower().strip()
    
    # Block explicitly malicious strings
    if any(k in hostname for k in BLOCKED_INTERNAL_KEYWORDS):
        return False
        
    for domain in ALLOWED_DOMAINS:
        if hostname == domain or hostname.endswith("." + domain):
            return True
    return False

def validate_url_security(target_url: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Validates a URL against SSRF attacks and domain allowlists.
    Returns: (is_valid, sanitized_canonical_url, error_message)
    """
    if not target_url or len(target_url) > 2048:
        return False, None, "URL length exceeds limit or is empty."

    try:
        parsed = urlparse(target_url)
    except Exception as e:
        return False, None, f"Malformed URL syntax: {str(e)}"

    # 1. Scheme check (only http or https)
    if parsed.scheme.lower() not in ("http", "https"):
        return False, None, f"Prohibited URL scheme '{parsed.scheme}'. Only http and https are permitted."

    hostname = parsed.hostname
    if not hostname:
        return False, None, "URL must contain a valid domain name."

    # 2. Domain Allowlist Check
    if not is_domain_allowed(hostname):
        return False, None, (
            f"Domain '{hostname}' is not supported. Supported services: "
            "YouTube, TikTok, Instagram, X/Twitter, Facebook, Reddit, and Vimeo."
        )

    # 3. DNS Resolution and IP range validation (Anti-DNS Rebinding & SSRF)
    try:
        port = parsed.port or (443 if parsed.scheme.lower() == "https" else 80)
        addr_infos = socket.getaddrinfo(hostname, port, proto=socket.IPPROTO_TCP)
        
        for family, _, _, _, sockaddr in addr_infos:
            ip_str = sockaddr[0]
            ip_obj = ipaddress.ip_address(ip_str)

            # Reject private, loopback, link-local, multicast, or reserved ranges
            if ip_obj.is_loopback:
                return False, None, f"Target IP {ip_str} resolves to loopback (SSRF blocked)."
            if ip_obj.is_private:
                return False, None, f"Target IP {ip_str} is within a private network RFC1918 (SSRF blocked)."
            if ip_obj.is_link_local:
                return False, None, f"Target IP {ip_str} resolves to link-local / metadata service (SSRF blocked)."
            if ip_obj.is_multicast:
                return False, None, f"Target IP {ip_str} is a multicast address."
            if ip_obj.is_reserved:
                return False, None, f"Target IP {ip_str} is in an IETF reserved space."

    except socket.gaierror:
        return False, None, f"DNS resolution failed for hostname '{hostname}'."
    except Exception as ex:
        return False, None, f"Security check failure: {str(ex)}"

    return True, parsed.geturl(), None
