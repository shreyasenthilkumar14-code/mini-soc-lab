# Incident 001 — Suspected SSH Brute-Force Attack

## Incident Summary

A series of failed SSH authentication attempts were detected from
source IP `185.220.101.5`.

Five consecutive failed authentication attempts were followed by
a successful login to the `admin` account.

## Severity

CRITICAL

## Detection

Detection Rule: Multiple failed SSH authentication attempts followed
by successful authentication.

## Source IP

185.220.101.5

## Target

SSH service on the monitored Linux server.

## Evidence

- 5 failed authentication attempts
- Attempts targeted the `admin` account
- All failures originated from the same IP address
- A successful authentication occurred shortly afterward
- A session was subsequently opened for the `admin` account

## Investigation

The repeated authentication failures indicate possible brute-force
activity.

The subsequent successful authentication increases the severity of
the event because the attacker may have obtained valid credentials.

The source IP and affected account should be investigated further.

## Recommended Response

1. Review authentication logs surrounding the event.
2. Verify whether the successful login was legitimate.
3. Review activity performed by the `admin` account.
4. Check for additional authentication attempts from the source IP.
5. Consider disabling or resetting the affected credentials if
   compromise is confirmed.
6. Restrict unnecessary SSH access and review SSH authentication
   controls.

## Status

Open — requires further investigation.
